import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { GiTwoCoins } from 'react-icons/gi';

function PricingCard({
    title,
    price,
    coins,
    button,
    features,
    popular,
    disabled,
    onBuy,
}) {
    return (
        <div className={`relative w-full max-w-[320px] rounded-2xl border p-6 transition-all shadow-sm hover:shadow-md
        ${popular
          ? "border-indigo-500 bg-white dark:bg-[#121215] ring-2 ring-indigo-500/20"
          : "border-black/8 dark:border-white/10 bg-white dark:bg-[#121215]"
        }`}>

            {popular && (
                <div className='absolute right-4 top-4 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white'>
                    Popular
                </div>
            )}

            <h2 className='text-lg font-extrabold text-slate-900 dark:text-white'>{title}</h2>

            <div className='mt-3 flex items-baseline gap-1.5'>
                <span className='text-4xl font-black text-slate-900 dark:text-white tabular-nums'>{price}</span>
                {price !== "Free" && (
                   <span className='text-xs font-semibold text-slate-500 dark:text-zinc-400'>
                       INR
                   </span>
                )}
            </div>

            <div className='mt-4 flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3'>
                <GiTwoCoins className="text-amber-500 shrink-0" size={16}/>
                <span className='text-xs font-bold text-slate-900 dark:text-white tabular-nums'>
                    {coins} Interview Coins
                </span>
            </div>

            <div className='mt-5 space-y-2.5'>
                {features.map((f) => (
                    <div key={f} className='flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-300 font-medium'>
                        <FiCheck className="text-emerald-500 shrink-0" size={14} />
                        <span>{f}</span>
                    </div>
                ))}
            </div>

            <button 
                disabled={disabled}
                onClick={onBuy}
                className={`mt-6 w-full rounded-xl py-2.5 text-xs font-bold transition cursor-pointer shadow-sm
                ${disabled
                    ? "bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 border border-black/5 dark:border-white/5 cursor-not-allowed"
                    : popular
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black"
                }`}
            >
                {button}
            </button>
        </div>
    );
}

export default PricingCard;
