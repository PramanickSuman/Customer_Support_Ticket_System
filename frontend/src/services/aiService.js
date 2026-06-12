const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

class AiService {

    async generateSummary(comments, ticketTitle, description) {
        try {
            const conversationText = comments
                .map(c => `${c.name || 'User'}: ${c.message}`)
                .join('\n\n');

            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are an expert customer support analyst. Summarize the ticket conversation clearly and professionally in 3-4 sentences."
                    },
                    {
                        role: "user",
                        content: `Ticket Title: ${ticketTitle}\nDescription: ${description}\n\nConversation:\n${conversationText}\n\nPlease summarize this ticket.`
                    }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.5,
                max_tokens: 400,
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error("AI Summary Error:", error);
            return "Unable to generate summary at this moment.";
        }
    }

    async enhanceSearchQuery(userQuery) {
        try {
            const completion = await groq.chat.completions.create({
                messages: [{
                    role: "user",
                    content: `Improve this search query for a customer support ticket system. Return only valid JSON object.
                    Query: ${userQuery}`
                }],
                model: "llama-3.3-70b-versatile",
                response_format: { type: "json_object" },
                temperature: 0.3,
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error("AI Search Error:", error);
            return { keywords: [userQuery], intent: "general" };
        }
    }
}

module.exports = new AiService();
