import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue." })
        }

        const response = await AI.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: Math.max(4000, Number(length) * 1.5),
        });

        const content = response.choices?.[0]?.message?.content;

        if (!content) {
            return res.json({ success: false, message: "The AI model returned an empty response. Please try again or refine your prompt." })
        }

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;



        res.json({ success: true, content })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue." })
        }

        const response = await AI.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const content = response.choices?.[0]?.message?.content;
        
        if (!content) {
            return res.json({ success: false, message: "The AI model returned an empty response. Please try again or refine your prompt." })
        }

        await sql`INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},${prompt},${content},'blog-title')`;



        res.json({ success: true, content })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Premium features are here below hence no const free_usage.... :)
export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
        }

        const formData = new FormData()
        formData.append('prompt', prompt)
        const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: { 'x-api-key': process.env.CLIPDROP_API_KEY },
            responseType: "arraybuffer",
        })

        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

        const { secure_url } = await cloudinary.uploader.upload(base64Image)

        await sql`INSERT INTO creations (user_id,prompt,content,type,publish) VALUES (${userId},${prompt},${secure_url},'image',${publish ?? false})`;

        res.json({ success: true, content: secure_url })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth();
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
        }

        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal: 'remove_the_background'
                }
            ]
        })

        await sql`INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},'Remove background from image',${secure_url},'image')`;

        res.json({ success: true, content: secure_url })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}


export const removeImageObject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { object } = req.body;
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
        }

        const result = await cloudinary.uploader.upload(image.path, {
            eager: [
                {
                    effect: `gen_remove:prompt_${object}`
                }
            ],
            eager_async: false // Wait for eager transformation to finish
        })

        const imageUrl = result.eager?.[0]?.secure_url || result.secure_url;

        await sql`INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},${`Removed ${object} from image`},${imageUrl},'image')`;

        res.json({ success: true, content: imageUrl })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

/* 
export const resumeReview = async (req, res) => {
    try {
        const { userId } = req.auth();
        const resume = req.file;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
        }

        if (resume.size > 5 * 1024 * 1024) {
            return res.json({ success: false, message: 'Resume file size exceeds allowed size (5MB).' })
        }

        const pdf = require('pdf-parse');
        const dataBuffer = fs.readFileSync(resume.path);

        const pdfData = await pdf(dataBuffer);
        // pdfData.text contains the extracted text


        const prompt = `Review the following resume and provide constructive feedback on its strengths, weakness and areas for improvement. Resume content : \n\n ${pdfData.text}`

        const response = await AI.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 10000,
        });

        const content = response.choices[0].message.content

        await sql`INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},'Review the uploaded resume',${content},'resume-review')`;

        res.json({ success: true, content })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}
*/

export const summarizePdf = async (req, res) => {
    try {
        const { userId } = req.auth();
        const file = req.file;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
        }

        if (!file) {
            return res.json({ success: false, message: "No PDF file uploaded" })
        }

        const pdf = require('pdf-parse');
        const dataBuffer = fs.readFileSync(file.path);
        
        // Ensure we are calling the correct function regardless of module format
        const pdfParser = pdf.default || pdf;
        const pdfData = await pdfParser(dataBuffer);

        const prompt = `Please provide a clear, comprehensive, and well-structured summary of the following PDF content. Use bullet points for key takeaways, organize sections logically, and maintain a professional tone. PDF Content: \n\n ${pdfData.text}`;

        const response = await AI.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 4000,
        });

        const content = response.choices?.[0]?.message?.content;

        // Clean up: delete the temporary file after processing
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        if (!content) {
            return res.json({ success: false, message: "The AI model failed to generate a summary. Please try again." })
        }

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'PDF Summary', ${content}, 'pdf-summary')`;

        res.json({ success: true, content });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}