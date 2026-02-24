
import { GoogleGenAI, Type } from "@google/genai";
import { ActivityContent, GenerationMode } from "../types";

export const generateActivity = async (
  subject: string,
  semester: string,
  topic: string,
  mode: GenerationMode
): Promise<ActivityContent> => {
  // استخدام المفتاح من البيئة (Vercel)
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey.length < 10) {
    throw new Error("API_KEY_MISSING");
  }

  // إنشاء الكائن فور طلب العملية لضمان تحديث المفتاح
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `أنت خبير تربوي متخصص في المنهاج الفلسطيني للصف العاشر.
  المهمة: تصميم ${mode === GenerationMode.WORKSHEET ? 'ورقة عمل شاملة ومنظمة' : 'نشاط صفي إبداعي وتفاعلي'}.
  المبحث: ${subject}
  الفصل الدراسي: ${semester}
  عنوان الدرس/الموضوع: ${topic}
  نوع المخرج المطلوب: ${mode}
  
  ${mode === GenerationMode.WORKSHEET 
    ? 'يجب أن تتضمن ورقة العمل: أهداف تعليمية، أقسام متنوعة (أسئلة اختيار من متعدد، صح وخطأ، أسئلة مقالية)، وخلاصة.' 
    : 'يجب أن يتضمن النشاط: أهداف تعليمية، أنشطة تفاعلية (عملي، مجموعات، إلكتروني)، لعبة تنافسية، وروابط إثرائية.'}
  
  يجب أن يكون الرد بتنسيق JSON حصراً.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            semester: { type: Type.STRING },
            objective: { type: Type.STRING },
            mode: { type: Type.STRING, enum: [GenerationMode.WORKSHEET, GenerationMode.ACTIVITY] },
            toolsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            interactiveActivities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  instructions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["type", "title", "description", "instructions"]
              }
            },
            competitiveGame: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                rules: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedFormat: { type: Type.STRING }
              },
              required: ["name", "rules", "suggestedFormat"]
            },
            worksheetSections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  questions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        question: { type: Type.STRING },
                        type: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        answer: { type: Type.STRING }
                      },
                      required: ["question", "type"]
                    }
                  }
                },
                required: ["title", "questions"]
              }
            },
            electronicLinks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING },
                  description: { type: Type.STRING },
                  toolType: { type: Type.STRING },
                  linkToObjective: { type: Type.STRING }
                }
              }
            },
            conclusion: { type: Type.STRING }
          },
          required: ["title", "subject", "semester", "objective", "mode", "conclusion"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("EMPTY_RESPONSE");
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    const msg = error.message || "";
    if (msg.includes("404") || msg.includes("not found")) {
      throw new Error("NOT_FOUND");
    }
    throw error;
  }
};
