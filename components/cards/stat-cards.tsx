import { LucideIcon } from 'lucide-react'

interface BalanceCardProps {
  label: string
  amount: string | number
  currency?: string
  icon?: LucideIcon
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan'
}

export function StatCard({
  icon: Icon,
  label,
  value,
  variant = 'blue',
}: StatCardProps) {
  const glowColors = {
    blue: 'shadow-[var(--nf-teal-dim)] border-[var(--nf-teal)]/20',
    green: 'shadow-emerald-500/10 border-emerald-500/20',
    purple: 'shadow-[var(--nf-teal-dim)] border-[var(--nf-teal)]/20',
    orange: 'shadow-orange-500/10 border-orange-500/20',
    red: 'shadow-red-500/10 border-red-500/20',
    cyan: 'shadow-[var(--nf-teal-dim)] border-[var(--nf-teal)]/20',
  }

  const textColors = {
    blue: 'text-[var(--nf-teal)]',
    green: 'text-emerald-400',
    purple: 'text-[var(--nf-teal)]',
    orange: 'text-orange-400',
    red: 'text-red-400',
    cyan: 'text-[var(--nf-teal)]',
  }

  return (
    <div className={`glass-dark rounded-[32px] p-7 border ${glowColors[variant]} shadow-2xl group transition-all duration-500 hover:translate-y-[-4px]`}>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <p className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic'>{label}</p>
          <p className='text-3xl font-black text-white italic tracking-tighter'>{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-all ${iconColors[variant]}`}>
          <Icon className='w-7 h-7' />
        </div>
      </div>
    </div>
  )
}

export function BalanceCard({
  label,
  amount,
  currency = 'USD',
  icon: Icon,
  variant = 'default',
}: BalanceCardProps) {
  return (
    <div className="glass-dark rounded-[40px] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] translate-x-10 translate-y-[-10px]" style={{background: 'var(--nf-teal-dim)'}} />
      <div className='flex items-start justify-between relative z-10'>
        <div className='space-y-4'>
          <div className='space-y-1'>
            <p className='text-[10px] font-black uppercase tracking-[0.2em] italic' style={{color: 'var(--nf-teal)'}}>{label}</p>
            <div className='flex items-baseline gap-2'>
              <span className='text-4xl font-black text-white italic tracking-tighter'>
                ${typeof amount === 'number' ? amount.toFixed(2) : amount}
              </span>
              <span className='text-[10px] font-black text-zinc-600 uppercase tracking-widest'>{currency}</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Protocol Active</span>
          </div>
        </div>
        {Icon && (
          <div className='w-16 h-16 rounded-[24px] bg-white/5 border border-white/5 flex items-center justify-center shadow-inner transition-all duration-700' style={{border: '1px solid var(--nf-teal-dim)'}}>
            <Icon className='w-8 h-8' style={{color: 'var(--nf-teal)'}} />
          </div>
        )}
      </div>
    </div>
  )
}

interface TransactionItemProps {
  icon: LucideIcon
  title: string
  timestamp: string
  amount: number
  variant?: 'positive' | 'negative' | 'neutral'
  iconBg?: string
}

export function TransactionItem({
  icon: Icon,
  title,
  timestamp,
  amount,
  variant = 'neutral',
  iconBg,
}: TransactionItemProps) {
  const isPositive = variant === 'positive'
  return (
    <div className='flex items-center gap-3 py-3'>
      <div className={`rounded-full p-2 bg-white/5 border border-white/5`}>
        <Icon className={`w-5 h-5`} style={{color: 'var(--nf-teal)'}} />
      </div>
      <div className='flex-1'>
        <p className='font-black uppercase tracking-widest text-[#8px] text-white italic'>{title}</p>
        <p className='text-[8px] text-zinc-600 font-bold uppercase tracking-widest'>{timestamp}</p>
      </div>
      <p className={`font-black text-sm italic ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
        {isPositive ? '+' : '-'}${Math.abs(amount).toFixed(2)}
      </p>
    </div>
  )
}
