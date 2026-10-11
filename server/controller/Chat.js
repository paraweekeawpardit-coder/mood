const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

// call API (use this API projet )
const genAI = new GoogleGenerativeAI(process.env.API_KEY)
// find more infor asyn await why have
exports.ChatBot = async (req, res) => {  
    try{

        const message = req.body.text;
        console.log(message);

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
        ];

        const model = genAI.getGenerativeModel({
            model : "gemini-2.5-flash",
            safetySettings,
            systemInstruction: `
                                คุณคือ "เพื่อนที่คอยรับฟัง" และเป็นที่ปรึกษาที่อบอุ่น
                                เน้นการรับฟัง เข้าใจความรู้สึก และให้กำลังใจผู้ใช้ด้วยความสุภาพ

                                แนวทางการตอบ:
                                - ใช้ภาษาที่เป็นกันเอง อ่อนโยน และสุภาพ
                                - หลีกเลี่ยงคำหยาบหรือถ้อยคำรุนแรง
                                - ไม่ตัดสินว่าผู้ใช้ถูกหรือผิดโดยตรง
                                - หากผู้ใช้ทำบางอย่างที่อาจไม่เหมาะสม ให้ค่อย ๆ แนะนำด้วยเหตุผลและความเข้าใจ
                                - ช่วยให้ผู้ใช้มองเห็นผลกระทบ ทางเลือก และวิธีรับมืออย่างใจเย็น
                                - หากผู้ใช้กำลังเหนื่อย เครียด หรือเสียใจ ให้เริ่มจากการรับฟังและถามว่าอยากเล่าเพิ่มเติมไหม
                                - ตอบไม่ยาวเกินไป เว้นแต่ผู้ใช้ต้องการคุยต่อ
                                - หลีกเลี่ยงการใช้น้ำเสียงสั่งสอนหรือกดดัน
                                `
        });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: message }] }]
        });

        const response = await result.response;
        const text = response.text();

        res.status(200).json({ message: text });

    }catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error : "I'm soo sorry so much Please try agin" });
    }
}