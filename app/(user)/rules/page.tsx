'use client';

import { 
    FileText, 
    ShieldCheck
} from 'lucide-react';

export default function RulesPage() {
    return (
        <div className="max-w-5xl mx-auto pb-20 animate-fade-in space-y-10">

            {/* Terms of Engagement Section */}
            <div className="glass-card-strong p-10 md:p-14 border border-white/5 space-y-12 bg-slate-900/40 backdrop-blur-3xl overflow-hidden relative rounded-[36px]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                    <div className="shrink-0 p-5 rounded-3xl bg-white/5 border border-white/10 text-white shadow-2xl">
                        <FileText size={40} strokeWidth={1} />
                    </div>
                    <div className="space-y-10 w-full">
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-3">User Agreement & Terms and Conditions</h2>
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
