import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "motion/react";
import { FiChevronDown, FiClock, FiFileText, FiSend, FiX, FiZap, FiSun, FiMoon } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BsRocketTakeoff } from "react-icons/bs";
import { useCoins } from '../apis/user.api';
import api from '../utils/axios';
import { useSelector } from 'react-redux';
import RoadmapResult from '../components/roadmap/RoadmapResult';
import { useTheme } from '../context/ThemeContext';

const PACKAGE_OPTIONS = ["10 LPA", "15 LPA", "20 LPA", "30 LPA", "40 LPA"];

function Roadmap({ user, setUser }) {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [historyOpen, setHistoryOpen] = useState(false);
    const [roadmap, setRoadmap] = useState(null);
    const [role, setRole] = useState("");
    const [targetPackage, setTargetPackage] = useState(PACKAGE_OPTIONS[2]);
    const [packageOpen, setPackageOpen] = useState(false);
    const [useResume, setUseResume] = useState(false);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");

    const { resume } = useSelector((state) => state.resume);

    useEffect(() => {
        getAllRoadmaps();
    }, []);

    const getAllRoadmaps = async () => {
        setHistoryLoading(true);
        try {
            const response = await api.get("/api/roadmap/all");
            setHistory(Array.isArray(response.data?.data) ? response.data.data : []);
            setHistoryLoading(false);
        } catch (err) {
            console.error("Failed to load roadmaps:", err);
            setHistory([]);
            setHistoryLoading(false);
        }
    };

    const getRoadmapById = async (id) => {
        try {
            const response = await api.get(`/api/roadmap/${id}`);
            if (response.data?.data) {
                setRoadmap(response.data.data);
            }
            setHistoryOpen(false);
        } catch (err) {
            console.error("Failed to fetch roadmap details:", err);
        }
    };

    const handleGenerate = async () => {
        if (!role.trim() || loading) return;
        setLoading(true);
        setError("");

        try {
            const coinResponse = await useCoins({ coins: 15, action: "roadmap-generator" });
            if (coinResponse && setUser) {
                setUser((prev) => ({
                    ...prev, interviewCoin: coinResponse.interviewCoin,
                }));
            }
        } catch (err) {
            setLoading(false);
            setError("Insufficient interview coins. Please top up your coins.");
            return;
        }

        try {
            const response = await api.post("/api/roadmap/generate", {
                role,
                targetPackage,
                useResume,
                resume,
            });
            if (response.data?.data) {
                setRoadmap(response.data.data);
            }
            getAllRoadmaps();
            setLoading(false);
        } catch (err) {
            console.error("Failed to generate roadmap:", err);
            setError("Something went wrong while generating your roadmap. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0C] text-slate-900 dark:text-zinc-100 flex flex-col transition-colors duration-200'>
            <motion.nav
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className='sticky top-0 z-20 border-b border-black/8 dark:border-white/10 bg-white/80 dark:bg-[#0A0A0C]/80 backdrop-blur-xl'>
                <div className='mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6'>
                    <div onClick={() => navigate("/dashboard")}
                        className='flex cursor-pointer items-center gap-2'>
                        <span className='text-base font-extrabold text-slate-900 dark:text-white'>PrepIQ</span>
                        <span className='hidden rounded bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-zinc-400 sm:block'>Roadmap Builder</span>
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
                            onClick={() => setHistoryOpen(!historyOpen)} 
                            className='flex h-9 items-center gap-1.5 rounded-xl border border-black/15 dark:border-white/15 px-3 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer'>
                            <FiClock size={14} />
                            <span className="hidden sm:inline">History</span>
                        </button>
                    </div>
                </div>
            </motion.nav>

            <main className='flex-1 overflow-y-auto pb-36 pt-8'>
                <div className='max-w-3xl mx-auto px-4'>
                    <AnimatePresence mode='wait'>
                        {!roadmap ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.4 }}
                                className='flex flex-col items-center justify-center min-h-[45vh] text-center'>
                                <div className='p-4 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-4'>
                                    <BsRocketTakeoff size={36} />
                                </div>

                                <h3 className='text-2xl font-extrabold text-slate-900 dark:text-white mb-2'>AI Roadmap Generator</h3>
                                <p className='text-slate-600 dark:text-zinc-400 text-xs sm:text-sm max-w-md mb-6 leading-relaxed'>
                                    Select your target role and CTC package to build an end-to-end, structured preparation roadmap.
                                </p>

                                {error && <p className="mb-4 text-xs font-semibold text-red-500 max-w-md bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">{error}</p>}
                            </motion.div>
                        ) : (
                            <RoadmapResult roadmap={roadmap} onClear={() => setRoadmap(null)} />
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Fixed Input Form Bar */}
            <div className='fixed bottom-0 inset-x-0 bg-white/95 dark:bg-[#121215]/95 backdrop-blur-xl border-t border-black/8 dark:border-white/10 p-4 z-20 shadow-2xl'>
                <div className='max-w-3xl mx-auto flex flex-col gap-3'>
                    <div className='flex items-center justify-between gap-3 flex-wrap'>
                        {/* Target Package Dropdown */}
                        <div className='relative'>
                            <button
                                onClick={() => setPackageOpen(!packageOpen)}
                                className='flex items-center gap-2 px-3 py-1.5 rounded-xl border border-black/15 dark:border-white/15 bg-slate-50 dark:bg-zinc-800 text-xs font-semibold text-slate-800 dark:text-zinc-200 cursor-pointer shadow-xs'
                            >
                                <span>Target: {targetPackage}</span>
                                <FiChevronDown size={14} />
                            </button>
                            {packageOpen && (
                                <div className='absolute bottom-full mb-2 left-0 w-36 bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-30'>
                                    {PACKAGE_OPTIONS.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                setTargetPackage(opt);
                                                setPackageOpen(false);
                                            }}
                                            className='w-full text-left px-3 py-2 text-xs text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 font-medium'
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Attach Resume Checkbox */}
                        {resume && (
                            <label className='flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-zinc-300'>
                                <input
                                    type="checkbox"
                                    checked={useResume}
                                    onChange={(e) => setUseResume(e.target.checked)}
                                    className='rounded accent-indigo-600 cursor-pointer'
                                />
                                <FiFileText size={13} className='text-indigo-500' />
                                <span>Tailor to my Resume ({resume.name?.split(" ")[0] || "Resume"})</span>
                            </label>
                        )}
                    </div>

                    {/* Role Input Box */}
                    <div className='relative flex items-center'>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            placeholder="Enter role (e.g. Full Stack Developer, Data Scientist, DevOps Engineer)"
                            className='w-full pl-4 pr-28 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-black/10 dark:border-white/10 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-medium'
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={!role.trim() || loading}
                            className='absolute right-2 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-bold disabled:opacity-40 transition-all cursor-pointer shadow-md'
                        >
                            <span>{loading ? "Building..." : "Generate"}</span>
                            <FiSend size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* History Slide-over Drawer */}
            {historyOpen && (
                <div className='fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm'>
                    <div className='w-full max-w-sm bg-white dark:bg-[#121215] border-l border-black/10 dark:border-white/10 h-full p-5 flex flex-col justify-between text-slate-900 dark:text-white'>
                        <div>
                            <div className='flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10 mb-4'>
                                <h3 className='text-sm font-bold flex items-center gap-2'>
                                    <FiClock size={15} /> Previous Roadmaps
                                </h3>
                                <button onClick={() => setHistoryOpen(false)} className='text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer'>
                                    <FiX size={18} />
                                </button>
                            </div>

                            <div className='space-y-2 overflow-y-auto max-h-[75vh]'>
                                {historyLoading ? (
                                    <p className='text-xs text-slate-400 text-center py-4'>Loading history...</p>
                                ) : history.length === 0 ? (
                                    <p className='text-xs text-slate-400 text-center py-4'>No roadmaps generated yet.</p>
                                ) : (
                                    history.map((h) => (
                                        <div
                                            key={h._id}
                                            onClick={() => getRoadmapById(h._id)}
                                            className='p-3 rounded-xl border border-black/8 dark:border-white/8 bg-slate-50 dark:bg-zinc-900/60 hover:border-indigo-500/50 cursor-pointer transition-all'
                                        >
                                            <p className='text-xs font-bold text-slate-900 dark:text-white truncate'>{h.title}</p>
                                            <div className='flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400 mt-1'>
                                                <span>Target: {h.targetPackage}</span>
                                                <span>{h.level}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Roadmap;
