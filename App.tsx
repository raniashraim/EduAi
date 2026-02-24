
import React, { useState, useEffect } from 'react';
import { SUBJECTS, SCHOOL_INFO } from './constants';
import { Semester, ActivityContent, GenerationMode } from './types';
import { generateActivity } from './services/geminiService';
import { exportToWord } from './services/wordExportService';
import { exportToPDF } from './services/pdfExportService';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    // Fix: Remove readonly to match identical modifiers requirement across all declarations of the window.aistudio property
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<Semester>(Semester.FIRST);
  const [selectedMode, setSelectedMode] = useState<GenerationMode>(GenerationMode.ACTIVITY);
  const [topic, setTopic] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activity, setActivity] = useState<ActivityContent | null>(null);
  const [error, setError] = useState<string>('');
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const handleSelectKey = async () => {
    try {
      if (window.aistudio) {
        await window.aistudio.openSelectKey();
        setError('');
        setShowConfig(false);
      }
    } catch (err) {
      console.error("Key Selector Error:", err);
    }
  };

  const handleGenerate = async () => {
    if (!selectedSubject || !topic) {
      setError('أستاذة رانية، يرجى ملء الخيارات أولاً.');
      return;
    }

    setError('');
    setLoading(true);
    setActivity(null);

    try {
      const result = await generateActivity(
        SUBJECTS.find(s => s.id === selectedSubject)?.name || '',
        selectedSemester,
        topic,
        selectedMode
      );
      setActivity(result);
    } catch (err: any) {
      if (err.message === "NOT_FOUND" || err.message === "API_KEY_MISSING") {
        setError("⚠️ تنبيه تقني: الموقع غير مرتبط بمفتاح API صحيح. يرجى الضغط على 'ضبط المفتاح' أدناه.");
        setShowConfig(true);
      } else {
        setError(`عذراً، حدث خطأ: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-['Cairo'] text-right text-slate-800" dir="rtl">
      
      {/* Configuration Modal */}
      {showConfig && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] max-w-md w-full p-10 shadow-2xl border border-slate-100">
            <h2 className="text-3xl font-black text-slate-900 mb-6 text-center">تفعيل الموقع 🔐</h2>
            <p className="text-slate-500 font-bold mb-8 text-center text-sm leading-relaxed">
              أستاذة رانية، إذا كان الموقع لا يستجيب، فهذا يعني أننا بحاجة لربطه بمفتاحك الخاص من Google.
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={handleSelectKey}
                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
              >
                اضغطي هنا واختاري مفتاحك 🔗
              </button>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-[10px] text-slate-400 font-black mb-2 text-center uppercase">نصيحة تقنية لـ Vercel</p>
                <p className="text-[11px] text-slate-600 text-center leading-relaxed">
                  تأكدي من إضافة <code className="bg-slate-200 px-1 rounded">API_KEY</code> في إعدادات Vercel ثم اضغطي على <strong>Redeploy</strong>.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowConfig(false)}
              className="w-full mt-6 py-2 text-slate-300 font-bold hover:text-slate-500 transition-all"
            >
              لاحقاً
            </button>
          </div>
        </div>
      )}

      {/* Header Area */}
      <header className="bg-white border-b border-slate-100 py-12 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-right">
            <h1 className="text-4xl font-black text-slate-900">{SCHOOL_INFO.title}</h1>
            <p className="mt-2 text-emerald-600 font-bold text-lg">بصمة المعلمة: {SCHOOL_INFO.teacher}</p>
          </div>
          <div className="text-center md:text-left">
            <p className="font-black text-slate-400">{SCHOOL_INFO.school}</p>
            <button 
              onClick={() => setShowConfig(true)}
              className="mt-3 text-[10px] bg-slate-100 px-4 py-2 rounded-xl hover:bg-slate-200 transition-all font-black text-slate-500"
            >
              ⚙️ ضبط الاتصال التقني
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Controls Side */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="font-black text-slate-800 mb-6 border-b pb-4">الإعدادات</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">١. المبحث</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SUBJECTS.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSubject(s.id)}
                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                          selectedSubject === s.id 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                            : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        <span className="text-xl">{s.icon}</span>
                        <span className="text-[10px] font-black">{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">٢. نوع المخرج</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(GenerationMode).map(mode => (
                      <button
                        key={mode}
                        onClick={() => setSelectedMode(mode)}
                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                          selectedMode === mode 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                            : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        <span className="text-lg">{mode === GenerationMode.WORKSHEET ? '📝' : '🎮'}</span>
                        <span className="text-[10px] font-black">{mode}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">٣. عنوان الدرس</label>
                  <input 
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="مثال: التفاعلات الكيميائية"
                    className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  />
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl transition-all ${
                    loading ? 'bg-slate-200 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-emerald-200'
                  }`}
                >
                  {loading ? 'جاري التصميم...' : 'إنشاء النشاط ✨'}
                </button>

                {error && (
                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                    <p className="text-rose-600 text-[10px] font-bold leading-relaxed">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {!activity && !loading && (
              <div className="h-[500px] bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-10">
                <div className="text-6xl mb-6 grayscale opacity-20">📝</div>
                <h2 className="text-2xl font-black text-slate-300">في انتظار لمستكِ الإبداعية أستاذة رانية</h2>
              </div>
            )}

            {loading && (
              <div className="h-[500px] bg-white rounded-[3rem] flex flex-col items-center justify-center text-center p-10 animate-pulse">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-2xl font-black text-slate-800">نقوم الآن بتصميم نشاط صفي متميز...</h2>
              </div>
            )}

            {activity && (
              <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-slate-900 p-12 text-white flex flex-col md:flex-row justify-between items-center gap-8">
                  <div>
                    <h2 className="text-3xl font-black mb-2">{activity.title}</h2>
                    <p className="text-emerald-400 font-bold opacity-80 underline underline-offset-4 decoration-emerald-500/30">تصميم تربوي شامل وعصري</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => exportToPDF(activity)} className="px-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black transition-all">PDF 📄</button>
                    <button onClick={() => exportToWord(activity)} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black transition-all shadow-lg shadow-emerald-900/40">Word 📝</button>
                  </div>
                </div>

                <div className="p-12 md:p-20 space-y-20">
                  <section>
                    <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm">١</span>
                      الأهداف التعليمية
                    </h3>
                    <p className="text-xl text-slate-600 leading-relaxed font-bold pr-11">{activity.objective}</p>
                  </section>

                  {activity.mode === GenerationMode.ACTIVITY && activity.interactiveActivities && (
                    <section>
                      <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm">٢</span>
                        الأنشطة التفاعلية
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pr-11">
                        {activity.interactiveActivities.map((act, i) => (
                          <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all">
                            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black mb-4 uppercase">{act.type}</span>
                            <h4 className="text-xl font-black text-slate-800 mb-3">{act.title}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 font-bold">{act.description}</p>
                            <div className="space-y-2">
                              {act.instructions.map((ins, j) => (
                                <div key={j} className="flex gap-2 text-xs text-slate-400 font-bold">
                                  <span className="text-emerald-500">✔</span> {ins}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {activity.mode === GenerationMode.ACTIVITY && activity.competitiveGame && (
                    <section className="bg-slate-900 p-12 rounded-[3.5rem] text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-6 mb-8">
                          <div className="text-6xl">🏆</div>
                          <div>
                            <h4 className="text-2xl font-black text-amber-400">{activity.competitiveGame.name}</h4>
                            <p className="text-slate-400 font-bold">اللعبة التنافسية الكبرى</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                            <p className="text-slate-300 font-bold leading-relaxed">{activity.competitiveGame.suggestedFormat}</p>
                          </div>
                          <div className="space-y-4">
                            {activity.competitiveGame.rules.map((rule, i) => (
                              <div key={i} className="flex gap-3 text-sm text-slate-400 font-bold items-start">
                                <span className="text-amber-400">★</span> {rule}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {activity.mode === GenerationMode.WORKSHEET && activity.worksheetSections && (
                    <section className="space-y-12">
                      <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm">٢</span>
                        محتوى ورقة العمل
                      </h3>
                      <div className="space-y-10 pr-11">
                        {activity.worksheetSections.map((section, i) => (
                          <div key={i} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                            <h4 className="text-2xl font-black text-emerald-700 mb-8 border-b border-emerald-100 pb-4">{section.title}</h4>
                            <div className="space-y-8">
                              {section.questions.map((q, j) => (
                                <div key={j} className="space-y-4">
                                  <p className="text-lg font-bold text-slate-800 flex gap-3">
                                    <span className="text-emerald-500">{j + 1}.</span> {q.question}
                                  </p>
                                  {q.options && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mr-8">
                                      {q.options.map((opt, k) => (
                                        <div key={k} className="p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600">
                                          {String.fromCharCode(97 + k)}. {opt}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {q.type === 'essay' && (
                                    <div className="h-24 w-full border-2 border-dashed border-slate-200 rounded-2xl mr-8"></div>
                                  )}
                                  {q.type === 'true_false' && (
                                    <div className="flex gap-6 mr-8">
                                      <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                        <div className="w-5 h-5 border-2 border-slate-200 rounded-full"></div> نعم
                                      </div>
                                      <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                        <div className="w-5 h-5 border-2 border-slate-200 rounded-full"></div> لا
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <div className="pt-20 border-t border-slate-100 text-center">
                    <p className="text-3xl font-bold italic text-slate-200 mb-8 leading-relaxed">"{activity.conclusion}"</p>
                    <div className="inline-flex flex-col items-center">
                      <p className="font-black text-slate-800 text-lg">{SCHOOL_INFO.teacher}</p>
                      <p className="text-xs text-slate-400 font-bold">معلمة متميزة في مدرسة بنات عمر بن عبد العزيز الثانوية</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
