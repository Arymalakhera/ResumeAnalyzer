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
            You are a senior tech recruiter and expert ATS parser. The candidate has submitted their resume for a SPECIFIC Job Description.
            You must evaluate their fit for THIS ROLE ONLY, and provide targeted feedback and rewrites.
            
            Return strictly in JSON format with the following keys:
            - "is_job_role_match": true
            - "personal_info": An object containing "name", "email", "phone", and "current_role" extracted from the resume. If missing, use "Not found" or "User".
            - "match_percentage": A number from 0 to 100 estimating how well they fit the Job Description.
            - "match_analysis": A short, 2-3 sentence summary of why they are or aren't a good fit.
            - "matched_requirements": An array of up to 5 strings listing skills/experiences the user HAS that the JD asks for.
            - "missing_requirements": An array of up to 5 strings listing critical requirements the user LACKS that the JD demands.
            - "interview_questions": An array of 3 predictive interview questions the recruiter might ask to probe the user's weaknesses or gaps regarding this specific JD.
            - "resume_sections": An array of objects breaking down the user's resume into logical sections (e.g., "Summary", "Experience", "Education", "Skills"). For EACH section, provide:
               - "section_name": The title of the section.
               - "original_text": The raw, unedited text from the user's resume for this specific section.
               - "enhanced_text": The thoroughly rewritten, ATS-optimized plain text version of this specific section, explicitly tailored to incorporate keywords from the Job Description. Do NOT use markdown.

            Job Description:
            ${jobDescription}

            Resume Text:
            ${resumeText}
            `;
        } else {
            prompt = `
            You are a senior tech recruiter and resume expert. Analyze the following resume text and provide structured feedback.
            Return the response strictly in JSON format with the following keys:
            - "is_job_role_match": false
            - "personal_info": An object containing "name", "email", "phone", and "current_role" extracted from the resume.
            - "score": A number out of 10.
            - "strengths": An array of 3 strong points.
            - "weaknesses": An array of 3 areas needing improvement.
            - "tips": An array of 3 actionable tips to improve the resume.
            - "smart_keywords": An array of 5 to 8 highly relevant ATS/industry keywords that the resume is critically MISSING and should be added to improve visibility.
            - "recommended_roles": An array of 3 to 5 objects representing suggested job roles based on the resume. Each object must contain:
               - "title": Job title string.
               - "match_percentage": A number estimating how well the user fits this role.
               - "matching_skills": Array of strings of skills that match.
               - "missing_skills": Array of strings of critical skills the user lacks for this role.
               - "improvement_suggestion": A short string tip on how to become a better fit for this specific role.
            - "resume_sections": An array of objects breaking down the user's resume into logical sections (e.g., "Summary", "Experience", "Education", "Skills"). For EACH section, provide:
               - "section_name": The title of the section.
               - "original_text": The raw, unedited text from the user's resume for this specific section.
               - "enhanced_text": The thoroughly rewritten, ATS-optimized plain text version of this specific section. Do NOT use markdown formatting, just clean text.

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