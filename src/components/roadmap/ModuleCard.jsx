import React, { useState } from 'react';
import { AnimatePresence, motion } from "motion/react";
import { FiBookOpen, FiChevronDown, FiChevronUp, FiClock, FiYoutube } from 'react-icons/fi';

const difficultyColor = { Easy: "#10b981", Medium: "#8b5cf6", Hard: "#ef4444" };

function ModuleCard({ mod, index }) {
    const [open, setOpen] = useState(false);
    return (
        <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35 }}
            whileHover={{ y: -2 }}
            onClick={() => setOpen(!open)}
            className='bg-white dark:bg-[#121215] border border-black/8 dark:border-white/10 rounded-2xl cursor-pointer select-none shadow-sm hover:shadow-md transition-all overflow-hidden'>

            <div className='flex items-center gap-3 p-4'>
                <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold bg-slate-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5"
                    style={{ color: difficultyColor[mod.difficulty] || "#8b5cf6" }}
                >
                    {index + 1}
                </div>

                <div className='flex-1 min-w-0'>
                    <p className='text-sm font-bold text-slate-900 dark:text-white truncate'>{mod.title}</p>
                    <div className='flex items-center gap-1.5 mt-0.5'>
                        <FiClock size={11} className="text-slate-400 dark:text-zinc-500"/>
                        <span className='text-xs text-slate-500 dark:text-zinc-400'>{mod.duration}</span>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    <span className="text-xs font-bold hidden sm:block" style={{ color: difficultyColor[mod.difficulty] || "#8b5cf6" }}>
                        {mod.difficulty}
                    </span>
                    {open
                        ? <FiChevronUp size={16} className="text-slate-400 dark:text-zinc-400" />
                        : <FiChevronDown size={16} className="text-slate-400 dark:text-zinc-400" />
                    }
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className='overflow-hidden'>
                        <div className='px-4 pb-4 pt-1 border-t border-black/5 dark:border-white/5'>
                            <p className='text-xs text-slate-600 dark:text-zinc-300 mt-2 mb-3 leading-relaxed'>{mod.description}</p>
                            <div className='flex gap-2 flex-wrap'>
                                {mod.youtube && (
                                    <a href={mod.youtube} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                        <motion.button 
                                            whileHover={{ scale: 1.02 }} 
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-red-500/20 text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer">
                                            <FiYoutube size={14}/> Watch Tutorial
                                        </motion.button>
                                    </a>
                                )}

                                {mod.article && (
                                    <a href={mod.article} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                        <motion.button 
                                            whileHover={{ scale: 1.02 }} 
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                                            <FiBookOpen size={14}/> Read Article
                                        </motion.button>
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default ModuleCard;
