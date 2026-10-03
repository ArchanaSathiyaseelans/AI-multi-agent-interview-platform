import React from 'react';
import { motion } from "motion/react";
import { FiBarChart2, FiCheckCircle, FiHelpCircle, FiAward } from 'react-icons/fi';

const CARD_VARIANTS = [
  {
    icon: FiBarChart2,
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/10",
    text: "text-indigo-600 dark:text-indigo-400"
  },
  {
    icon: FiHelpCircle,
    gradient: "from-cyan-500 via-teal-500 to-emerald-500",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400"
  },
  {
    icon: FiCheckCircle,
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400"
  },
  {
    icon: FiAward,
    gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400"
  }
];

function Statbox({ label, value, sub, subHighlight, index = 0 }) {
  const variant = CARD_VARIANTS[index % CARD_VARIANTS.length];
  const Icon = variant.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`relative overflow-hidden bg-white dark:bg-[#0F172A] border ${variant.border} rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group`}
    >
      {/* Top Colorful Accent Line */}
      <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${variant.gradient}`} />

      <div>
        <div className='flex items-center justify-between mb-3'>
          <p className='text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-wider'>{label}</p>
          <div className={`p-2 rounded-xl ${variant.bg} ${variant.text} transition-transform duration-200 group-hover:scale-110`}>
            <Icon size={18} />
          </div>
        </div>
        <p className='text-slate-900 dark:text-white text-3xl font-black tracking-tight tabular-nums'>{value ?? 0}</p>
      </div>

      {sub && (
        <div className='flex items-center gap-2 mt-4 flex-wrap text-xs'>
          {subHighlight && (
            <span className={`text-[10px] font-extrabold ${variant.bg} ${variant.text} px-2 py-0.5 rounded-md border ${variant.border}`}>
              {subHighlight}
            </span>
          )}
          <span className='text-slate-500 dark:text-slate-400 text-[11px] font-medium'>{sub}</span>
        </div>
      )}
    </motion.div>
  );
}

export default Statbox;
