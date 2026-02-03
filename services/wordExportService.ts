
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { ActivityContent } from '../types';
import { SCHOOL_INFO } from '../constants';

export const exportToWord = async (content: ActivityContent) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: SCHOOL_INFO.title,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `إعداد المعلمة: ${SCHOOL_INFO.teacher}`,
                bold: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: SCHOOL_INFO.school + " - " + SCHOOL_INFO.location,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: `خطة نشاط صفي تفاعلي: ${content.title}`,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.RIGHT,
          }),
          new Paragraph({
            text: `المبحث: ${content.subject} | الفصل: ${content.semester}`,
            alignment: AlignmentType.RIGHT,
          }),
          new Paragraph({
            text: "--------------------------------------------------",
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [new TextRun({ text: "الهدف من النشاط:", bold: true })],
            alignment: AlignmentType.RIGHT,
          }),
          new Paragraph({
            text: content.objective,
            alignment: AlignmentType.RIGHT,
          }),
          ...(content.toolsNeeded?.length ? [
            new Paragraph({
              children: [new TextRun({ text: "الأدوات اللازمة:", bold: true })],
              alignment: AlignmentType.RIGHT,
              spacing: { before: 200 },
            }),
            ...content.toolsNeeded.map(tool => new Paragraph({ text: `• ${tool}`, alignment: AlignmentType.RIGHT }))
          ] : []),
          new Paragraph({
            children: [new TextRun({ text: "الأنشطة التفاعلية:", bold: true })],
            alignment: AlignmentType.RIGHT,
            spacing: { before: 400 },
          }),
          ...content.interactiveActivities.flatMap(act => [
            new Paragraph({
              children: [new TextRun({ text: `نشاط [${act.type}]: ${act.title}`, italic: true, bold: true })],
              alignment: AlignmentType.RIGHT,
              spacing: { before: 200 },
            }),
            new Paragraph({
              text: act.description,
              alignment: AlignmentType.RIGHT,
            }),
            ...act.instructions.map(ins => new Paragraph({ text: `- ${ins}`, alignment: AlignmentType.RIGHT }))
          ]),
          new Paragraph({
            children: [new TextRun({ text: "اللعبة التنافسية الكبرى:", bold: true })],
            alignment: AlignmentType.RIGHT,
            spacing: { before: 400 },
          }),
          new Paragraph({
            text: `اسم اللعبة: ${content.competitiveGame.name}`,
            alignment: AlignmentType.RIGHT,
          }),
          new Paragraph({
            text: `الشكل المقترح: ${content.competitiveGame.suggestedFormat}`,
            alignment: AlignmentType.RIGHT,
          }),
          ...content.competitiveGame.rules.map(rule => new Paragraph({ text: `• ${rule}`, alignment: AlignmentType.RIGHT })),
          ...(content.electronicLinks?.length ? [
            new Paragraph({
              children: [new TextRun({ text: "الموارد الرقمية والأنشطة التفاعلية:", bold: true })],
              alignment: AlignmentType.RIGHT,
              spacing: { before: 400 },
            }),
            ...content.electronicLinks.flatMap(link => [
              new Paragraph({
                children: [new TextRun({ text: `${link.platform} (${link.toolType}):`, bold: true })],
                alignment: AlignmentType.RIGHT,
              }),
              new Paragraph({
                text: link.description,
                alignment: AlignmentType.RIGHT,
              }),
              new Paragraph({
                children: [new TextRun({ text: `الارتباط بالهدف: ${link.linkToObjective}`, italic: true })],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 200 },
              })
            ])
          ] : []),
          new Paragraph({
            children: [new TextRun({ text: "بصمة المعلمة والخلاصة:", bold: true })],
            alignment: AlignmentType.RIGHT,
            spacing: { before: 400 },
          }),
          new Paragraph({
            text: content.conclusion,
            alignment: AlignmentType.RIGHT,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `نشاط_${content.title}.docx`;
  link.click();
  URL.revokeObjectURL(url);
};
