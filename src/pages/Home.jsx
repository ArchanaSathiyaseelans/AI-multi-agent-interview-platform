import React, { useState } from 'react';
import { motion } from "motion/react";
import { GiArtificialHive } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";
import LoginModel from '../components/LoginModel';
import dashboard from "/src/assets/images/prepiq_dashboard_preview_1791044579045.jpg";
import { FiMic, FiFileText, FiBarChart2, FiMap, FiSun, FiMoon, FiZap, FiStar } from "react-icons/fi";
import { useTheme } from '../context/ThemeContext';

function Home({ setUser }) {
    const [showLogin, setShowLogin] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <div className='bg-[#F8FAFC] dark:bg-[#090D16] text-slate-900 dark:text-zinc-100 font-sans min-h-screen overflow-x-hidden transition-colors duration-200 bg-gradient-aurora'>

            {/* Navbar */}
            <motion.nav
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className='fixed top-0 left-0 right-0 z-50 h-[58px] flex items-center justify-between px-6 bg-white/80 dark:bg-[#090D16]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80'>

                <div className='flex items-center gap-2.5 cursor-pointer' onClick={() => setShowLogin(true)}>
                    <div className='w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]'>
                        <GiArtificialHive size={19} className='text-white' />
                    </div>
                    <span className='font-black text-lg tracking-tight text-gradient-vibrant'>PrepIQ</span>
                </div>

                <div className='flex items-center gap-3'>
                    <motion.button
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='p-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/20 transition-colors cursor-pointer'
                        title={theme === 'dark' ? 'Switch to Colorful Light Mode' : 'Switch to Colorful Dark Mode'}
                    >
                        {theme === 'dark' ? <FiSun size={17} className='text-amber-400' /> : <FiMoon size={17} className='text-purple-600' />}
                    </motion.button>

                    <motion.button
                        onClick={() => setShowLogin(true)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold rounded-xl px-4 py-2 text-xs cursor-pointer transition-all shadow-[0_4px_16px_rgba(99,102,241,0.35)] flex items-center gap-2'>
                        Get Started <FaArrowRight size={11} />
                    </motion.button>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className='relative pt-32 pb-20 overflow-hidden'>
                <div className='max-w-5xl mx-auto px-6 text-center relative z-10'>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 text-indigo-600 dark:text-indigo-300 text-xs font-extrabold mb-6 shadow-sm'>
                        <FiStar className='text-amber-500 animate-spin' style={{ animationDuration: '4s' }} />
                        <span>Multi-Agent AI Interview & Resume Intelligence</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.12 }}
                        className='text-4xl md:text-6xl font-black leading-[1.1] tracking-tight mb-6 text-slate-900 dark:text-white'>
                        Job Interviews Don't Have To Suck<br />
                        <span className="text-gradient-vibrant">
                            Practice with AI & Land Your Dream CTC
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.2 }}
                        className='text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8 font-medium'>
                        PrepIQ combines specialized AI agents for Technical & HR mock interviews, ATS resume scoring, detailed answer evaluation, and tailored career roadmaps.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.28 }}
                        className='flex items-center justify-center gap-4'>
                        <motion.button
                            onClick={() => setShowLogin(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className='flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold px-7 py-3.5 rounded-2xl text-sm cursor-pointer shadow-[0_8px_24px_rgba(99,102,241,0.4)] transition-all'>
                            <span>Get Started For Free</span>
                            <FaArrowRight size={13} />
                        </motion.button>
                    </motion.div>
                </div>

                {/* Dashboard Showcase Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className='mt-14 rounded-3xl overflow-hidden border-2 border-indigo-500/20 shadow-[0_20px_60px_rgba(99,102,241,0.25)] max-w-4xl mx-auto px-2 sm:px-0 bg-white dark:bg-[#0F172A] p-2'>
                    <img src={dashboard} alt='PrepIQ Dashboard Preview' referrerPolicy="no-referrer" className='w-full h-auto object-cover block rounded-2xl shadow-lg' />
                </motion.div>
            </section>

            {/* AI Agents Grid */}
            <section className='py-20 relative'>
                <div className='max-w-6xl mx-auto px-6'>
                    <div className='text-center mb-14'>
                        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-extrabold mb-4'>
                            <FiZap className='text-amber-500' />
                            Specialized AI Agent Squad
                        </div>

                        <h2 className='text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4'>
                            Four Powerful Agents for Every Stage
                        </h2>

                        <p className='text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium'>
                            From resume parsing to mock coding sessions and personalized career roadmaps, your AI career squad is ready 24/7.
                        </p>
                    </div>

                    <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {[
                            {
                                icon: <FiFileText size={24} />,
                                title: "Resume Agent",
                                desc: "Parse PDF resumes, get ATS compatibility scores, and identify missing technical skills.",
                                gradient: "from-pink-500 to-rose-500",
                                border: "border-pink-500/30",
                                textGradient: "from-pink-500 to-rose-500"
                            },
                            {
                                icon: <FiMic size={24} />,
                                title: "Interview Agent",
                                desc: "Simulate technical and HR interviews with real-time timers and speech/text input.",
                                gradient: "from-cyan-500 to-emerald-500",
                                border: "border-cyan-500/30",
                                textGradient: "from-cyan-500 to-emerald-500"
                            },
                            {
                                icon: <FiBarChart2 size={24} />,
                                title: "Feedback Agent",
                                desc: "Receive granular scores on correctness, clarity, relevance, and problem solving.",
                                gradient: "from-amber-500 to-orange-500",
                                border: "border-amber-500/30",
                                textGradient: "from-amber-500 to-orange-500"
                            },
                            {
                                icon: <FiMap size={24} />,
                                title: "Roadmap Agent",
                                desc: "Generate custom learning paths tailored to your target package and career goals.",
                                gradient: "from-indigo-500 to-purple-600",
                                border: "border-indigo-500/30",
                                textGradient: "from-indigo-500 to-purple-600"
                            },
                        ].map((agent, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: i * 0.08 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className={`bg-white dark:bg-[#0F172A] border ${agent.border} rounded-3xl p-6 shadow-md hover:shadow-xl transition-all relative overflow-hidden group`}>
                                <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${agent.gradient}`} />
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${agent.gradient} text-white flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {agent.icon}
                                </div>
                                <h3 className='text-lg font-black mb-2 text-slate-900 dark:text-white'>{agent.title}</h3>
                                <p className='text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-medium'>{agent.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {showLogin && <LoginModel onClose={() => setShowLogin(false)} setUser={setUser} />}

            {/* Footer */}
            <footer className='border-t border-slate-200 dark:border-slate-800/80 py-8 text-center bg-white dark:bg-[#0B1120] text-slate-600 dark:text-slate-400 transition-colors'>
                <div className='flex items-center justify-center gap-2.5 mb-2'>
                    <div className='w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-md'>
                        <GiArtificialHive size={16} className='text-white' />
                    </div>
                    <span className='font-black text-base text-gradient-vibrant'>PrepIQ</span>
                </div>
                <div className='text-xs text-slate-500 dark:text-slate-400 font-medium'>
                    © {new Date().getFullYear()} PrepIQ · Powered by Gemini & MongoDB
                </div>
            </footer>
        </div>
    );
}

export default Home;
