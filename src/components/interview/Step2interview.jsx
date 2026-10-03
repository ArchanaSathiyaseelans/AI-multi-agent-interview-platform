import React, { useEffect, useRef, useState } from 'react';
import maleVideo from "../../assets/male-ai.mp4";
import femaleVideo from "../../assets/female-ai.mp4";
import { AnimatePresence, motion } from "motion/react";
import { FiArrowRight, FiCamera, FiCameraOff, FiClock, FiCode, FiMessageSquare, FiMic, FiMicOff, FiSun, FiMoon, FiSquare, FiXCircle } from 'react-icons/fi';
import CodeEditor from './CodeEditor';
import Timer from './Timer';
import { submitAnswer, endInterview } from '../../apis/interview.api';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

function Step2interview({ interviewData, user }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // State
  const [question, setQuestion] = useState(interviewData.question);
  const [currentIndex, setCurrentIndex] = useState(interviewData.currentQuestion || 0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(interviewData.question.timer || 60);
  const [timerActive, setTimerActive] = useState(true);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const handleEndInterview = async () => {
    setShowEndConfirm(false);
    setLoading(true);
    setTimerActive(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    stopMic();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    try {
      await endInterview({ interviewId: interviewData.interviewId });
    } catch (e) {
      console.error("End interview error:", e);
    } finally {
      setLoading(false);
      navigate(`/interview/${interviewData.interviewId}/report`);
    }
  };

  // UI toggles
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

  // Speech
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");
  const [introSpoken, setIntroSpoken] = useState(false);

  // Refs
  const aiVideoRef = useRef(null);
  const userVideoRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  const videoSource = voiceGender === "female" ? femaleVideo : maleVideo;
  const progress = ((currentIndex + 1) / (interviewData.totalQuestions)) * 100;
  const showMicon = micOn && !isAIPlaying;

  // Speech recognition setup
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const rec = new window.webkitSpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const t = e.results[e.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + t);
    };
    recognitionRef.current = rec;
  }, []);

  const candidateFirstName = user?.name ? user.name.split(" ")[0] : "Candidate";
  const candidateInitial = user?.name ? user.name.charAt(0).toUpperCase() : "C";

  const startMic = () => {
    try {
      recognitionRef.current?.start();
    } catch (e) {
      // Ignore if recognition already active
    }
  };
  const stopMic = () => {
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      // Ignore error
    }
  };

  const toggleMic = () => {
    if (micOn) {
      stopMic();
    } else {
      startMic();
    }
    setMicOn(!micOn);
  };

  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        setCameraOn(true);
        setTimeout(() => {
          if (userVideoRef.current) userVideoRef.current.srcObject = stream;
        }, 100);
      } catch (error) {
        setCameraOn(false);
      }
    }
  };

  const handleSubmitCode = (code) => {
    setAnswer((prev) => {
      const separator = prev.trim() ? "\n\n--- Code ---\n" : "--- Code ---\n";
      return prev + separator + code;
    });
    setCodeOpen(false);
  };

  useEffect(() => {
    if (timeLeft <= 0 || !timerActive) return;
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, timerActive]);

  useEffect(() => {
    const loadVoices = () => {
      if (!window.speechSynthesis) return;
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      // Find female voice explicitly
      const femaleVoice = voices.find(v => 
        /zira|jenny|aria|samantha|victoria|karen|fiona|hazel|heera|catherine|sara|eva|susan|female|woman|girl|google.*uk.*female|google.*female/i.test(v.name)
      );

      // Fallback: Pick any voice that is not explicitly male
      const nonMaleVoice = voices.find(v => !/david|mark|george|guy|james|richard|male/i.test(v.name));

      const chosenVoice = femaleVoice || nonMaleVoice || voices[0];
      setSelectedVoice(chosenVoice);
      setVoiceGender("female");
    };

    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speakText = (text) =>
    new Promise((resolve) => {
      if (!window.speechSynthesis || !text?.trim()) { resolve(); return; }
      window.speechSynthesis.cancel();

      setTimeout(() => {
        const utter = new SpeechSynthesisUtterance(text.replace(/,/g, ", ... ").replace(/\./g, ". ... "));
        if (selectedVoice) utter.voice = selectedVoice;
        utter.rate = 0.94;
        utter.pitch = 1.15; // Natural female pitch
        utter.volume = 1;
        utter.onstart = () => {
          setIsAIPlaying(true);
          stopMic();
          aiVideoRef.current?.play().catch(() => {});
        };
        utter.onend = () => {
          aiVideoRef.current?.pause();
          setIsAIPlaying(false);
          if (micOn) startMic();
          setTimeout(() => { setSubtitle(""); resolve(); }, 300);
        };
        utter.onerror = () => {
          aiVideoRef.current?.pause();
          setIsAIPlaying(false);
          setSubtitle("");
          resolve();
        };
        setSubtitle(text);
        window.speechSynthesis.speak(utter);
      }, 150);
    });

  useEffect(() => {
    if (introSpoken) return;
    const runIntro = async () => {
      setIntroSpoken(true);
      await new Promise((r) => setTimeout(r, 1000));
      await speakText(`Welcome ${candidateFirstName}! Let's begin your interview.`);
      await new Promise((r) => setTimeout(r, 800));
      if (interviewData?.question?.question) {
        await speakText(interviewData.question.question);
      }
    };
    runIntro();
  }, []);

  useEffect(() => {
    setQuestion(interviewData.question);
    setCurrentIndex(interviewData.currentQuestion);
    setTimeLeft(interviewData.question.timer || 60);
  }, [interviewData]);

  useEffect(() => {
    if (!selectedVoice || !introSpoken) return;
    const speakQuestion = async () => {
      await new Promise((r) => setTimeout(r, 900));
      await speakText(question.question);
    };
    speakQuestion();
  }, [question]);

  useEffect(() => {
    setTimeLeft(question.timer || 60);
    setTimerActive(true);
  }, [question]);

  useEffect(() => {
    if (timeLeft !== 0) return;
    const autoSubmit = async () => {
      await speakText("Time is up. Submitting your answer now.");
      const finalAnswer = answer.trim() || "No answer provided. Time over.";
      setLoading(true);

      const res = await submitAnswer({ interviewId: interviewData.interviewId, answer: finalAnswer });

      if (res.completed) {
        setFeedback(res.feedback);
        await new Promise((r) => setTimeout(r, 700));
        await speakText(res.feedback?.feedback || "Great job! Your interview is complete. Preparing your report now.");
        setLoading(false);
        navigate(`/interview/${interviewData.interviewId}/report`);
        return;
      }

      setFeedback(res.feedback);
      await new Promise((r) => setTimeout(r, 700));
      await speakText(res.feedback?.feedback || "Noted your answer. Let's move to the next question.");
      setLoading(false);
      setQuestion(res.question);
      setCurrentIndex(res.currentQuestion);
      setAnswer("");
      setFeedback(null);
    };

    autoSubmit();
  }, [timeLeft]);

  const submit = async () => {
    if (!answer.trim()) return;
    setTimerActive(false);
    setLoading(true);

    const res = await submitAnswer({ interviewId: interviewData.interviewId, answer });

    if (res.completed) {
      setFeedback(res.feedback);
      await new Promise((r) => setTimeout(r, 700));
      await speakText(res.feedback?.feedback || "Great job! Your interview is complete. Preparing your report now.");
      setLoading(false);
      navigate(`/interview/${interviewData.interviewId}/report`);
      return;
    }

    setFeedback(res.feedback);
    await new Promise((r) => setTimeout(r, 700));
    await speakText(res.feedback?.feedback || "Noted your answer. Let's move to the next question.");
    setLoading(false);
    setQuestion(res.question);
    setCurrentIndex(res.currentQuestion);
    setAnswer("");
    setFeedback(null);
  };

  return (
    <div className='min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0C] flex flex-col items-center justify-center p-3 sm:p-5 transition-colors duration-200'>
      {codeOpen && <CodeEditor onClose={() => setCodeOpen(false)} onSubmitCode={handleSubmitCode} />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='w-full max-w-5xl bg-white dark:bg-[#0F172A] border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-[38%_62%] text-slate-900 dark:text-white'>

        {/* Left Video Panel */}
        <div className='flex flex-col border-b lg:border-b-0 lg:border-r border-black/8 dark:border-white/10 p-5 gap-3.5 bg-slate-50/50 dark:bg-slate-900/30'>
          
          <div className='flex items-center justify-between pb-1'>
            <span className='text-xs font-black tracking-widest uppercase text-gradient-vibrant'>AI Studio</span>
            <button
              onClick={toggleTheme}
              className='p-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-700 dark:text-zinc-200'
            >
              {theme === 'dark' ? <FiSun size={14} className='text-amber-400' /> : <FiMoon size={14} className='text-purple-600' />}
            </button>
          </div>

          {/* AI Avatar Video */}
          <div className='relative rounded-2xl overflow-hidden bg-black aspect-video shadow-md border border-black/10 dark:border-white/10'>
            <video
              src={videoSource}
              ref={aiVideoRef}
              muted
              playsInline
              preload="auto"
              loop
              className="w-full h-full object-cover"
            />
            {isAIPlaying && (
              <div className='absolute bottom-3 left-3 flex items-center gap-2 bg-indigo-600/90 backdrop-blur-md text-white rounded-full px-3 py-1 shadow-lg'>
                <div className='flex gap-0.5 items-end h-3.5'>
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      className="w-1 bg-white rounded-full"
                      animate={{ height: ["4px", "14px", "4px"] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
                <span className='text-[10px] font-extrabold uppercase tracking-wider'>AI Speaking</span>
              </div>
            )}
          </div>

          <div className='min-h-[48px] flex items-center justify-center'>
            <AnimatePresence>
              {subtitle &&
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className='w-full rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-3 py-2'>
                  <p className="text-xs text-indigo-900 dark:text-indigo-200 font-semibold leading-relaxed text-center">{subtitle}</p>
                </motion.div>}
            </AnimatePresence>
          </div>

          {/* User Video Frame */}
          <div className='relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 aspect-video flex items-center justify-center shadow-inner'>
            {cameraOn ?
              <>
                <video
                  ref={userVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className='absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-white'>
                  <span className="text-[10px] font-bold">Candidate</span>
                </div>
              </>
              :
              <div className='flex flex-col items-center gap-2 p-2'>
                <div className='w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center font-black text-lg shadow-md'>
                  {candidateInitial}
                </div>
                <span className='text-xs font-bold text-slate-700 dark:text-slate-300'>{candidateFirstName}</span>
              </div>
            }     
          </div>

          {/* Controls Bar */}
          <div className='flex flex-col items-center gap-2 pt-1'>
            <div className='flex items-center justify-center gap-3'>
              <motion.button
                onClick={toggleMic} 
                whileHover={{ scale: 1.08 }} 
                whileTap={{ scale: 0.93 }}
                className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all cursor-pointer shadow-sm ${
                  showMicon 
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" 
                    : "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400"
                }`}>
                {showMicon ? <FiMic size={17}/> : <FiMicOff size={17}/>}
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.08 }} 
                whileTap={{ scale: 0.93 }}
                onClick={toggleCamera}
                className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all cursor-pointer shadow-sm ${
                  cameraOn 
                    ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-600 dark:text-indigo-400" 
                    : "bg-slate-200 dark:bg-slate-800 border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-300"
                }`}>
                {cameraOn ? <FiCamera size={17}/> : <FiCameraOff size={17}/>}
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.08 }} 
                whileTap={{ scale: 0.93 }}
                onClick={() => setCodeOpen(true)}
                className="w-11 h-11 rounded-xl flex items-center justify-center border bg-purple-500/15 border-purple-500/30 text-purple-600 dark:text-purple-400 cursor-pointer shadow-sm">
                <FiCode size={17}/>
              </motion.button>
            </div>

            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-center">
              Coding question? Use <FiCode size={11} className="inline -mt-0.5 text-purple-500" /> to write &amp; submit code
            </span>
          </div>
        </div>

        {/* Right Panel - Question & Answer Area */}
        <div className='flex flex-col p-6 sm:p-7 justify-between'>
          <div>
            <div className='flex items-center justify-between mb-4'>
              <div> 
                <h2 className='text-lg font-black text-slate-900 dark:text-white'>
                  Live AI Interview
                </h2>
                <div className='flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold mt-0.5'>
                  <FiClock size={12}/>
                  <span className='capitalize'>{question.difficulty || "Standard"} Difficulty</span>
                </div>
              </div>

              <div className='flex items-center gap-2.5'>
                <Timer timeLeft={timeLeft} totalTime={question.timer || 60}/>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowEndConfirm(true)}
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-extrabold text-xs transition-colors cursor-pointer shadow-xs'
                  title="End Interview session early & generate report"
                >
                  <FiSquare size={13} className="fill-current" />
                  <span className='hidden sm:inline'>End Interview</span>
                </motion.button>
              </div>
            </div>

            {/* Question Card */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='relative overflow-hidden rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 p-5 mb-5 shadow-sm'>
              <div className='flex items-center gap-2.5 mb-2.5'>
                <div className='w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm'>
                  <FiMessageSquare size={14}/>
                </div>
                <p className='text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400'>Question {currentIndex + 1}</p>
              </div>
              <p className='text-slate-900 dark:text-white text-sm sm:text-base font-bold leading-relaxed'>
                {question.question}
              </p>
            </motion.div>

            {/* Progress Bar */}
            <div className='mb-4'>
              <div className='flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5'>
                <span>Question Progress</span>
                <span className='tabular-nums'>{currentIndex + 1} of {interviewData.totalQuestions}</span>
              </div>
              <div className='w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5'>
                <div className='h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500' style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Answer Textarea */}
            <div className='flex-1 flex flex-col min-h-0 mb-3'>
              <label className='text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block'>Your Answer Response</label>
              <textarea
                onChange={(e) => setAnswer(e.target.value)}
                value={answer}
                rows={5}
                onKeyDown={(e) => { if (e.ctrlKey && e.key === "Enter") submit(); }}
                placeholder='Type your response here or speak using mic...'
                className='w-full rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-black/10 dark:border-white/10 p-4 text-xs font-medium text-slate-900 dark:text-white outline-none resize-none focus:border-indigo-500 transition placeholder-slate-400 dark:placeholder-slate-500'
              />
            </div>

            {/* AI Feedback Box */}
            <AnimatePresence>
              {feedback && (
                <motion.div 
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className='rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 max-h-36 overflow-y-auto mb-3 shadow-xs'>
                  <p className='text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1'>AI Answer Analysis</p>
                  <p className='text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed'>{feedback.feedback}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Row */}
          <div className='flex items-center justify-between pt-3 border-t border-black/8 dark:border-white/10'>
            <span className='text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:block'>
              Press <span className='mx-1 rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 text-slate-800 dark:text-slate-200 text-[10px] font-bold'>Ctrl+Enter</span> to submit
            </span>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={submit}
              disabled={loading || !answer.trim()}
              className='ml-auto h-11 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-extrabold flex items-center gap-2 disabled:opacity-40 transition cursor-pointer shadow-md'
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Evaluating Answer...</span>
                </>
              ) : (
                <>Submit Answer <FiArrowRight size={15} /></>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* End Interview Confirmation Modal */}
      {showEndConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4'>
          <div className='relative w-full max-w-sm bg-white dark:bg-[#0F172A] rounded-2xl p-6 border border-rose-500/20 shadow-2xl text-slate-900 dark:text-white'>
            <div className='w-11 h-11 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 shadow-xs'>
              <FiSquare size={20} className='fill-current' />
            </div>
            <h3 className='text-base font-extrabold mb-1'>End Interview Session?</h3>
            <p className='text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed'>
              Are you sure you want to finish this session now? Your answered questions will be evaluated and your performance report will be generated immediately.
            </p>

            <div className='flex items-center justify-end gap-2.5'>
              <button
                type="button"
                onClick={() => setShowEndConfirm(false)}
                className='px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer'
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEndInterview}
                className='px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-extrabold hover:opacity-90 cursor-pointer shadow-md'
              >
                End &amp; Get Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Step2interview;
