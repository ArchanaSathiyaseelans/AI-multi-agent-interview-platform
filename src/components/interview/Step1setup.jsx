import React, { useState, useRef } from 'react';
import { motion } from "motion/react";
import { FiArrowLeft, FiArrowRight, FiBriefcase, FiCheck, FiCheckCircle, FiFileText, FiUploadCloud, FiSun, FiMoon } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCoins } from '../../apis/user.api';
import api from '../../utils/axios';
import { setResume } from '../../redux/resumeSlice';
import { startInterview } from '../../apis/interview.api';
import { useTheme } from '../../context/ThemeContext';

function Step1setup({ user, setUser }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const { theme, toggleTheme } = useTheme();
    const { resume } = useSelector((state) => state.resume);
    const [role, setRole] = useState("");
    const [type, setType] = useState("technical");
    const [useResume, setUseResume] = useState(!!resume);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [starting, setStarting] = useState(false);

    const handleUploadResume = async (selectedFile) => {
        const targetFile = selectedFile || file;
        if (!targetFile) {
            alert("Please select a PDF file.");
            return;
        }
        try {
            setUploading(true);
            try {
                const coinResponse = await useCoins({ coins: 10, action: "resume-scorer" });
                if (coinResponse && setUser) {
                    setUser((prev) => ({
                        ...prev, interviewCoin: coinResponse?.interviewCoin,
                    }));
                }
            } catch (error) {
                console.warn("Coin deduction note:", error);
            }

            const formData = new FormData();
            formData.append("resume", targetFile);

            const response = await api.post("/api/resume/upload", formData);
            if (response?.data?.data) {
                dispatch(setResume(response.data.data));
                if (!role && response.data.data.suggestedRole) {
                    setRole(response.data.data.suggestedRole);
                }
            }
            setUploading(false);
            setFile(null);
        } catch (error) {
            console.error("Resume upload error:", error);
            alert("Failed to upload and parse resume.");
            setUploading(false);
        }
    };

    const start = async () => {
        if (!role.trim()) return;
        setStarting(true);
        try {
            const coinResponse = await useCoins({ coins: 20, action: "start-interview" });
            if (coinResponse && setUser) {
                setUser((prev) => ({
                    ...prev, interviewCoin: coinResponse?.interviewCoin,
                }));
            }
        } catch (error) {
            console.error("Coin deduction error:", error);
        }

        try {
            const response = await startInterview({ role, type, useResume, resume });
            const targetId = response?.interviewId || response?.interview?._id;

            if (targetId) {
                setStarting(false);
                navigate(`/interview/${targetId}`);
            } else {
                setStarting(false);
                alert("Failed to create interview session. Please try again.");
            }
        } catch (err) {
            console.error("Failed to start interview:", err);
            setStarting(false);
            alert("An error occurred while starting the interview session.");
        }
    };

    return (
        <div className='min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0C] text-slate-900 dark:text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-200'>
            <div className='w-full max-w-4xl flex items-center justify-between mb-4'>
                <div onClick={() => navigate("/dashboard")} className='inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800/80 px-3 py-1.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all'>
                    <FiArrowLeft size={14} />
                    <span>Back to Dashboard</span>
                </div>

                <button
                    onClick={toggleTheme}
                    className='p-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer'
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? <FiSun size={15} className='text-amber-400' /> : <FiMoon size={15} className='text-indigo-600' />}
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className='w-full max-w-4xl bg-white dark:bg-[#121215] border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden grid lg:grid-cols-[42%_58%] shadow-xl text-slate-900 dark:text-white'>

                {/* Left Panel */}
                <div className='p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-black/8 dark:border-white/10 flex flex-col justify-between gap-6 bg-slate-50/50 dark:bg-zinc-900/30'>
                    <div>
                        <h2 className='text-2xl font-extrabold leading-snug'>
                            Ready for practice,<br />
                            <span className='text-indigo-600 dark:text-indigo-400'>{user?.name}</span>
                        </h2>

                        <p className='mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-zinc-400'>
                            Simulate realistic AI interviews, answer interactive questions with timers, and get immediate feedback.
                        </p>
                    </div>

                    <div className='space-y-2.5'>
                        {[
                            "Tailored Technical & HR Questions",
                            "Personalized Resume Context",
                            "Detailed Answer Performance Analysis",
                            "Realistic Timed Practice Environment",
                        ].map((item, index) => (
                            <div key={index} className='flex items-center gap-3 rounded-xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-800/50 p-3 shadow-xs'>
                                <div className='w-6 h-6 shrink-0 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs'>
                                    <FiCheck size={14} />
                                </div>
                                <span className='text-xs font-semibold text-slate-700 dark:text-zinc-300'>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel */}
                <div className='p-6 sm:p-8 flex flex-col justify-between'>
                    <div>
                        <h2 className='text-xl font-bold'>Configure Session</h2>
                        <p className='mt-0.5 text-xs text-slate-500 dark:text-zinc-400'>Set up your interview role and parameters.</p>
                    </div>

                    <div className='mt-6 space-y-4'>
                        {/* Role Input */}
                        <div>
                            <label className='text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 block'>Target Role</label>
                            <div className='relative'>
                                <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={15} />
                                <input 
                                    type="text"
                                    onChange={(e) => setRole(e.target.value)}
                                    value={role}
                                    placeholder='e.g. Frontend Engineer, Python Developer'
                                    className='w-full h-11 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-black/10 dark:border-white/10 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-indigo-500' 
                                />
                            </div>
                        </div>

                        {/* Type Toggle */}
                        <div>
                            <label className='text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 block'>Interview Type</label>
                            <div className='flex rounded-xl bg-slate-100 dark:bg-zinc-800 p-1 border border-black/5 dark:border-white/5'>
                                {["technical", "hr"].map((item) => (
                                    <button 
                                        key={item}
                                        onClick={() => setType(item)}
                                        className={`flex-1 h-9 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                                            type === item 
                                                ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs" 
                                                : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                                        }`} 
                                    >
                                        {item === "technical" ? "Technical Interview" : "HR & Behavioral"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Resume Toggle & Dropzone/Status */}
                        <div className='rounded-xl border border-black/8 dark:border-white/10 bg-slate-50 dark:bg-zinc-800/60 p-4 space-y-3'>
                            <div className='flex items-center justify-between gap-2'>
                                <div>
                                    <h3 className='text-xs font-bold text-slate-900 dark:text-white'>Incorporate Resume Context</h3>
                                    <p className='mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400'>
                                        Tailor mock questions to your actual experience and skills.
                                    </p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setUseResume(!useResume)} 
                                    className={`relative shrink-0 w-11 h-6 rounded-full transition-colors cursor-pointer ${useResume ? "bg-indigo-600" : "bg-slate-300 dark:bg-zinc-700"}`}
                                >
                                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-xs ${useResume ? "left-5.5" : "left-0.5"}`} />
                                </button>
                            </div>

                            {useResume && (
                                <div className='pt-2 border-t border-black/5 dark:border-white/5 space-y-2.5'>
                                    {/* Hidden global file input for direct file picking */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => {
                                            const sel = e.target.files?.[0];
                                            if (sel) {
                                                setFile(sel);
                                                handleUploadResume(sel);
                                            }
                                        }}
                                        className='hidden'
                                    />

                                    {resume && !file ? (
                                        <div className='rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center justify-between gap-3'>
                                            <div className='flex items-center gap-2.5 min-w-0'>
                                                <FiFileText size={18} className='text-emerald-500 shrink-0' />
                                                <div className='min-w-0'>
                                                    <p className='text-xs font-bold text-emerald-800 dark:text-emerald-300 truncate'>
                                                        {resume?.name || "Resume Uploaded"}
                                                    </p>
                                                    <p className='text-[10px] text-emerald-600 dark:text-emerald-400 truncate'>
                                                        Suggested Role: {resume?.suggestedRole || "Custom Candidate"}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className='text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 cursor-pointer'
                                            >
                                                Upload New PDF
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='space-y-2'>
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className='flex flex-col items-center justify-center border-2 border-dashed border-indigo-500/30 dark:border-indigo-500/20 hover:border-indigo-500 rounded-xl p-3.5 bg-indigo-500/5 cursor-pointer transition-colors text-center'
                                            >
                                                <FiUploadCloud size={22} className='text-indigo-500 mb-1' />
                                                <span className='text-xs font-bold text-slate-800 dark:text-zinc-200'>
                                                    {file ? file.name : "Click to Upload Resume PDF"}
                                                </span>
                                                <span className='text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5'>
                                                    AI automatically parses skills &amp; experience
                                                </span>
                                            </div>

                                            {uploading && (
                                                <div className='flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 py-1'>
                                                    <div className='w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin' />
                                                    <span>Parsing &amp; Analyzing Resume PDF...</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <motion.button
                        onClick={start}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!role.trim() || starting}
                        className='mt-6 h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-extrabold flex items-center justify-center gap-2 disabled:opacity-40 transition cursor-pointer shadow-md'
                    >
                        {starting ? "Generating Questions..." : (
                            <>Start Interview Session <FiArrowRight size={15} /></>
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}

export default Step1setup;
