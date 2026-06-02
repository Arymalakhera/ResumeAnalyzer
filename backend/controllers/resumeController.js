const fs = require('fs');
const mammoth = require('mammoth');
const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Gemini
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a resume file.' });
        }

        const filePath = req.file.path;
        let resumeText = '';

        // Extract text based on file type
        if (req.file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);

            const { PDFParse } = require('pdf-parse');

            const parser = new PDFParse({ data: dataBuffer });
            const data = await parser.getText();
            resumeText = data.text;

            await parser.destroy();

        } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // DOCX files use mammoth, which works perfectly in Node 24
            const result = await mammoth.extractRawText({ path: filePath });
            resumeText = result.value;
        }

        // Delete temporary file
        fs.unlinkSync(filePath);

        const jobDescription = req.body.jobDescription;

        // Talk to Gemini
        let prompt = "";

        if (jobDescription && jobDescription.trim().length > 0) {
            prompt = `
You are an expert resume analyst and hiring specialist with deep knowledge of ATS systems, job description parsing, and what top companies look for when evaluating candidates.

A user has provided their resume AND a job description (or job role title). Your task is to perform a deep job-fit analysis and return your response ONLY as a valid JSON object — no markdown, no explanation, no preamble, no trailing text.

---

INPUTS YOU WILL RECEIVE:
- RESUME: The full text of the candidate's resume
- JOB DESCRIPTION or ROLE: Either the full JD text, or just a role title (e.g. "Senior Frontend Engineer at a fintech startup")

---

ANALYSIS INSTRUCTIONS:

Analyse the resume against the job description across 7 sections as described below. Be specific — reference actual lines from the resume and actual requirements from the JD. Every suggestion must be directly tied to something in the JD or resume. First, extract the candidate's personal and contact details (name, email, phone, location, LinkedIn link, GitHub link, and portfolio/website link) from the resume and output it as a personal_info object at the root of the JSON.

---

SECTION 1 — MATCH SCORES (0–100)
Calculate:

- overall_match_score: Overall fit for this specific role (0–100)
- overall_verdict: one-line plain English summary (e.g. "Strong fit — apply now" or "Moderate fit — 3 key gaps to fix")
- skills_match_score: % of required skills the candidate has (0–100)
- experience_match_score: How well the depth, domain, and seniority of experience matches (0–100)
- education_match_score: How well education matches the JD requirement (0–100)
- keyword_coverage_score: % of important JD keywords present in the resume (0–100)

---

SECTION 2 — SKILLS GAP ANALYSIS
From the job description, extract all required and preferred skills. Then for each skill, classify it:

- matched: Skill is clearly present and demonstrated in the resume
- partial: Skill is mentioned but not well demonstrated, or only briefly referenced
- missing: Skill is required/preferred in the JD but absent from the resume

Return three arrays:
- matched_skills: array of skill names
- partial_skills: array of { skill, note } — what's there and what's missing
- missing_skills: array of { skill, importance } where importance is "required" or "preferred"

---

SECTION 3 — EXPERIENCE ALIGNMENT
Evaluate these dimensions:

- years_required: What the JD asks for (e.g. "5+ years")
- years_candidate: What the resume shows (e.g. "4 years")
- years_status: "meets" | "close" | "gap"
- leadership_required: Does the JD require leadership/mentoring? (true/false)
- leadership_shown: Does the resume demonstrate it? (true/false)
- leadership_note: What is present or missing in the resume regarding leadership
- domain_relevance: How relevant is the candidate's industry/domain experience? ("high" | "medium" | "low", with a note)
- company_size_match: Does the candidate's background match the company size/stage? (note: what the JD implies and what the resume shows)
- seniority_signals: array of signals in the resume that indicate seniority level (or note their absence)

---

SECTION 4 — JD KEYWORD COVERAGE
Analyse keyword presence across four categories, each as a percentage:

- hard_skills_coverage: % of hard skill keywords from JD found in resume
- soft_skills_coverage: % of soft skill / behavioural keywords from JD found in resume
- role_specific_phrases_coverage: % of role-specific phrases (e.g. "micro-frontends", "cross-functional collaboration", "P&L ownership") found in resume
- company_values_coverage: If the JD mentions company values or culture (e.g. "move fast", "customer obsessed", "data-driven"), how many are echoed in the resume

Also return:
- top_missing_keywords: array of the 5 most important JD keywords completely absent from the resume

---

SECTION 5 — BENCHMARK VS TYPICAL APPLICANTS
Based on the role, estimate how this candidate compares to the average applicant pool:

- skills_coverage_vs_avg: "above_average" | "average" | "below_average" with a note
- experience_depth_vs_avg: "above_average" | "average" | "below_average" with a note
- portfolio_projects: Does the resume link to or mention a portfolio/GitHub/projects? ("present" | "absent"), with note on impact
- certifications_vs_avg: How many certifications does the candidate have vs what's typical for this role, with note

---

SECTION 6 — TAILORING RECOMMENDATIONS
Return an ordered array of the top 5 most impactful resume changes specifically for THIS job. For each:
- priority: 1 to 5
- type: "rewrite" | "add" | "remove" | "reorder" | "link"
- title: short label
- instruction: exactly what to change and how — be specific, quote from the JD where relevant
- impact: why this change increases the match score or clears an ATS filter

---

SECTION 7 — APPLICATION VERDICT
Give a final plain-English verdict:

- verdict: "apply_now" | "apply_with_edits" | "significant_gap" | "not_recommended"
- headline: one bold line (e.g. "Apply — but fix 3 things first")
- reasoning: 2–3 sentences explaining the verdict
- estimated_match_after_edits: estimated match score (0–100) if the top 3 suggestions are implemented
- ats_will_pass: true | false — will this resume currently pass ATS for this role
- ats_blocker: if false, what is the single biggest ATS blocker right now

---

RETURN FORMAT:
Return ONLY this JSON structure. No markdown. No text before or after.

{
  "personal_info": {
    "name": "Full name of the candidate",
    "email": "Email address",
    "phone": "Phone number",
    "location": "Location (city, country)",
    "linkedin": "LinkedIn profile URL",
    "github": "GitHub URL (if present)",
    "portfolio": "Portfolio/Website URL (if present)"
  },
  "match_scores": {
    "overall_match_score": 0,
    "overall_verdict": "",
    "skills_match_score": 0,
    "experience_match_score": 0,
    "education_match_score": 0,
    "keyword_coverage_score": 0
  },
  "skills_gap": {
    "matched_skills": [],
    "partial_skills": [{ "skill": "", "note": "" }],
    "missing_skills": [{ "skill": "", "importance": "" }]
  },
  "experience_alignment": {
    "years_required": "",
    "years_candidate": "",
    "years_status": "",
    "leadership_required": false,
    "leadership_shown": false,
    "leadership_note": "",
    "domain_relevance": { "level": "", "note": "" },
    "company_size_match": "",
    "seniority_signals": []
  },
  "keyword_coverage": {
    "hard_skills_coverage": 0,
    "soft_skills_coverage": 0,
    "role_specific_phrases_coverage": 0,
    "company_values_coverage": 0,
    "top_missing_keywords": []
  },
  "benchmark": {
    "skills_coverage_vs_avg": { "rating": "", "note": "" },
    "experience_depth_vs_avg": { "rating": "", "note": "" },
    "portfolio_projects": { "status": "", "note": "" },
    "certifications_vs_avg": { "count": 0, "note": "" }
  },
  "tailoring_recommendations": [
    {
      "priority": 1,
      "type": "",
      "title": "",
      "instruction": "",
      "impact": ""
    }
  ],
  "verdict": {
    "verdict": "",
    "headline": "",
    "reasoning": "",
    "estimated_match_after_edits": 0,
    "ats_will_pass": true,
    "ats_blocker": ""
  }
}

Job Description:
${jobDescription}

Resume Text:
${resumeText}
            `;
        } else {
            prompt = `
You are an expert resume analyst with 15+ years of experience in hiring, ATS systems, and recruitment across top tech and non-tech companies.

A user has uploaded their resume. Perform a deep, structured analysis and return your response ONLY as a valid JSON object — no markdown, no explanation, no preamble, no trailing text.

---

ANALYSIS INSTRUCTIONS:

Analyse the resume across 5 major sections as described below. Be specific, contextual, and actionable — avoid generic advice. Every suggestion must reference something actually present or missing in the resume. First, extract the candidate's personal and contact details (name, email, phone, location, LinkedIn link, GitHub link, and portfolio/website link) from the resume and output it as a personal_info object at the root of the JSON.

---

SECTION 1 — SCORES (numeric, out of 100)
Calculate the following scores:

- overall_score: Holistic quality of the resume (0–100)
- ats_score: How well the resume will pass Applicant Tracking Systems. Penalise for: tables, columns, headers/footers with key info, images, graphics, non-standard section names, missing keywords, fancy fonts (0–100)
- readability_score: How easy it is for a human recruiter to scan in 6 seconds. Penalise for walls of text, no whitespace, inconsistent formatting (0–100)
- impact_score: How well achievements are quantified with numbers, percentages, revenue, scale. Penalise for vague bullets like "responsible for" or "worked on" (0–100)
- writing_quality_score: Grammar, clarity, active voice, conciseness (0–100)

For each score also provide a one-line "verdict" (e.g. "Passes most ATS filters" or "Too many vague bullets").

---

SECTION 2 — WRITING QUALITY BREAKDOWN (percentages 0–100)
Evaluate:

- bullet_strength_percent: % of bullet points that are strong (start with action verb + have context + show outcome)
- quantified_impact_percent: % of bullet points that contain a number, metric, or measurable result
- action_verb_percent: % of bullet points that start with a strong action verb
- filler_redundancy_level: "low", "medium", or "high" — how much generic filler language exists ("responsible for", "team player", "hardworking", "passionate about", etc.)

---

SECTION 3 — STRUCTURE & FORMAT
Evaluate each of the following and return a status and a short note:

- section_order: Is the section order logical for the candidate's level? (status: "optimal" | "needs_fix", note: why)
- page_length: How many pages? Is it appropriate for their experience level? (status: "good" | "too_short" | "too_long", value: number of pages, note: recommendation)
- font_spacing: Does the formatting appear clean and consistent? (status: "clean" | "inconsistent" | "poor")
- columns_tables: Does the resume use columns or tables that may break ATS? (status: "safe" | "caution" | "risky", note: what was found)
- header_completeness: Does the contact header include: name, email, phone, LinkedIn, location? List what is missing.
  - present: array of what is found
  - missing: array of what is not found

---

SECTION 4 — RED FLAGS
Return an array of red flags detected. For each red flag:
- severity: "high" | "medium" | "low"
- issue: short title (e.g. "Unexplained employment gap")
- detail: what was found in the resume
- fix: specific actionable fix the user should make

Detect and flag the following types of issues (only flag what is actually present):
- Employment gaps (unexplained periods of 3+ months between jobs)
- Bullet points with zero measurable outcomes
- Generic or clichéd objective/summary statements
- Overused buzzwords (e.g. "synergy", "go-getter", "ninja", "guru")
- Job descriptions that are only a list of duties, no achievements
- Skills listed that contradict or don't appear in experience
- Missing LinkedIn or GitHub for technical roles
- Inconsistent date formatting
- Spelling or grammar errors
- More than 2 pages for under 5 years of experience
- Use of first-person pronouns (I, me, my)

---

SECTION 5 — DETECTED SKILLS
Extract all skills mentioned anywhere in the resume:
- hard_skills: array of technical/domain skills (e.g. Python, SQL, Photoshop, QuickBooks)
- soft_skills: array of interpersonal/professional skills (e.g. Leadership, Communication, Negotiation)
- tools_and_platforms: array of tools, software, platforms (e.g. Jira, Salesforce, AWS, Figma)
- certifications: array of certifications mentioned (e.g. AWS Certified, PMP, Google Analytics)

---

SECTION 6 — IMPROVEMENT SUGGESTIONS
Return an ordered array of the top 5 most impactful improvements the user can make right now. For each:
- priority: 1 to 5 (1 = most important)
- title: short label (e.g. "Add metrics to 4 more bullets")
- description: what to do, specifically referencing content from the resume
- why_it_matters: one sentence explaining the recruiter/ATS impact

---

RETURN FORMAT:
Return ONLY this JSON structure, filled with real data from the resume. Do not wrap in markdown. Do not add any text before or after the JSON.

{
  "personal_info": {
    "name": "Full name of the candidate",
    "email": "Email address",
    "phone": "Phone number",
    "location": "Location (city, country)",
    "linkedin": "LinkedIn profile URL",
    "github": "GitHub URL (if present)",
    "portfolio": "Portfolio/Website URL (if present)"
  },
  "scores": {
    "overall_score": 0,
    "overall_verdict": "",
    "ats_score": 0,
    "ats_verdict": "",
    "readability_score": 0,
    "readability_verdict": "",
    "impact_score": 0,
    "impact_verdict": "",
    "writing_quality_score": 0,
    "writing_quality_verdict": ""
  },
  "writing_quality": {
    "bullet_strength_percent": 0,
    "quantified_impact_percent": 0,
    "action_verb_percent": 0,
    "filler_redundancy_level": ""
  },
  "structure_format": {
    "section_order": { "status": "", "note": "" },
    "page_length": { "status": "", "value": 0, "note": "" },
    "font_spacing": { "status": "" },
    "columns_tables": { "status": "", "note": "" },
    "header_completeness": { "present": [], "missing": [] }
  },
  "red_flags": [
    {
      "severity": "",
      "issue": "",
      "detail": "",
      "fix": ""
    }
  ],
  "detected_skills": {
    "hard_skills": [],
    "soft_skills": [],
    "tools_and_platforms": [],
    "certifications": []
  },
  "improvement_suggestions": [
    {
      "priority": 1,
      "title": "",
      "description": "",
      "why_it_matters": ""
    }
  ]
}

Resume Text:
${resumeText}
            `;
        }

        const completion = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const aiResponse = JSON.parse(completion.text);
        res.json(aiResponse);

    } catch (error) {
        console.error('Error analyzing resume:', error);

        // If the PDF library fails again, tell the frontend to ask for a Word Document
        if (error.message === "NODE_24_PDF_ERROR" || error.name === "TypeError") {
            return res.status(500).json({ error: 'Node 24 PDF Error: Please upload a .docx (Word Document) version of your resume instead!' });
        }

        res.status(500).json({ error: 'An error occurred while analyzing the resume.' });
    }
};

module.exports = { analyzeResume };