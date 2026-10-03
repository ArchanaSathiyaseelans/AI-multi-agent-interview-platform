import React, { useState } from 'react';
import { motion } from "motion/react";
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { GiTwoCoins } from 'react-icons/gi';
import PricingCard from '../components/PricingCard';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const plans = [
    {
        title: "Free",
        price: "Free",
        coins: 150,
        button: "Claimed",
        popular: false,
        disabled: true,
        features: [
            "150 Initial Interview Coins",
            "Resume Builder Access",
            "ATS Resume Scorer",
            "Career Roadmap Generator",
        ],
    },
    {
        title: "Starter",
        price: "199",
        coins: 300,
        button: "Buy Now",
        popular: false,
        disabled: false,
        features: [
            "300 Interview Coins",
            "15 AI Mock Interviews",
            "Unlimited Resume Scores",
            "Unlimited Roadmaps",
            "Instant AI Answer Feedback",
        ],
    },
    {
        title: "Pro",
        price: "499",
        coins: 800,
        button: "Buy Now",
        popular: true,
        disabled: false,
        features: [
            "800 Interview Coins",
            "40 AI Mock Interviews",
            "Priority Gemini 2.5 Flash Response",
            "Detailed Multi-Agent Feedback",
            "Export PDF Reports",
        ],
    },
    {
        title: "Ultimate",
        price: "999",
        coins: 2000,
        button: "Buy Now",
        popular: false,
        disabled: false,
        features: [
            "2000 Interview Coins",
            "100 AI Mock Interviews",
            "Maximum Speed AI Reasoning",
            "All Advanced Roadmaps & Resumes",
            "24/7 Priority Support",
        ],
    },
];

function Billing({ user, setUser }) {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handlePayment = async (plan) => {
        if (plan.disabled) return;
        try {
            const result = await api.post("/api/billing/create", {
                planId: plan.title.toLowerCase(),
                coins: plan.coins,
                amount: Number(plan.price)
            });

            const razorpayKey = result.data.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TKZJWzdjxdyqb7";

            const options = {
                key: razorpayKey,
                amount: result.data.order.amount,
                currency: result.data.order.currency || "INR",
                name: "FresherAI Platform",
                description: `${plan.title} Plan - ${plan.coins} Interview Coins`,
                order_id: result.data.order.id,

                handler: async function (response) {
                    try {
                        const verifyRes = await api.post("/api/billing/verify", {
                            ...response,
                            planId: plan.title.toLowerCase(),
                            coins: plan.coins,
                        });
                        if (verifyRes.data?.interviewCoin !== undefined) {
                            setUser((prev) => ({
                                ...prev,
                                interviewCoin: verifyRes.data.interviewCoin,
                            }));
                        }
                        alert(`Success! ${plan.coins} Interview Coins added to your account.`);
                    } catch (err) {
                        console.error("Verification error:", err);
                        alert("Payment verification failed.");
                    }
                },
                prefill: {
                    name: user?.name || "Archana Seelan",
                    email: user?.email || "archanaseelans@gmail.com",
                },
                theme: {
                    color: "#6366f1",
                },
            };

            if (window.Razorpay) {
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                alert("Razorpay SDK is loading. Please try again in a few seconds.");
            }
        } catch (error) {
            console.error("Payment initiation error:", error);
            alert("Payment initiation failed. Please try again.");
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
                        <span className='hidden rounded bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-zinc-400 sm:block'>Interview Coins</span>
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
                            onClick={() => setShowMenu(!showMenu)} 
                            className='flex h-9 w-9 items-center justify-center rounded-xl border border-black/15 dark:border-white/15 text-slate-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer'>
                            {showMenu ? <FiX size={18} /> : <FiMenu size={18} />}
                        </button>
                    </div>

                    {showMenu && (
                        <>
                            <div onClick={() => setShowMenu(false)} className='fixed inset-0 z-30 bg-black/30 backdrop-blur-xs lg:hidden' />
                            <div className='absolute right-4 top-16 z-40 w-[260px] max-w-[calc(100vw-32px)] rounded-2xl bg-white dark:bg-[#121215] border border-black/10 dark:border-white/10 p-4 shadow-2xl text-slate-900 dark:text-white'>
                                <div className='flex items-center gap-3 border-b border-black/8 dark:border-white/10 pb-3'>
                                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20'>
                                        <GiTwoCoins className='text-amber-500 text-lg' />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500">Available Coins</p>
                                        <h3 className='text-lg font-extrabold text-slate-900 dark:text-white tabular-nums'>{user?.interviewCoin}</h3>
                                    </div>
                                </div>

                                <div className='mt-3 space-y-1.5'>
                                    {[
                                        { title: "Resume Builder", coin: "-10" },
                                        { title: "Resume Scorer", coin: "-10" },
                                        { title: "Roadmap Generator", coin: "-15" },
                                        { title: "AI Interview", coin: "-20" },
                                    ].map((item) => (
                                        <div key={item.title} className='flex items-center justify-between rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 px-3 py-1.5'>
                                            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{item.title}</span>
                                            <span className="text-xs font-bold text-red-500">{item.coin}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </motion.nav>

            <div className='mx-auto max-w-4xl px-4 py-12 flex-1'>
                <div className='text-center max-w-xl mx-auto mb-10'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3'>
                        <GiTwoCoins size={14} /> Interview Coins Balance: {user?.interviewCoin}
                    </div>
                    <h1 className='text-3xl font-extrabold text-slate-900 dark:text-white mb-2'>
                        Top Up Your Interview Coins
                    </h1>
                    <p className='text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed'>
                        Get instant access to AI mock interviews, detailed answer feedback, resume ATS scoring, and career roadmaps.
                    </p>
                </div>

                <div className='flex flex-wrap justify-center gap-6'>
                    {plans.map((p) => (
                        <PricingCard
                            key={p.title}
                            title={p.title}
                            price={p.price}
                            coins={p.coins}
                            button={p.button}
                            features={p.features}
                            popular={p.popular}
                            disabled={p.disabled}
                            onBuy={() => handlePayment(p)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Billing;
