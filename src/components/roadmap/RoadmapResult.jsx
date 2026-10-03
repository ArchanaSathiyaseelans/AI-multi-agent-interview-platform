import React from 'react';
import { motion } from "motion/react";
import { FiCheckCircle, FiClock, FiMap, FiTarget, FiX } from 'react-icons/fi';
import ModuleCard from './ModuleCard';

function RoadmapResult({ roadmap, onClear }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='relative overflow-hidden bg-white dark:bg-[#121215] border border-black/8 dark:border-white/10 rounded-2xl p-6 mb-6 shadow-sm'>
        
        <div className='flex items-start justify-between mb-4'>
            <div>
                <p className='text-xs text-slate-400 dark:text-zinc-500 font-bold tracking-widest uppercase mb-1'>Personalized Learning Path</p>
                <h2 className='text-2xl font-extrabold text-slate-900 dark:text-white'>{roadmap.title}</h2>
                <p className='text-xs text-slate-600 dark:text-zinc-400 mt-1 font-medium'>
                Target Package: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{roadmap.targetPackage}</span>
                </p>
            </div>
            <button onClick={onClear} className='text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 cursor-pointer'>
                <FiX size={18}/>
            </button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
            {[
                { icon: FiTarget,      label: "Level", value: roadmap.level },
                { icon: FiClock,       label: "Duration",   value: roadmap.duration },
                { icon: FiCheckCircle, label: "Total Modules", value: `${roadmap.modules.length} topics` },
            ].map(({icon: Icon, label, value}) => (
                <div key={label} className='rounded-xl p-3 bg-slate-50 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5'>
                    <div className='flex items-center gap-1.5 mb-1'>
                        <Icon size={12} className="text-indigo-500"/>
                        <span className='text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500'>{label}</span>
                    </div>
                    <p className='text-sm font-bold text-slate-900 dark:text-white'>{value}</p>
                </div>
            ))}
        </div>
      </motion.div>

      <div className='mb-6'>
          <p className='text-xs text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2'>
              <FiMap size={13}/> Learning Modules
          </p>
          <div className='flex flex-col gap-3'>
              {roadmap.modules.map((m, i) => (
                  <ModuleCard key={m.title || i} mod={m} index={i}/>
              ))}
          </div>
      </div>
    </motion.div>
  );
}

export default RoadmapResult;
