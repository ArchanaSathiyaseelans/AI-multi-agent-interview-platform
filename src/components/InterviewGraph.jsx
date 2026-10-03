import React from 'react';
import { motion } from "motion/react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../context/ThemeContext';

function CustomTooltip({ active, payload }) {
    if (active && payload?.length) {
        return (
            <div className='bg-slate-900 dark:bg-zinc-800 border border-slate-800 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white shadow-xl'>
                <p className="text-slate-400 dark:text-zinc-400 text-[10px] uppercase font-bold">{payload[0]?.payload?.skill}</p>
                <p className="font-extrabold text-white text-sm">{payload[0]?.value}%</p>
            </div>
        );
    }
    return null;
}

function RadarCard({ title, data, color, index }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -3 }}
            className='bg-white dark:bg-[#121215] border border-black/8 dark:border-white/10 rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-md transition-all'>
            <div className='w-full'>
                <ResponsiveContainer width="100%" height={210}>
                    <RadarChart data={data} cx="50%" cy="50%" outerRadius="68%">
                        <PolarGrid stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} gridType="circle" />
                        <PolarAngleAxis 
                            dataKey="skill"
                            tick={{ fill: isDark ? "rgba(255,255,255,0.6)" : "#64748B", fontSize: 10, fontWeight: 600 }} 
                        />
                        <Radar
                            name={title}
                            dataKey="score"
                            stroke={color}
                            fill={color}
                            fillOpacity={0.2}
                            strokeWidth={2}
                            dot={{ r: 3, fill: color, strokeWidth: 0 }} 
                        />
                        <Tooltip content={<CustomTooltip/>}/>
                    </RadarChart>
                </ResponsiveContainer>
                <p className='text-slate-900 dark:text-white font-bold text-xs text-center mt-2'>
                    {title}
                </p>
            </div>
        </motion.div>
    );
}

function InterviewGraph({ technicalData, hrData, technicalCount, hrCount }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const techColor = isDark ? "#818CF8" : "#4F46E5"; // Indigo
    const hrColor = isDark ? "#34D399" : "#059669";   // Emerald

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <RadarCard 
                title={`Technical Interviews (${technicalCount})`}
                data={technicalData} 
                color={techColor} 
                index={0}
            />
            <RadarCard 
                title={`HR Interviews (${hrCount})`}
                data={hrData} 
                color={hrColor} 
                index={1}
            />
        </div>
    );
}

export default InterviewGraph;
