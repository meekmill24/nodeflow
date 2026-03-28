'use client';

import { 
    Plus, 
    Minus, 
    HelpCircle, 
    CreditCard, 
    Smartphone, 
    Mail, 
    ShieldCheck, 
    Clock, 
    TrendingUp,
    ShieldAlert
} from 'lucide-react';
import { useState } from 'react';

const FAQS = [
    {
        category: 'Payments & Accounts',
        icon: CreditCard,
        qas: [
            {
                q: "What payment methods does SmartBugMedia support?",
                a: "SmartBugMedia currently supports Cryptocurrency (USDT / USDC), Bank Wire Transfer, and Bank Check. Transactions below 10,000 USDT are typically processed using cryptocurrency. Above 10,000 USDT, bank options become available."
            },
            {
                q: "How are bank checks issued and delivered?",
                a: "Bank checks may be issued through institutions like Chase, Citibank, Barclays, or BNP Paribas. Above 50,000 USDT: FedEx Overnight Delivery. 10,000 – 30,000 USDT: USPS Priority Mail. Next business day delivery is standard for high-volume transactions."
            },
            {
                q: "How long do bank transfers take?",
                a: "Bank wire transfers typically follow a 4–6 business day processing timeline, depending on local bank holidays, international banking compliance checks, and country-specific regulations."
            }
        ]
    },
    {
        category: 'Operations & Tasks',
        icon: TrendingUp,
        qas: [
            {
                q: "What are the platform operating hours?",
                a: "The SmartBugMedia platform operates daily from 09:00 AM – 09:00 PM for product maintenance tasks, withdrawal processing, and customer support."
            },
            {
                q: "How are promotional gift packages assigned?",
                a: "Gift packages are randomly allocated by the system based on account activity and task progress. Allocation ensures equal opportunity across the network, but negative balances must be cleared first."
            },
            {
                q: "How are user levels determined?",
                a: "User levels (Junior, Mid-Level, Senior, Mentor) are determined by the initial deposit amount and task volume. Each level offers progressive return rates and base salaries (up to 400 USDT for Mentor level)."
            }
        ]
    },
    {
        category: 'Security & Compliance',
        icon: ShieldCheck,
        qas: [
            {
                q: "How does account security work?",
                a: "SmartBugMedia mandates separate login and withdrawal passwords. Entering the wrong password three times will result in temporary suspension to prevent unauthorized access."
            },
            {
                q: "What are the tax reporting requirements?",
                a: "Users are responsible for domestic tax compliance. In the US, cash payments exceeding $10,000 may require IRS Form 8300 reporting. SmartBugMedia provides transaction records to assist users in fulfilling these obligations."
            },
            {
                q: "Are international wire transfers secure?",
                a: "Yes. All transfers pass through regulated financial institutions and are monitored by the U.S. Treasury (OFAC) to ensure security and prevent fraudulent activities."
            }
        ]
    }
];

export default function FAQPage() {
    const [openIdx, setOpenIdx] = useState<string | null>("cat-0-qa-0");

    const toggle = (id: string) => {
        setOpenIdx(openIdx === id ? null : id);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in space-y-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Support <span className="text-primary-light">Matrix</span></h1>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Integrated Intelligence & Frequently Asked Questions</p>
                </div>
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-4">
                    <ShieldCheck size={24} className="text-primary-light" />
                    <div>
                        <p className="text-[9px] font-black text-white uppercase tracking-widest leading-none mb-1">Status: Operational</p>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Security Protocols Active</p>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-10">
                {FAQS.map((cat, ci) => (
                    <div key={ci} className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <cat.icon size={20} className="text-white/60" />
                            </div>
                            <h2 className="text-lg font-black text-white uppercase tracking-tight italic">{cat.category}</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {cat.qas.map((qa, qi) => {
                                const id = `cat-${ci}-qa-${qi}`;
                                const isOpen = openIdx === id;
                                return (
                                    <div 
                                        key={qi} 
                                        className={`glass-card transition-all duration-300 ${isOpen ? 'border-primary/40 bg-white/[0.03]' : 'border-white/5 hover:border-white/10'}`}
                                    >
                                        <button 
                                            onClick={() => toggle(id)}
                                            className="w-full p-6 flex items-center justify-between text-left"
                                        >
                                            <span className="text-xs font-black text-white uppercase tracking-widest leading-relaxed pr-8">{qa.q}</span>
                                            <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isOpen ? 'bg-primary text-white' : 'bg-white/5 text-white/40'}`}>
                                                {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                                            </div>
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="p-6 pt-0 border-t border-white/5">
                                                <p className="text-[11px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">
                                                    {qa.a}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Support Callout */}
            <div className="glass-card-strong p-10 border-white/5 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Smartphone size={32} className="text-accent-light" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Need Neural Assistance?</h3>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
                    Our technical support agents are available 12 hours a day to assist with nodal activations and wealth extraction.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <button className="px-8 py-3.5 bg-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:brightness-110">
                        Live Web Support
                    </button>
                    <button className="px-8 py-3.5 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10">
                        Telegram Matrix
                    </button>
                </div>
            </div>

        </div>
    );
}
