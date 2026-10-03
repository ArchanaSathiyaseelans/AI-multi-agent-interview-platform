import React, { useState } from 'react';
import ResumeForm from '../components/resume/ResumeForm';
import initialData from '../components/resume/initialData';
import { motion } from "motion/react";
import { FiArrowLeft, FiArrowRight, FiEye, FiSun, FiMoon } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PreviewResume from '../components/resume/PreviewResume';
import { useTheme } from '../context/ThemeContext';

const STEPS = [
  { step: 1, title: "Personal Information", subtitle: "Your basic contact details" },
  { step: 2, title: "Professional Summary", subtitle: "A quick intro about yourself" },
  { step: 3, title: "Skills", subtitle: "Your technical skills" },
  { step: 4, title: "Work Experience", subtitle: "Your past jobs & internships" },
  { step: 5, title: "Projects", subtitle: "Projects you have built" },
  { step: 6, title: "Education", subtitle: "Your academic background" },
];

const TOTAL_STEPS = STEPS.length;

function ResumeBuilder({ user, setUser }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState(initialData);
    const [showPreview, setShowPreview] = useState(false);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const progressPct = ((currentStep) / (TOTAL_STEPS)) * 100;
    const activeStep = STEPS.find((s) => s.step === currentStep);

    const goPrev = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    };

    const goNext = () => {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      }
    };

    const isLastStep = currentStep === STEPS.length;

    if (showPreview) {
      return <PreviewResume data={data} user={user} setUser={setUser} onBack={() => setShowPreview(false)} />;
    }

    return (
      <div className='min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0C] text-slate-900 dark:text-zinc-100 flex flex-col transition-colors duration-200'>
        <motion.nav 
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className='sticky top-0 z-20 border-b border-black/8 dark:border-white/10 bg-white/80 dark:bg-[#0A0A0C]/80 backdrop-blur-xl'>
            <div className='mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6'>
                <div 
                    onClick={() => navigate("/dashboard")}
                    className='flex cursor-pointer items-center gap-2'>
                    <span className='text-base font-extrabold text-slate-900 dark:text-white'>PrepIQ</span>
                    <span className='hidden rounded bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-zinc-400 sm:block'>Resume Builder</span>
                </div>

                <div className='flex items-center gap-2'>
                    <motion.button
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='p-2 rounded-xl border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer'
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? <FiSun size={15} className='text-amber-400' /> : <FiMoon size={15} className='text-indigo-600' />}
                    </motion.button>

                    <button 
                        onClick={() => setShowPreview(true)} 
                        className='flex h-9 items-center gap-1.5 rounded-xl border border-black/15 dark:border-white/15 px-3 text-xs font-semibold text-slate-700 dark:text-zinc-200 transition hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer'>
                        <FiEye size={14} />
                        <span className='hidden sm:inline'>Preview Resume</span>
                    </button>
                </div>
            </div>
        </motion.nav>

        {/* Progress Bar */}
        <div className='h-1 w-full bg-slate-200 dark:bg-zinc-800'>
          <div 
            className='h-full bg-slate-900 dark:bg-white transition-all duration-300'
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Main Step Container */}
        <main className='flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col justify-between'>
          <div>
            <div className='mb-6'>
              <span className='text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400'>
                Step {currentStep} of {TOTAL_STEPS}
              </span>
              <h2 className='text-2xl font-extrabold text-slate-900 dark:text-white mt-1'>
                {activeStep?.title}
              </h2>
              <p className='text-xs text-slate-500 dark:text-zinc-400 mt-0.5'>
                {activeStep?.subtitle}
              </p>
            </div>

            <div className='bg-white dark:bg-[#121215] border border-black/8 dark:border-white/10 rounded-2xl p-6 shadow-sm mb-8'>
              <ResumeForm step={currentStep} data={data} setData={setData} />
            </div>
          </div>

          <div className='flex items-center justify-between pt-4 border-t border-black/8 dark:border-white/10'>
            <button
              onClick={goPrev}
              disabled={currentStep === 1}
              className='flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-black/15 dark:border-white/15 text-slate-700 dark:text-zinc-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer'
            >
              <FiArrowLeft size={14} />
              Previous
            </button>

            {isLastStep ? (
              <button
                onClick={() => setShowPreview(true)}
                className='flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer'
              >
                View Full Resume
                <FiEye size={14} />
              </button>
            ) : (
              <button
                onClick={goNext}
                className='flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-black shadow-md hover:bg-slate-800 dark:hover:bg-zinc-200 transition-all cursor-pointer'
              >
                Next Step
                <FiArrowRight size={14} />
              </button>
            )}
          </div>
        </main>
      </div>
    );
}

export default ResumeBuilder;
