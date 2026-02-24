
export enum GenerationMode {
  WORKSHEET = 'ورقة عمل',
  ACTIVITY = 'نشاط تفاعلي'
}

export interface ActivityContent {
  title: string;
  subject: string;
  semester: string;
  objective: string;
  mode: GenerationMode;
  toolsNeeded?: string[];
  steps?: string[];
  // For Interactive Activities
  interactiveActivities?: {
    type: 'practical' | 'group' | 'electronic' | 'competitive';
    title: string;
    description: string;
    instructions: string[];
  }[];
  competitiveGame?: {
    name: string;
    rules: string[];
    suggestedFormat: string; // e.g., "Kahoot", "Classroom Competition", "Card Sort"
  };
  // For Worksheets
  worksheetSections?: {
    title: string;
    questions: {
      question: string;
      type: 'multiple_choice' | 'true_false' | 'essay' | 'matching';
      options?: string[];
      answer?: string;
    }[];
  }[];
  electronicLinks?: {
    platform: string;
    description: string;
    toolType: 'لعبة تعليمية' | 'محاكاة تفاعلية' | 'اختبار قصير' | 'أداة عرض';
    linkToObjective: string;
  }[];
  conclusion: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
}

export enum Semester {
  FIRST = 'الأول',
  SECOND = 'الثاني'
}
