'use client';


import { 
    ChevronLeft, 
    FileText, 
    Info, 
    Award, 
    Gift, 
    Zap, 
    ShieldCheck, 
    ArrowRight, 
    TrendingUp 
} from 'lucide-react';
import Link from 'next/link';



const VIP_LEVELS = [
    { level: 'Junior Agent', deposit: 100, tasks: 40, yield: '0.4%', color: 'from-[#3DD6C8] to-[#1a1a2e]' },
    { level: 'Mid-Level Agent', deposit: 500, tasks: 45, yield: '0.6%', color: 'from-[#E34304] to-[#1a1a2e]' },
    { level: 'Senior Agent', deposit: 1500, tasks: 50, yield: '0.8%', color: 'from-amber-400 to-orange-500' },
    { level: 'Mentor Agent', deposit: 5000, tasks: 55, yield: '1.0%', color: 'from-rose-500 to-red-600' },
];

const BONUS_CHIPS = [
    { deposit: 500, bonus: 30 },
    { deposit: 1000, bonus: 60 },
    { deposit: 2000, bonus: 200 },
    { deposit: 3000, bonus: 500 },
    { deposit: 5000, bonus: 1000 },
    { deposit: 10000, bonus: 2000 },
];

export default function RulesPage() {
    return (
        <div className="max-w-5xl mx-auto pb-20 animate-fade-in space-y-10">
            

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-text-primary dark:text-white uppercase tracking-tight">System Protocols</h1>
                    <p className="text-text-secondary text-xs mt-1 font-bold uppercase tracking-widest font-mono opacity-60">Governance & Reward Structure</p>
                </div>
                <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_5px_var(--color-success)]" />
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Live Policy</span>
                </div>
            </div>

            {/* Salary Hub Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <TrendingUp size={20} className="text-primary-light" />
                    </div>
                    <h2 className="text-lg font-black text-text-primary dark:text-white uppercase tracking-tight">VIP Earnings Matrix</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {VIP_LEVELS.map((v, i) => (
                        <div key={i} className="glass-card p-6 flex flex-col justify-between group hover:border-primary/40 transition-all text-center">
                            <div>
                                <span className={`text-[10px] font-black uppercase tracking-[0.3em] bg-gradient-to-r ${v.color} bg-clip-text text-transparent mb-1 block`}>Tier {i+1}</span>
                                <h3 className="text-2xl font-black text-text-primary dark:text-white">{v.level}</h3>
                            </div>
                            <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 space-y-2 text-[10px] font-black uppercase tracking-widest font-mono">
                                <span className="text-text-secondary opacity-50 block">In: ${v.deposit}</span>
                                <span className="text-success block">{v.tasks} Tasks/Product</span>
                                <span className="text-primary-light block">{v.yield} Reward Yield</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rewards Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* First Deposit Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                            <Gift size={20} className="text-accent-light" />
                        </div>
                        <h2 className="text-lg font-black text-text-primary dark:text-white uppercase tracking-tight">Activation Incentives</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {BONUS_CHIPS.map((b, i) => (
                            <div key={i} className="glass-card-strong p-5 text-center relative overflow-hidden group hover:scale-[1.02] transition-all">
                                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest block mb-1 opacity-50">Deposit ${b.deposit}</span>
                                <p className="text-xl font-black text-accent-light leading-none">+${b.bonus}</p>
                                <span className="text-[10px] font-black text-text-secondary dark:text-white/40 uppercase tracking-tighter mt-1 block">Bonus Credit</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-black/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-2xl flex items-center gap-4">
                         <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                            <Info size={14} className="text-text-secondary" />
                         </div>
                         <p className="text-[9px] font-bold text-text-secondary uppercase tracking-widest leading-relaxed">
                            Bonuses are issued automatically upon confirmation of first nodal activation. Contact support if not credited within 10 minutes.
                         </p>
                    </div>
                </div>

                {/* Team & Governance */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                            <Zap size={20} className="text-success" />
                        </div>
                        <h2 className="text-lg font-black text-text-primary dark:text-white uppercase tracking-tight">Referral Matrix</h2>
                    </div>

                    <div className="glass-card p-8 space-y-6 h-full flex flex-col justify-between border-success/20 bg-success/[0.02]">
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-text-secondary leading-relaxed uppercase tracking-wider opacity-60">
                                Expand the SmartBugMedia. network. Direct referrals grant a perpetual yields optimization fee based on their productivity.
                            </p>
                            <div className="flex items-end justify-between">
                                <span className="text-4xl font-black text-success">20%</span>
                                <span className="text-[10px] font-black text-text-primary dark:text-white uppercase tracking-[0.3em] mb-2 opacity-50">Commission Fee</span>
                            </div>
                        </div>
                        
                        <div className="pt-6 border-t border-black/5 dark:border-white/5 space-y-4">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={16} className="text-success" />
                                <span className="text-[10px] font-black text-text-primary dark:text-white uppercase tracking-widest">Real-time Settlements</span>
                            </div>
                            <button className="w-full py-3.5 bg-success text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-success/20 hover:brightness-110 flex items-center justify-center gap-2">
                                Invite Network <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Terms of Engagement Section */}
            <div className="glass-card-strong p-10 md:p-14 border border-white/5 space-y-12 bg-slate-900/40 backdrop-blur-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                    <div className="shrink-0 p-5 rounded-3xl bg-white/5 border border-white/10 text-white shadow-2xl">
                        <FileText size={40} strokeWidth={1} />
                    </div>
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-3">User Agreement & Terms of Service</h2>
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">SmartBugMedia. Institutional Protocol v4.5</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[11px] font-bold text-white/60 leading-relaxed uppercase tracking-widest">
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-primary-light mb-2 text-xs font-black">1. Product Listing Maintenance Tasks</h4>
                                    <p className="opacity-80">
                                        1.1 Users must maintain a minimum account balance of 100 USDT in order to begin a new cycle of product maintenance tasks.
                                        1.2 Initiating a new product maintenance cycle will reset the task counter and requires the minimum balance to be available in the account.
                                        1.3 After completing a full set of product maintenance tasks, users may choose to withdraw available balances or continue completing 3–6 task cycles to increase accumulated earnings.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-primary-light mb-2 text-xs font-black">2. User Levels and Account Status</h4>
                                    <p className="opacity-80">
                                        2.1 SmartBugMedia maintains a tiered user system based on account activity and balance. Users may apply for level upgrades through Customer Support.
                                        2.2 After resetting an account cycle, users must complete the assigned product maintenance tasks before initiating withdrawal.
                                        2.3 Withdrawal requests require the user account credit score to remain at 100%.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-primary-light mb-2 text-xs font-black">3. Financial Security</h4>
                                    <p className="opacity-80">
                                        3.1 All user funds are securely stored within the platform account system.
                                        3.2 Once all assigned product maintenance tasks are completed, users may request withdrawal of their available funds.
                                        3.3 The platform utilizes automated systems to process operational data and minimize human error.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-primary-light mb-2 text-xs font-black">5. Product Packages and Platform Rewards</h4>
                                    <p className="opacity-80">
                                        5.1 Platform tasks may include Standard Product Listings and Special Product Packages (Super Orders). Super orders may contain multiple product listings bundled together and may generate higher reward multipliers.
                                        5.2 Users may receive a 0.4% rebate for completing standard product maintenance tasks.
                                        5.3 Special package listings may generate rebates of up to 2.4% or higher, depending on the product campaign.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-primary-light mb-2 text-xs font-black">7. Deposits</h4>
                                    <p className="opacity-80">
                                        7.1 Users may determine their deposit amounts independently based on their financial capacity.
                                        7.2 When additional funds are required to complete a product package, the system will display the required balance difference.
                                        7.3 Before making any deposit, users should confirm the official wallet address through the platform’s Customer Support.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-primary-light mb-2 text-xs font-black">10. Referral Program</h4>
                                    <p className="opacity-80">
                                        10.1 Eligible users may invite new participants using a unique referral code.
                                        10.2 Referrers may receive up to 20% commission based on the task rewards generated by referred users.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                             <h4 className="text-xs font-black text-white italic tracking-widest uppercase">Acceptance of Terms</h4>
                             <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">
                                By creating an account or continuing to use the SmartBugMedia platform, you acknowledge that you have read and understood these Terms and Conditions, agree to comply with all platform rules and policies, and accept responsibility for your account activity and financial decisions.
                             </p>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="text-success" size={20} />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Compliance Verified by Neural Matrix</span>
                            </div>
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Last Updated: December 2026 • Build ID: NF-889-SYNC</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
