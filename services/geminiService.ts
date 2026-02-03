
import { GoogleGenAI, Type } from "@google/genai";
import { ActivityContent } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateActivity = async (
  subject: string,
  semester: string,
  topic: string
): Promise<ActivityContent> => {
  const prompt = `قم بإنشاء خطة نشاط صفي تفاعلي متكامل للصف العاشر الأكاديمي حسب المنهاج الفلسطيني.
  المبحث: ${subject}
  الفصل الدراسي: ${semester}
  عنوان الدرس/الموضوع: ${topic}
  
  يجب أن يكون التركيز على "التعلم باللعب" و"التفاعل الرقمي والنشط".
  يجب أن تتضمن الاستجابة:
  1. هدف تعليمي واضح ومحدد.
  2. الأدوات والوسائل التعليمية اللازمة.
  3. خطوات تنفيذ النشاط الصفي.
  4. أنشطة تفاعلية متنوعة (عملية، مجموعات، إلكترونية).
  5. لعبة تنافسية محددة (مثل: مسابقات كاهوت، العب وتعلم، سباق المعلومات).
  6. قسم موسع للأنشطة الإلكترونية يشمل:
     - اقتراحات لألعاب مصغرة تفاعلية (Mini-games) مثل فكرة للعبة على Wordwall أو Kahoot أو Quizizz.
     - توضيح لنوع الأداة (لعبة، محاكاة، اختبار).
     - شرح لكيفية ربط كل أداة رقمية بهدف النشاط.
  7. خاتمة واستنتاج.
  
  ملاحظة: لا تقم بتضمين روابط URL فعلية، فقط قم بوصف النشاط الرقمي المقترح وكيفية تنفيذه.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
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
          toolsNeeded: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          steps: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          interactiveActivities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                instructions: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                }
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
          electronicLinks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                description: { type: Type.STRING },
                toolType: { type: Type.STRING, enum: ['لعبة تعليمية', 'محاكاة تفاعلية', 'اختبار قصير', 'أداة عرض'] },
                linkToObjective: { type: Type.STRING }
              },
              required: ["platform", "description", "toolType", "linkToObjective"]
            }
          },
          conclusion: { type: Type.STRING }
        },
        required: ["title", "subject", "semester", "objective", "interactiveActivities", "competitiveGame", "conclusion"]
      },
      thinkingConfig: { thinkingBudget: 16000 }
    }
  });

  return JSON.parse(response.text);
};
