import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import { FiAlertCircle, FiTrendingUp, FiUploadCloud, FiUser, FiZap, FiSun, FiMoon } from 'react-icons/fi';
import api from '../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setResume } from '../redux/resumeSlice';
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { useCoins } from '../apis/user.api';
import { useTheme } from '../context/ThemeContext';

const ScoreRing = ({ score }) => {
    const color = score >= 75 ? "#8b5cf6" : score >= 50 ? "#f59e0b" : "#ef4444";
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className='relative flex items-center justify-center'>
            <RadialBarChart
                width={110}
                height={110}
                cx={55}
                cy={55}
                innerRadius={40}
                outerRadius={53}
                startAngle={90}
                endAngle={-270}
                data={[{ value: score, fill: color }]}
                barSize={8}
            >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: isDark ? "#27272a" : "#e5e7eb" }} dataKey="value" cornerRadius={8} />
            </RadialBarChart>

            <div className='absolute flex items-center justify-center'>
                <span className='text-lg font-extrabold text-slate-900 dark:text-white leading-none tabular-nums'>{score}</span>
                <span className='text-[9px] text-slate-500 dark:text-zinc-400 mt-0.5'>/100</span>
            </div>
        </div>
    );
};

const Tag = ({ text, color }) => {
    const styles = {
        purple: "bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20",
        red: "bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/20",
        green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
        yellow: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
    };
    return (
        <div className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${styles[color] || styles.purple}`}>
            {text}
        </div>
    );
};

const Navbar = ({ label }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className='fixed inset-x-0 top-0 z-20 border-b border-black/8 dark:border-white/10 bg-white/80 dark:bg-[#0A0A0C]/80 backdrop-blur-xl'>
            <div className='mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6'>
                <div 
                    onClick={() => navigate("/dashboard")}
                    className='flex cursor-pointer items-center gap-2'>
                    <span className='text-base font-extrabold text-slate-900 dark:text-white'>PrepIQ</span>
                    <span className='hidden rounded bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-zinc-400 sm:block'>{label}</span>
                </div>

                <motion.button
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='p-2 rounded-xl border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer'
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? <FiSun size={15} className='text-amber-400' /> : <FiMoon size={15} className='text-indigo-600' />}
                </motion.button>
            </div>
        </motion.nav>
    );
};

function Scorer({ user, setUser }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { resume } = useSelector((state) => state.resume);

    const uploadResume = async () => {
        if (!file) {
            alert("Please select a PDF file.");
            return;
        }
        try {
            setLoading(true);
            try {
                const coinResponse = await useCoins({ coins: 10, action: "resume-scorer" });
                setUser((prev) => ({
                    ...prev, interviewCoin: coinResponse?.interviewCoin,
                }));
            } catch (error) {
                setLoading(false);
                alert("Failed to deduce interview coins.");
                return;
            }

            const formData = new FormData();
            formData.append("resume", file);

            const response = await api.post("/api/resume/upload", formData);
            dispatch(setResume(response?.data?.data));
            setLoading(false);
        } catch (error) {
            console.log("Upload error:", error);
            alert("Upload failed.");
            setLoading(false);
        }
    };

    if (resume) return (
        <div className='min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0C] text-slate-900 dark:text-zinc-100 transition-colors duration-200'>
            <Navbar label="Resume Scorer" />

            <section className='max-w-6xl mx-auto px-4 pt-20 pb-12 space-y-4'>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <p className='text-[10px] font-bold text-slate-400 dark:text-zinc-500 tracking-widest uppercase mb-0.5'>Resume Intelligence</p>
                        <h2 className='text-xl font-extrabold text-slate-900 dark:text-white'>{resume?.name || "Resume Profile"}</h2>
                    </div>
                    <button 
                        onClick={() => dispatch(setResume(null))}
                        className='text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white border border-black/15 dark:border-white/15 px-3 py-1.5 rounded-xl transition-all cursor-pointer'>
                        Re-upload PDF
                    </button>
                </div>

                {/* Score Header Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className='bg-white dark:bg-[#121215] border border-black/8 dark:border-white/10 rounded-2xl p-5 flex flex-col items-center gap-6 sm:flex-row shadow-sm'>
                    <ScoreRing score={resume?.score || 0} />
                    <div className='text-center sm:text-left'>
                        <p className='text-slate-500 dark:text-zinc-400 text-xs font-semibold uppercase mb-1'>Overall ATS Compatibility</p>
                        <p className='text-2xl font-black mb-2 text-slate-900 dark:text-white'>
                            {resume.score >= 75 ? "Strong Candidate Match" : resume.score >= 50 ? "Average Match" : "Needs Optimization"}
                        </p>
                        <div className='flex items-center justify-center sm:justify-start gap-2'>
                            <FiUser className='text-indigo-500 text-xs' />
                            <span className='text-xs font-semibold text-indigo-600 dark:text-indigo-400'>{resume?.suggestedRole}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Details Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-white dark:bg-[#121215] border border-black/8 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3'>
                        <div className='flex items-center gap-2 mb-2'>
                            <FiTrendingUp className='text-emerald-500' size={18} />
                            <h3 className='text-sm font-bold text-slate-900 dark:text-white'>Key Strengths</h3>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {resume?.strengths?.map((s, i) => (
                                <Tag key={i} text={s} color="green" />
                            ))}
                        </div>
                    </div>

                    <div className='bg-white dark:bg-[#121215] border border-black/8 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3'>
                        <div className='flex items-center gap-2 mb-2'>
                            <FiAlertCircle className='text-amber-500' size={18} />
                            <h3 className='text-sm font-bold text-slate-900 dark:text-white'>Areas to Improve</h3>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {resume?.weaknesses?.map((w, i) => (
                                <Tag key={i} text={w} color="yellow" />
                            ))}
                        </div>
                    </div>
                </div>

                <div className='bg-white dark:bg-[#121215] border border-black/8 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3'>
                    <div className='flex items-center gap-2 mb-2'>
                        <FiZap className='text-indigo-500' size={18} />
                        <h3 className='text-sm font-bold text-slate-900 dark:text-white'>Recommendations & Action Steps</h3>
                    </div>
                    <ul className='space-y-2 text-xs text-slate-600 dark:text-zinc-300'>
                        {resume?.recommendations?.map((rec, i) => (
                            <li key={i} className='flex items-start gap-2'>
                                <span className='text-indigo-500 font-bold'>•</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );

    return (
        <div className='min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0C] text-slate-900 dark:text-zinc-100 transition-colors duration-200'>
            <Navbar label="Resume Scorer" />

            <section className='max-w-3xl mx-auto px-4 pt-28 pb-16 text-center'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}>
                    <h1 className='text-3xl font-extrabold text-slate-900 dark:text-white mb-3'>
                        Instant ATS Resume Scoring
                    </h1>
                    <p className='text-slate-600 dark:text-zinc-400 text-xs md:text-sm max-w-lg mx-auto mb-8'>
                        Upload your PDF resume to evaluate ATS compatibility, discover keyword gaps, and receive AI-backed recommendations.
                    </p>

                    <div className='bg-white dark:bg-[#121215] border-2 border-dashed border-black/15 dark:border-white/15 rounded-3xl p-8 sm:p-12 shadow-sm text-center'>
                        <FiUploadCloud size={42} className='mx-auto text-indigo-500 mb-4' />
                        <label className='block cursor-pointer mb-4'>
                            <span className='bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md inline-block'>
                                Select Resume PDF
                            </span>
                            <input 
                                type="file" 
                                accept="application/pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className='hidden' 
                            />
                        </label>

                        {file && (
                            <p className='text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-4'>
                                Selected: {file.name}
                            </p>
                        )}

                        <button
                            onClick={uploadResume}
                            disabled={!file || loading}
                            className='w-full max-w-xs mx-auto block py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs disabled:opacity-40 transition-all cursor-pointer shadow-md'
                        >
                            {loading ? "Analyzing Resume..." : "Score Resume (10 Coins)"}
                        </button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}

export default Scorer;
