import React, { useRef } from 'react';
import { motion } from "motion/react";
import { FiArrowLeft, FiAward, FiCheckCircle, FiTarget, FiTrendingUp, FiSun, FiMoon, FiCheck, FiAlertTriangle, FiCompass } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import DownloadBtn from '../resume/DownloadBtn';
import { useTheme } from '../../context/ThemeContext';

function Step3report({ report, user, setUser }) {
  const navigate = useNavigate();
  const reportRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  const score = report?.overallScore ?? 80;
  const questions = report?.questions || [];

  return (
    <div className='min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0C] text-slate-900 dark:text-zinc-100 flex items-center justify-center p-4 sm:p-6 transition-colors duration-200'>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl rounded-3xl bg-white dark:bg-[#0F172A] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className='border-b border-black/8 dark:border-white/10 px-6 sm:px-8 py-5 flex items-center justify-between flex-wrap gap-4'>
          <div>
            <div className='flex items-center gap-3 mb-2'>
              <div 
                onClick={() => navigate("/dashboard")} 
                className='inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200 rounded-xl border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700 transition'
              >
                <FiArrowLeft size={14} />
                <span>Dashboard</span>
              </div>

              <button
                onClick={toggleTheme}
                className='p-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 cursor-pointer'
              >
                {theme === 'dark' ? <FiSun size={15} className='text-amber-400' /> : <FiMoon size={15} className='text-purple-600' />}
              </button>
            </div>

            <h1 className='text-2xl font-black text-slate-900 dark:text-white'>AI Interview Report</h1>
            <p className='text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-1'>
              Role: <span className='text-indigo-600 dark:text-indigo-400 font-bold capitalize'>{report?.role || "Candidate"}</span> ({report?.type || "technical"} session)
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <DownloadBtn docRef={reportRef} user={user} setUser={setUser} />

            <div className='flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs'>
              <FiCheckCircle size={16} />
              <span>Session Completed</span>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className='p-6 sm:p-8' ref={reportRef}>
          {/* Stat Cards Row */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6'>
            <div className='rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-6 shadow-sm'>
              <div className='w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md'>
                <FiTarget size={20} />
              </div>
              <p className='mt-4 text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider'>Overall Score</p>
              <h2 className='mt-1 text-4xl font-black text-slate-900 dark:text-white tabular-nums'>
                {score}
                <span className='text-base font-semibold text-slate-400 dark:text-zinc-500'>/100</span>
              </h2>
            </div>

            <div className='rounded-2xl bg-purple-500/10 border border-purple-500/20 p-6 shadow-sm'>
              <div className='w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-md'>
                <FiTrendingUp size={20} />
              </div>
              <p className='mt-4 text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider'>Questions Evaluated</p>
              <h2 className='mt-1 text-4xl font-black text-slate-900 dark:text-white tabular-nums'>{questions.length}</h2>
            </div>

            <div className='rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-6 shadow-sm'>
              <div className='w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md'>
                <FiAward size={20} />
              </div>
              <p className='mt-4 text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider'>Performance Match</p>
              <h2 className='mt-1 text-2xl font-black text-slate-900 dark:text-white'>
                {score >= 75 ? "High Match" : score >= 50 ? "Moderate" : "Needs Practice"}
              </h2>
            </div>
          </div>

          {/* AI Summary Card */}
          <div className='rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-black/8 dark:border-white/10 p-6 shadow-sm mb-6'>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
              AI Interview Executive Summary
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-zinc-300 font-medium">
              {report?.summary || "You completed the interview session. Review the strengths, areas for improvement, and detailed question breakdown below."}
            </p>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-6'>
            {/* Strengths */}
            {report?.strengths && report.strengths.length > 0 && (
              <div className='rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 shadow-xs'>
                <div className='flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider'>
                  <FiCheck size={16} /> Key Strengths
                </div>
                <ul className='space-y-2'>
                  {report.strengths.map((item, i) => (
                    <li key={i} className='text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-start gap-2'>
                      <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0' />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses / Improvements */}
            {report?.weaknesses && report.weaknesses.length > 0 && (
              <div className='rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5 shadow-xs'>
                <div className='flex items-center gap-2 mb-3 text-amber-600 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider'>
                  <FiAlertTriangle size={16} /> Areas for Growth
                </div>
                <ul className='space-y-2'>
                  {report.weaknesses.map((item, i) => (
                    <li key={i} className='text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-start gap-2'>
                      <span className='w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0' />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {report?.recommendations && report.recommendations.length > 0 && (
            <div className='rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-5 shadow-xs mb-6'>
              <div className='flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs uppercase tracking-wider'>
                <FiCompass size={16} /> Actionable Recommendations
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5'>
                {report.recommendations.map((rec, i) => (
                  <div key={i} className='rounded-xl bg-white/60 dark:bg-zinc-800/60 border border-indigo-500/15 p-3 text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-start gap-2'>
                    <span className='w-5 h-5 rounded-md bg-indigo-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5'>
                      {i + 1}
                    </span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question Breakdown List */}
          {questions.length > 0 && (
            <div className='space-y-4'>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                Question Breakdown & Feedback
              </h3>
              <div className='space-y-3'>
                {questions.map((q, i) => {
                  const userAnswerText = q.userAnswer || q.answer || "";
                  const feedbackText = typeof q.feedback === 'object' ? q.feedback?.feedback : q.feedback;
                  const itemScore = q.score ?? (typeof q.feedback === 'object' ? q.feedback?.score : undefined);

                  return (
                    <div key={i} className='rounded-2xl border border-black/8 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/40 p-5 shadow-xs'>
                      <div className='flex items-start justify-between gap-3 mb-2'>
                        <p className='text-xs font-bold text-slate-900 dark:text-white'>
                          <span className='text-indigo-600 dark:text-indigo-400 font-black mr-2'>Q{i + 1}.</span>
                          {q.question}
                        </p>
                        {itemScore !== undefined && (
                          <span className='px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold shrink-0 border border-indigo-500/20'>
                            {itemScore}/100
                          </span>
                        )}
                      </div>

                      {userAnswerText ? (
                        <p className='text-xs text-slate-600 dark:text-zinc-300 mb-2 italic bg-slate-100 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-black/5 dark:border-white/5'>
                          "{userAnswerText}"
                        </p>
                      ) : (
                        <p className='text-[11px] text-slate-400 dark:text-zinc-500 mb-2 italic'>
                          No response recorded
                        </p>
                      )}

                      {feedbackText && (
                        <p className='text-xs font-medium text-slate-700 dark:text-zinc-300 leading-relaxed'>
                          <strong className='text-indigo-600 dark:text-indigo-400 font-bold'>Feedback: </strong>
                          {typeof feedbackText === 'string' ? feedbackText : JSON.stringify(feedbackText)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Step3report;
