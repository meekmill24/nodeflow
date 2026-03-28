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
    { level: 'Junior Agent', deposit: 500, tasks: 40, sets: 1, color: 'from-[#3DD6C8] to-[#1a1a2e]' },
    { level: 'Intermediate Agent', deposit: 1500, tasks: 45, sets: 1, color: 'from-[#E34304] to-[#1a1a2e]' },
    { level: 'Senior Agent', deposit: 5000, tasks: 50, sets: 1, color: 'from-amber-400 to-orange-500' },
    { level: 'Master Agent', deposit: 15000, tasks: 55, sets: 1, color: 'from-rose-500 to-red-600' },
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
                                <span className="text-primary-light block">{v.sets} Max Sets</span>
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
                                Expand the NodeFlow. network. Direct referrals grant a perpetual yields optimization fee based on their productivity.
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
            <div className="glass-card-strong p-10 md:p-14 border border-white/5 space-y-10 bg-slate-900/40 backdrop-blur-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                    <div className="shrink-0 p-5 rounded-3xl bg-white/5 border border-white/10 text-white shadow-2xl">
                        <FileText size={40} strokeWidth={1} />
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-3">Terms of Engagement</h2>
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">NodeFlow. Institutional Protocol v4.2</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-[11px] font-bold text-white/50 leading-relaxed uppercase tracking-widest text-justify">
                            <div className="space-y-6">
                                <p>
                                    All agents engaging with the NodeFlow. matrix agree to the synchronized distribution protocols established within this governance document. By initializing a node, the agent acknowledges that task optimization requires high-fidelity verification and consistent nodal activity to maintain yield velocity.
                                </p>
                                <p>
                                    NodeFlow. serves as the premier successor to the legacy <span className="text-primary-light">Captiv8</span> and <span className="text-amber-500">Simple Money</span> frameworks. All previous architectural shards have been migrated to ensure superior liquidity matching and enhanced layer-2 security settlements.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <p>
                                    Assets deployed within the wealth calibration section are subject to real-time institutional auditing. NodeFlow. reserves the right to suspend any node exhibiting non-standard latency or synchronized malicious patterns that threaten the total network integrity.
                                </p>
                                <p>
                                    Settlement periods are optimized for daily extraction. However, larger wealth extraction requests may undergo multi-signature verification protocols to ensure the safety of the agent's digital vault and the broader ecosystem liquidity.
                                </p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="text-success" size={20} />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Compliance Verified by Neural Matrix</span>
                            </div>
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Last Updated: March 2026 • Build ID: NF-889-SYNC</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
