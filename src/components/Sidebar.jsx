import React, { useState } from 'react';
import { AnimatePresence, motion } from "motion/react";
import { GiArtificialHive, GiTwoCoins } from 'react-icons/gi';
import { FiFileText, FiLogOut, FiMap, FiPlus, FiSidebar, FiStar, FiEdit2, FiX, FiCheck, FiSun, FiMoon } from 'react-icons/fi';
import { useNavigate, useLocation } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import api from '../utils/axios';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
    {
        icon: <FiFileText size={16} className='text-pink-500' />,
        label: "Resume Builder",
        path: "/resume",
        color: "hover:bg-pink-500/10 hover:text-pink-600 dark:hover:text-pink-400"
    },
    {
        icon: <FiStar size={16} className='text-amber-500' />,
        label: "Resume Scorer",
        path: "/scorer",
        color: "hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400"
    },
    {
        icon: <FiMap size={16} className='text-emerald-500' />,
        label: "Roadmap Builder",
        path: "/roadmap",
        color: "hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
    },
];

function Sidebar({
    user,
    setUser,
    onNewInterview,
    onLogout,
    sidebarOpen,
    setSidebarOpen,
    moblieOpen,
    setMoblieOpen
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
    const [updating, setUpdating] = useState(false);

    const avatar = user?.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

    const handleUpdateName = async (e) => {
        if (e) e.preventDefault();
        if (!newName.trim()) return;
        setUpdating(true);
        try {
            const res = await api.post("/api/auth/update-name", { name: newName });
            if (res.data?.user && setUser) {
                setUser(res.data.user);
            } else if (setUser) {
                setUser((prev) => ({ ...prev, name: newName }));
            }
            setIsEditingName(false);
        } catch (err) {
            console.error("Failed to update name:", err);
        } finally {
            setUpdating(false);
        }
    };

    const inner = (
        <div className='flex flex-col h-full bg-white dark:bg-[#0B1120] text-slate-900 dark:text-zinc-100 transition-colors duration-200 border-r border-slate-200 dark:border-slate-800/80'>
            {/* Header / Brand */}
            <div className={`px-3.5 h-[56px] border-b border-slate-200 dark:border-slate-800/80 shrink-0 flex items-center ${sidebarOpen ? "justify-between" : "justify-center"}`}>
                {sidebarOpen && (
                    <div className='flex items-center gap-2.5 cursor-pointer' onClick={() => navigate("/dashboard")}>
                        <div className='w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.4)]'>
                            <GiArtificialHive size={19} className='text-white' />
                        </div>
                        <motion.span
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            className='font-black text-base tracking-tight text-gradient-vibrant whitespace-nowrap'>
                            PrepIQ
                        </motion.span>
                    </div>
                )}
                <div className='flex items-center gap-1'>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className='cursor-pointer hidden md:flex text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0 p-1.5'>
                        <FiSidebar size={16} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMoblieOpen(!moblieOpen)}
                        className='cursor-pointer md:hidden text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0 p-1.5'>
                        <FiSidebar size={16} />
                    </motion.button>
                </div>
            </div>

            {/* Create Interview Action Button */}
            <div className='px-3 pt-3.5 pb-2 shrink-0'>
                <motion.button
                    onClick={onNewInterview}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold rounded-xl py-2.5 transition-all shadow-[0_4px_16px_rgba(99,102,241,0.35)] cursor-pointer ${sidebarOpen ? "px-3.5" : "justify-center px-0"}`}>
                    <FiPlus size={16} className='shrink-0' />
                    <AnimatePresence>
                        {sidebarOpen &&
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className='text-xs whitespace-nowrap tracking-wide'>
                                Create Interview
                            </motion.span>}
                    </AnimatePresence>
                </motion.button>
            </div>

            <AnimatePresence>
                {sidebarOpen &&
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='px-3.5 pt-3 pb-1 text-[10px] font-black uppercase tracking-widest text-indigo-500/80 dark:text-indigo-400/80'>
                        Agents & Tools
                    </motion.p>}
            </AnimatePresence>

            {/* Navigation List */}
            <nav className='flex flex-col gap-1.5 px-3 flex-1'>
                {NAV_ITEMS.map((nav, i) => {
                    const isActive = location.pathname === nav.path;
                    return (
                        <motion.button key={i}
                            onClick={() => {
                                navigate(nav.path);
                                setMoblieOpen(false);
                            }}
                            whileHover={{ x: sidebarOpen ? 3 : 0 }}
                            className={`flex items-center gap-3 rounded-xl py-2.5 transition-all text-xs font-bold cursor-pointer ${
                                isActive 
                                    ? "bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 shadow-sm"
                                    : `text-slate-600 dark:text-slate-300 ${nav.color}`
                            } ${sidebarOpen ? "px-3" : "justify-center px-0"}`}>
                            <span className='shrink-0 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80'>{nav.icon}</span>
                            {sidebarOpen && <span className='whitespace-nowrap'>{nav.label}</span>}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Colorful Bottom Cards & Controls */}
            <div className='border-t border-slate-200 dark:border-slate-800/80 p-3 shrink-0 space-y-2.5'>
                {/* Theme Switcher Toggle */}
                <motion.button
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200 hover:bg-indigo-500/15 transition-all cursor-pointer ${sidebarOpen ? "justify-between" : "justify-center"}`}
                    title={theme === 'dark' ? 'Switch to Colorful Light Mode' : 'Switch to Colorful Dark Mode'}
                >
                    <div className='flex items-center gap-2'>
                        {theme === 'dark' ? (
                            <FiSun size={15} className='text-amber-400 shrink-0' />
                        ) : (
                            <FiMoon size={15} className='text-purple-600 shrink-0' />
                        )}
                        {sidebarOpen && (
                            <span className='text-[11px] font-bold'>
                                {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
                            </span>
                        )}
                    </div>
                    {sidebarOpen && (
                        <span className='text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-xs'>
                            {theme === 'dark' ? 'Dark' : 'Light'}
                        </span>
                    )}
                </motion.button>

                {/* Coins Card */}
                <AnimatePresence>
                    {sidebarOpen &&
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => navigate("/billing")}
                            className='group flex cursor-pointer items-center justify-between gap-2.5 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-yellow-500/10 px-3 py-2 transition-all hover:border-amber-500/60 shadow-[0_4px_14px_rgba(245,158,11,0.2)]'>
                            <div className='flex items-center gap-2.5'>
                                <div className='w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/40'>
                                    <GiTwoCoins size={16} className='text-amber-500 shrink-0' />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-[9px] uppercase tracking-wider text-amber-700 dark:text-amber-300 font-extrabold'>Interview Coins</span>
                                    <span className='text-xs font-black text-slate-900 dark:text-white tabular-nums'>{user?.interviewCoin}</span>
                                </div>
                            </div>
                            <FaCirclePlus size={16} className='text-amber-500 transition-transform duration-200 group-hover:scale-115' />
                        </motion.div>}
                </AnimatePresence>

                {/* Profile Row */}
                <div className={`flex items-center gap-2.5 ${sidebarOpen ? "" : "flex-col justify-center"}`}>
                    <div 
                        onClick={() => setIsEditingName(true)}
                        title="Click to edit name"
                        className='w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-md hover:ring-2 hover:ring-purple-500/50 transition-all'>
                        <span className='font-black text-xs'>
                            {avatar}
                        </span>
                    </div>

                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 min-w-0 cursor-pointer group"
                                onClick={() => setIsEditingName(true)}
                                title="Click to edit name"
                            >
                                <div className='flex items-center gap-1.5'>
                                    <p className="text-slate-900 dark:text-white text-[11px] font-extrabold truncate group-hover:text-indigo-500 transition-colors">
                                        {user?.name ?? "User"}
                                    </p>
                                    <FiEdit2 size={10} className='text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity' />
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-[9px] truncate font-medium">
                                    {user?.email ?? "user@email.com"}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        onClick={onLogout}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        title="Logout"
                        className={`text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0 p-1 ${sidebarOpen ? "ml-auto" : "mt-1"}`}>
                        <FiLogOut size={14} />
                    </motion.button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <motion.aside
                animate={{ width: sidebarOpen ? 260 : 72 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className='hidden md:flex fixed top-0 left-0 h-screen bg-white dark:bg-[#0B1120] border-r border-slate-200 dark:border-slate-800/80 flex-col z-40 overflow-hidden'>
                {inner}
            </motion.aside>

            <AnimatePresence>
                {moblieOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMoblieOpen(false)}
                        className='fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm' />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {moblieOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className='fixed top-0 left-0 h-screen w-[280px] max-w-[85vw] bg-white dark:bg-[#0B1120] border-r border-slate-200 dark:border-slate-800/80 flex flex-col z-50 md:hidden overflow-hidden'>
                        {inner}
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Edit Name Modal */}
            {isEditingName && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4'>
                    <div className='relative w-full max-w-xs bg-white dark:bg-[#0F172A] rounded-2xl p-6 border border-indigo-500/20 shadow-2xl text-slate-900 dark:text-white'>
                        <button 
                            onClick={() => setIsEditingName(false)}
                            className='absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors'
                        >
                            <FiX size={18} />
                        </button>
                        <h3 className='text-base font-extrabold text-gradient-vibrant mb-1'>Update Account Name</h3>
                        <p className='text-xs text-slate-500 dark:text-slate-400 mb-4'>Enter your full name as you want it displayed.</p>

                        <form onSubmit={handleUpdateName} className='space-y-3.5'>
                            <input 
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Your Full Name"
                                required
                                autoFocus
                                className='w-full px-3.5 py-2.5 border border-indigo-500/30 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500'
                            />
                            <div className='flex items-center justify-end gap-2 pt-1'>
                                <button
                                    type="button"
                                    onClick={() => setIsEditingName(false)}
                                    className='px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className='flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-md'
                                >
                                    <FiCheck size={14} />
                                    <span>{updating ? "Saving..." : "Save"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Sidebar;
