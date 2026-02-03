
import { ActivityContent } from '../types';

export const exportToPDF = (content: ActivityContent) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <html dir="rtl" lang="ar">
      <head>
        <title>${content.title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Cairo', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
          .title { color: #065f46; font-size: 24px; font-weight: bold; }
          .section { margin-bottom: 25px; }
          .section-title { font-weight: bold; color: #047857; border-right: 4px solid #059669; padding-right: 10px; margin-bottom: 10px; }
          .activity-card { border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
          .game-box { background: #fef3c7; border: 2px dashed #d97706; padding: 20px; border-radius: 12px; margin-top: 20px; }
          .digital-box { background: #f0f9ff; border: 1px solid #bae6fd; padding: 15px; border-radius: 12px; margin-bottom: 10px; }
          .link-to-obj { font-size: 13px; color: #059669; font-style: italic; margin-top: 5px; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">نشاط صفي تفاعلي: ${content.title}</div>
          <div>المبحث: ${content.subject} | الفصل الدراسي: ${content.semester}</div>
          <div style="margin-top: 10px; font-weight: bold;">إعداد المعلمة: رانية شريم</div>
          <div style="font-size: 14px;">مدرسة بنات عمر بن عبد العزيز الثانوية</div>
        </div>

        <div class="section">
          <div class="section-title">🎯 الهدف التعليمي:</div>
          <p>${content.objective}</p>
        </div>

        ${content.toolsNeeded?.length ? `
        <div class="section">
          <div class="section-title">🛠️ الأدوات والوسائل:</div>
          <ul>${content.toolsNeeded.map(tool => `<li>${tool}</li>`).join('')}</ul>
        </div>` : ''}

        <div class="section">
          <div class="section-title">🌟 الأنشطة التفاعلية المقترحة:</div>
          ${content.interactiveActivities.map(act => `
            <div class="activity-card">
              <strong>[${act.type}] ${act.title}</strong>
              <p>${act.description}</p>
              <ul style="font-size: 14px;">${act.instructions.map(ins => `<li>${ins}</li>`).join('')}</ul>
            </div>
          `).join('')}
        </div>

        <div class="game-box">
          <div class="section-title" style="border-right-color: #d97706; color: #92400e;">🏆 اللعبة التنافسية الكبرى: ${content.competitiveGame.name}</div>
          <p><strong>طريقة التنفيذ:</strong> ${content.competitiveGame.suggestedFormat}</p>
          <ul>${content.competitiveGame.rules.map(rule => `<li>${rule}</li>`).join('')}</ul>
        </div>

        ${content.electronicLinks?.length ? `
        <div class="section" style="margin-top: 20px;">
          <div class="section-title">🔗 الموارد الرقمية والأنشطة التفاعلية:</div>
          ${content.electronicLinks.map(link => `
            <div class="digital-box">
              <strong>${link.platform} (${link.toolType})</strong>
              <p style="margin: 5px 0;">${link.description}</p>
              <div class="link-to-obj">الارتباط بالهدف: ${link.linkToObjective}</div>
            </div>
          `).join('')}
        </div>` : ''}

        <div class="section">
          <div class="section-title">💡 الخلاصة وبصمة المعلمة:</div>
          <p><em>${content.conclusion}</em></p>
        </div>

        <div class="footer">
          <p>تم الإنشاء بواسطة منصة المعلمة رانية شريم التعليمية - فلسطين - طولكرم</p>
        </div>

        <script>
          window.onload = () => {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
