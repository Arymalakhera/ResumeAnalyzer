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

        // Talk to OpenAI
        const prompt = `
        You are a senior tech recruiter and resume expert. Analyze the following resume text and provide structured feedback.
        Return the response strictly in JSON format with the following keys:
        - "personal_info": An object containing:
           - "name": The full name of the person (or "User" if missing).
           - "email": Their email address (or "Not found").
           - "phone": Their phone number (or "Not found").
           - "current_role": Their current or most recent job title (or "Not found").
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