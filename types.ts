
export interface ActivityContent {
  title: string;
  subject: string;
  semester: string;
  objective: string;
  toolsNeeded?: string[];
  steps?: string[];
  interactiveActivities: {
    type: 'practical' | 'group' | 'electronic' | 'competitive';
    title: string;
    description: string;
    instructions: string[];
  }[];
  competitiveGame: {
    name: string;
    rules: string[];
    suggestedFormat: string; // e.g., "Kahoot", "Classroom Competition", "Card Sort"
  };
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
