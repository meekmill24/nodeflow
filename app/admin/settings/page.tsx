'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  DollarSign, 
  UserPlus, 
  CreditCard, 
  Palette,
  Layout,
  Share2,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Target,
  Gift,
  Mail,
  Sparkles,
  Brush,
  Eye,
  RotateCcw,
  Clock,
  Power,
  AlertTriangle,
  FileText,
  ExternalLink,
  FileCheck2,
  Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { checkWorkingHours } from '@/lib/workingHours';

const THEME_PRESETS = [
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan',
    primary: '#3DD6C8',
    accent: '#E34304',
    background: '#0B0B1E',
    surface: 'rgba(15, 23, 42, 0.6)',
    desc: 'Default Neon Cyan with Radiant Ember Accent'
  },
  {
    id: 'electric-violet',
    name: 'Electric Violet',
    primary: '#8B5CF6',
    accent: '#EC4899',
    background: '#0E0720',
    surface: 'rgba(24, 12, 46, 0.6)',
    desc: 'Deep Cosmic Purple with Laser Pink Highlights'
  },
  {
    id: 'apex-emerald',
    name: 'Apex Emerald',
    primary: '#10B981',
    accent: '#F59E0B',
    background: '#051811',
    surface: 'rgba(6, 32, 22, 0.6)',
    desc: 'Fintech Emerald with Bullion Gold Tones'
  },
  {
    id: 'solar-crimson',
    name: 'Solar Crimson',
    primary: '#F59E0B',
    accent: '#EF4444',
    background: '#160E04',
    surface: 'rgba(34, 20, 6, 0.6)',
    desc: 'Warm Radiant Amber with Laser Red Flare'
  },
  {
    id: 'abyss-azure',
    name: 'Abyss Azure',
    primary: '#0EA5E9',
    accent: '#6366F1',
    background: '#041122',
    surface: 'rgba(8, 28, 54, 0.6)',
    desc: 'Deep Marine Azure with Futuristic Indigo'
  }
];

const DOC_TEMPLATES = {
  terms: {
    id: 'terms' as const,
    label: 'Terms & Conditions',
    href: '/rules',
    badge: 'Legal',
    color: 'text-teal-400',
    borderColor: 'border-teal-400/30',
    activeBg: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    titleKey: 'terms_conditions_title',
    subtitleKey: 'terms_conditions_subtitle',
    contentKey: 'terms_conditions_content',
    defaultTitle: 'User Agreement & Terms and Conditions',
    defaultSubtitle: 'SmartBugMedia. Institutional Protocol v4.5',
    defaultContent: `1. Product Listing Maintenance Tasks
1.1 Users must maintain a minimum account balance of 100 USDT in order to begin a new cycle of product maintenance tasks.
1.2 Initiating a new product maintenance cycle will reset the task counter and requires the minimum balance to be available in the account.
1.3 After completing a full set of product maintenance tasks, users may choose to withdraw available balances or continue completing 3–6 task cycles to increase accumulated earnings.

2. User Levels and Account Status
2.1 SmartBugMedia maintains a tiered user system based on account activity and balance. Users may apply for level upgrades through Customer Support.
2.2 After resetting an account cycle, users must complete the assigned product maintenance tasks before initiating withdrawal.
2.3 Withdrawal requests require the user account credit score to remain at 100%.

3. Financial Security
3.1 All user funds are securely stored within the platform account system.
3.2 Once all assigned product maintenance tasks are completed, users may request withdrawal of their available funds.
3.3 The platform utilizes automated systems to process operational data and minimize human error.

4. Account Security & Verification
4.1 Users must safeguard their login and withdrawal passphrases. Platform personnel will never ask for private security keys.
4.2 Multi-factor security protocols and SSL encryption are enforced across all transactional layers.
4.3 Suspicious activity may result in temporary node calibration freeze until identity is re-verified.

5. Product Packages and Platform Rewards
5.1 Platform tasks may include Standard Product Listings and Special Product Packages (Super Orders). Super orders contain multiple product listings bundled together and generate substantial reward multipliers.
5.2 Users receive their tier standard rebate (e.g. 0.4%–0.6%) for completing standard product maintenance tasks.
5.3 Special package listings (Super Orders) generate rebates between 6x and 50x the standard task rate for all levels (e.g., 2.4% minimum up to 20.0%–30.0% maximum depending on user tier).

6. Deposits & Withdrawals
6.1 Users may determine their deposit amounts independently based on their financial capacity.
6.2 When additional funds are required to complete a product package, the system will display the required balance difference.
6.3 Before making any deposit, users should confirm the official wallet address through the platform’s Customer Support.
6.4 Withdrawal requests are processed 24/7 following verification of set completion and account standing.`
  },
  compliance: {
    id: 'compliance' as const,
    label: 'Security Compliance',
    href: '/compliance',
    badge: 'SSL',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-400/30',
    activeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    titleKey: 'security_compliance_title',
    subtitleKey: 'security_compliance_subtitle',
    contentKey: 'security_compliance_content',
    defaultTitle: 'Simple Worker Security Compliance',
    defaultSubtitle: 'SmartBug Media Compliance Directive',
    defaultContent: `Core Golden Rule:
Protect the account. Protect the device. Protect the client’s data. Verify unusual requests. Report security problems immediately to our customer support on the platform.

01. Protect your login
Use a strong, unique password and enable MFA/2FA wherever available across your assigned portals.

02. Never share passwords
Do not send passwords, verification codes, recovery codes, or authentication links to anyone under any circumstances.

03. Protect client data
Client names, emails, CRM records, campaign data, reports, credentials, and customer information must be treated as strictly confidential.

04. Use approved systems
Store and share company/client information only through approved company tools and accounts, not personal email, drives, or unauthorized apps.

05. Check access before sharing
Make sure only authorized employees, clients, or contractors can access files, HubSpot records, advertising accounts, and reports.

06. Watch for phishing
Verify unusual emails, login requests, payment instructions, password-reset messages, and requests to change banking or wallet information.

07. Secure your device
Keep your computer updated, use screen locking, approved security software, and avoid leaving work devices unattended in public spaces.

08. Follow privacy rules
Only collect, access, download, or use customer information strictly needed for your active assigned tasks.

09. Report incidents immediately
Report suspicious logins, phishing attempts, lost devices, accidental data sharing, malware, or unauthorized access through customer support.

10. When unsure, don’t share
Verify the request with your assigned manager, mentor, or authorized client contact before releasing sensitive information.`
  },
  protocol: {
    id: 'protocol' as const,
    label: 'Operating Protocol',
    href: '/protocol',
    badge: 'Rules',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-400/30',
    activeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    titleKey: 'operating_protocol_title',
    subtitleKey: 'operating_protocol_subtitle',
    contentKey: 'operating_protocol_content',
    defaultTitle: 'Simple Worker Operating Protocol',
    defaultSubtitle: 'Standard Operating Procedure',
    defaultContent: `Key Principle:
Do your assigned work, protect your information, check your work before publishing, and communicate immediately when something goes wrong.

Workflow Steps:
Check -> Work -> Protect -> Review -> Approve -> Deliver -> Update

01. Log in securely
Use your own approved account, a strong password, and MFA. Never share your password or verification codes with anyone.

02. Check your assigned work
Make sure you understand the client, task, deadline, and expected result before starting.

03. Use approved tools only
Work only through the company’s approved platforms, including this platform, CRM systems, project management tools, marketing tools, and communication systems.

04. Protect client information
Never send client lists, passwords, campaign data, CRM records, or confidential documents to unauthorized individuals.

05. Follow instructions and scope
Do not make major changes to campaigns, websites, CRM systems, budgets, or client data without authorization from the platform’s customer service team.

06. Check your work
Before submitting or publishing anything, verify spelling, links, data, audience, tracking information, attachments, and details through our customer support.

07. Get approval when required
Do not publish content or make significant client-facing changes until approval has been received from the appropriate supervisor or mentor.

08. Communicate problems early
If you are delayed, confused, blocked, or notice an error, inform your manager, mentor, or support team immediately rather than hiding the issue.

09. Watch for scams
Be cautious of unexpected password requests, payment requests from third parties unlike your mentor or customer support, or suspicious links. We accept only digital currencies. Always contact your mentor or our customer service team for assistance with account upgrades.

10. Report security problems immediately
If you click a suspicious link aside our platform link, lose a device, expose confidential information, or notice unauthorized access, report the incident immediately through SmartBug’s customer support on the platform.

11. Close your work properly
Update task or project status, save files in the correct location, record any outstanding actions, and secure your device when you finish working.`
  },
  privacy: {
    id: 'privacy' as const,
    label: 'Privacy Policy',
    href: '/privacy',
    badge: 'Encrypted',
    color: 'text-orange-400',
    borderColor: 'border-orange-400/30',
    activeBg: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    titleKey: 'privacy_policy_title',
    subtitleKey: 'privacy_policy_subtitle',
    contentKey: 'privacy_policy_content',
    defaultTitle: 'Privacy Protocol',
    defaultSubtitle: 'Data Sovereignty Protocols Active',
    defaultContent: `Core Privacy Values:
- Data Security: Enterprise-grade encryption across all nodal activity and wealth calibration cycles.
- Neural Masking: Anonymized processing of user records through decentralized blockchain protocols.
- Zero Extraction: No personal data is sold or exported to third-party commercial matrixes.

1. Eligibility & Acceptance
By using the SmartBugMedia platform, you confirm you are at least 18 years of age, have the legal capacity to enter into binding agreements, and agree to comply with all platform policies and applicable laws.

2. Personal Information Protection
SmartBugMedia is committed to protecting user privacy. We collect limited personal information necessary to operate our services, including account registration details, contact info, transaction records, and platform activity data. This data is used strictly for account management, transaction verification, platform security, and customer support.

3. Security & Compliance
SmartBugMedia uses secure digital infrastructure and blockchain-supported transaction systems (USDT, Ethereum, TRC Network) to provide transparent and traceable financial operations. Blockchain technology provides tamper-resistant transaction verification and secure global payment infrastructure.

4. Reporting Improper Behavior
SmartBugMedia maintains strict operational integrity standards. Employees or contractors associated with the platform are not permitted to engage in unauthorized activities. If users identify suspicious behavior or misuse of the SmartBugMedia brand, they may report the incident by submitting written descriptions and screenshots to the official support channel.

5. Fund Management & Security
SmartBugMedia implements automated transaction monitoring and financial processing systems. Users are responsible for ensuring the accuracy of wallet addresses and verifying transaction details before submitting payments. Transactions sent to incorrect addresses cannot always be reversed due to blockchain design.

6. Institutional Tax Compliance
Users are responsible for complying with tax regulations in their respective jurisdictions. Individuals receiving significant financial income may be required to report earnings and maintain financial records.`
  },
  faq: {
    id: 'faq' as const,
    label: 'FAQ & Support',
    href: '/faq',
    badge: 'Support',
    color: 'text-blue-400',
    borderColor: 'border-blue-400/30',
    activeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    titleKey: 'faq_title',
    subtitleKey: 'faq_subtitle',
    contentKey: 'faq_content',
    defaultTitle: 'Support Matrix',
    defaultSubtitle: 'Integrated Intelligence & Frequently Asked Questions',
    defaultContent: `[Category: Payments & Accounts]
Q: What payment methods does SmartBugMedia support?
A: SmartBugMedia currently supports Cryptocurrency (USDT / USDC), Bank Wire Transfer, and Bank Check. Transactions below 10,000 USDT are typically processed using cryptocurrency. Above 10,000 USDT, bank options become available.

Q: How are bank checks issued and delivered?
A: Bank checks may be issued through institutions like Chase, Citibank, Barclays, or BNP Paribas. Above 50,000 USDT: FedEx Overnight Delivery. 10,000 – 30,000 USDT: USPS Priority Mail. Next business day delivery is standard for high-volume transactions.

Q: How long do bank transfers take?
A: Bank wire transfers typically follow a 4–6 business day processing timeline, depending on local bank holidays, international banking compliance checks, and country-specific regulations.

[Category: Operations & Tasks]
Q: What are the platform operating hours?
A: The SmartBugMedia platform operates daily from 09:00 AM – 09:00 PM Central Time (CT) for product maintenance tasks, withdrawal processing, and customer support. System maintenance runs daily from 02:00 – 04:00 AM Central Time (CT).

Q: How are promotional gift packages assigned?
A: Gift packages are randomly allocated by the system based on account activity and task progress. Allocation ensures equal opportunity across the network, but negative balances must be cleared first.

Q: How are user levels determined?
A: User levels (Junior, Intermediate, Senior, Mentor) are determined by the initial deposit amount and task volume. Each level offers progressive return rates and base salaries (up to 400 USDT for Mentor level).

[Category: Security & Compliance]
Q: How does account security work?
A: SmartBugMedia mandates separate login and withdrawal passwords. Entering the wrong password three times will result in temporary suspension to prevent unauthorized access.

Q: What are the tax reporting requirements?
A: Users are responsible for domestic tax compliance. In the US, cash payments exceeding $10,000 may require IRS Form 8300 reporting. SmartBugMedia provides transaction records to assist users in fulfilling these obligations.

Q: Are international wire transfers secure?
A: Yes. All transfers pass through regulated financial institutions and are monitored by the U.S. Treasury (OFAC) to ensure security and prevent fraudulent activities.`
  },
  salary: {
    id: 'salary' as const,
    label: 'Salary Structure',
    href: '/salary',
    badge: 'Payroll',
    color: 'text-amber-400',
    borderColor: 'border-amber-400/30',
    activeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    titleKey: 'salary_structure_title',
    subtitleKey: 'salary_structure_subtitle',
    contentKey: 'salary_structure_content',
    defaultTitle: 'Salary Structure',
    defaultSubtitle: 'Monthly Compensation Model',
    defaultContent: `Important Notes:
- Minimum salary is $6,700 for 30 consecutive days of work.
- Salary increases with higher employee grades (VIP Levels).
- Pay periods available every 2, 4, 7, 15, and 30 days.
- Official working hours: US Central Time 10:00 AM – 7:00 PM (11:00 AM – 8:00 PM Eastern Time), Monday to Sunday.
- Daily operational commitment: ~30 to 60 minutes to complete designated task sets during working hours.
- Missed or interrupted workdays will reset the daily cycle accrual.

Compliance & Working Schedule:
- Working Hours Window: 10:00 AM – 7:00 PM CT (11:00 AM – 8:00 PM ET) • 7 Days a Week (Mon–Sun). Payouts and claims are validated in real-time by customer support.
- Claim Window: Claims must be processed after all daily task sets are finalized. Manual verification may be required for high-tier claims.
- Audited By: TLS 1.3 Verified Hub with automated compliance tracking.`
  }
};

const DEFAULT_SALARY_DATA = [
  { level: 1, name: 'Junior', rewards: [100, 300, 800, 1500, 4000], total: 6700 },
  { level: 2, name: 'Intermediate', rewards: [200, 500, 1500, 3000, 6000], total: 11200 },
  { level: 3, name: 'Senior', rewards: [300, 700, 2500, 5000, 10000], total: 18000 },
  { level: 4, name: 'Mentor', rewards: [400, 900, 3500, 6000, 12000], total: 22800 },
];

const SALARY_DAYS = [2, 4, 7, 15, 30];

type DocTabKey = 'terms' | 'compliance' | 'protocol' | 'privacy' | 'faq' | 'salary';

interface SiteSetting {
  id: string;
  key: string;
  value: any;
  description: string | null;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [provisioningKeys, setProvisioningKeys] = useState<Record<string, boolean>>({});
  const [activeDocTab, setActiveDocTab] = useState<DocTabKey>('terms');
  const [savingDoc, setSavingDoc] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/site-settings');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch settings');
      setSettings(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (key: string, value: any) => {
    setSettings(prev => {
      const exists = prev.some(s => s.key === key);
      let updated = exists 
        ? prev.map(s => s.key === key ? { ...s, value } : s)
        : [...prev, { id: key, key, value, description: null }];

      if (key === 'referral_commission_l1') {
        const hasTaskPct = updated.some(s => s.key === 'referral_task_percentage');
        updated = hasTaskPct
          ? updated.map(s => s.key === 'referral_task_percentage' ? { ...s, value } : s)
          : [...updated, { id: 'referral_task_percentage', key: 'referral_task_percentage', value, description: 'Task Referral %' }];
      }

      return updated;
    });
    setSuccess(false);
  };

  const handleSave = async (updatedSettings = settings) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updatedSettings })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');
      
      setSuccess(true);
      toast.success('System Protocols Synchronized');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmailMatrix = async () => {
    setSavingEmail(true);
    try {
      const emailKeys = ['support_email', 'admin_notification_email', 'resend_from_email'];
      const emailSettings = emailKeys.map(key => ({
        key,
        value: settings.find(s => s.key === key)?.value || ''
      }));
      const res = await fetch('/api/admin/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: emailSettings })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save email matrix');
      toast.success('Email Matrix Saved! Live on user portal (/service, /concierge, footer).');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save email settings');
    } finally {
      setSavingEmail(false);
    }
  };

  const handleLoadDefaultDoc = (docKey: DocTabKey) => {
    const doc = DOC_TEMPLATES[docKey];
    handleUpdate(doc.titleKey, doc.defaultTitle);
    handleUpdate(doc.subtitleKey, doc.defaultSubtitle);
    handleUpdate(doc.contentKey, doc.defaultContent);
    if (docKey === 'salary') {
      handleUpdate('salary_working_hours_badge', '10:00 AM – 7:00 PM CT');
      handleUpdate('salary_tiers_data', JSON.stringify(DEFAULT_SALARY_DATA));
    }
    toast.success(`Loaded default template for ${doc.label}`);
  };

  const handleResetDoc = (docKey: DocTabKey) => {
    const doc = DOC_TEMPLATES[docKey];
    handleUpdate(doc.titleKey, '');
    handleUpdate(doc.subtitleKey, '');
    handleUpdate(doc.contentKey, '');
    if (docKey === 'salary') {
      handleUpdate('salary_working_hours_badge', '');
      handleUpdate('salary_tiers_data', '');
    }
    toast.success(`Reset ${doc.label} to system defaults`);
  };

  const handleSaveDoc = async (docKey: DocTabKey) => {
    const doc = DOC_TEMPLATES[docKey];
    setSavingDoc(true);
    try {
      const keysToSave = [doc.titleKey, doc.subtitleKey, doc.contentKey];
      if (docKey === 'salary') {
        keysToSave.push('salary_working_hours_badge', 'salary_tiers_data');
      }
      const payload = keysToSave.map(k => ({
        key: k,
        value: settings.find(s => s.key === k)?.value ?? ''
      }));

      const res = await fetch('/api/admin/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save document');
      toast.success(`${doc.label} committed and live on user side!`);
      fetchSettings();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingDoc(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#3DD6C8]" size={32} />
      </div>
    );
  }

  return ( 
    <div className="space-y-12 animate-in fade-in duration-700 pb-24"> 
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-10"> 
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-[#3DD6C8] rounded-full animate-ping" />
             <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent">System Parameters</h1> 
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Global site controls and financial calibration protocols.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
            <button 
              type="button"
              onClick={() => {
                const el = document.getElementById('quick-hub-documents');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 px-6 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <FileText size={18} />
              <span>QUICK HUB POLICIES</span>
            </button>
            <button 
              onClick={() => handleSave()} 
              disabled={saving} 
              className={`
                flex items-center gap-4 px-10 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-500
                ${success ? 'bg-emerald-500 text-white shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'bg-white text-black hover:bg-[#3DD6C8] hover:text-white shadow-2xl'}
                ${saving ? 'opacity-50 cursor-wait' : 'hover:scale-105 active:scale-95'}
              `}
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : success ? <CheckCircle2 size={20} /> : <Save size={20} />}
              {success ? 'PROTOCOLS UPDATED' : 'COMMIT CONFIGURATION'}
            </button> 
        </div>
      </div> 

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8"> 
        {/* PILLAR 1: OPERATIONAL CORE */}
        <div className="space-y-8">
          <section className="bg-slate-900/40 border border-white/5 p-10 rounded-[48px] backdrop-blur-xl relative overflow-hidden group hover:border-[#3DD6C8]/20 transition-all duration-700">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#3DD6C8]/5 blur-[80px] rounded-full group-hover:bg-[#3DD6C8]/10 transition-colors" />
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 ring-1 ring-blue-500/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Operational Core</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Live Kill-Switches</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'maintenance_mode', label: 'Maintenance Mode', desc: 'Lock the site for all users', icon: ShieldCheck, color: 'text-rose-400' },
                { key: 'new_registrations_enabled', label: 'Registrations', desc: 'Allow new user discovery', icon: UserPlus, color: 'text-[#3DD6C8]' },
                { key: 'deposits_enabled', label: 'Top-Up Nodes', desc: 'Enable financial influx', icon: CreditCard, color: 'text-emerald-400' },
                { key: 'withdrawals_enabled', label: 'Payout Nodes', desc: 'Enable wealth extraction', icon: DollarSign, color: 'text-amber-400' },
              ].map((cfg) => {
                const item = settings.find(s => s.key === cfg.key);
                if (!item) return null;
                const isActive = item.value === 'true' || item.value === true;
                return (
                  <div key={cfg.key} className="flex items-center justify-between p-5 bg-black/40 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex gap-4">
                      <div className={`p-2.5 rounded-xl h-fit bg-white/5 ${isActive ? cfg.color : 'text-slate-700 opacity-40'}`}>
                        <cfg.icon size={18} />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white uppercase tracking-wider">{cfg.label}</div>
                        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-tight mt-0.5">{cfg.desc}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleUpdate(cfg.key, !isActive)}
                      className={`
                        w-14 h-7 rounded-full relative transition-all duration-500
                        ${isActive ? 'bg-[#3DD6C8]' : 'bg-slate-800'}
                      `}
                    >
                      <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all duration-500 ${isActive ? 'left-8 shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'left-1.5 opacity-40'}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* PILLAR 1B: OPERATIONAL WORKING HOURS & TASK DESK GATE */}
          <section className="bg-slate-900/40 border border-white/5 p-10 rounded-[48px] backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/20 transition-all duration-700">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/5 blur-[80px] rounded-full group-hover:bg-amber-500/10 transition-colors" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 ring-1 ring-amber-500/20">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Working Hours Gate</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Task Dispatch Schedule & CS</p>
                </div>
              </div>

              {/* Live Status Pill */}
              {(() => {
                const whConfig = {
                  working_hours_enabled: settings.find(s => s.key === 'working_hours_enabled')?.value ?? 'true',
                  working_hours_start: settings.find(s => s.key === 'working_hours_start')?.value ?? '10:00',
                  working_hours_end: settings.find(s => s.key === 'working_hours_end')?.value ?? '22:00',
                  working_hours_timezone: settings.find(s => s.key === 'working_hours_timezone')?.value ?? 'UTC',
                  working_hours_status: settings.find(s => s.key === 'working_hours_status')?.value ?? 'auto',
                  working_hours_notice: settings.find(s => s.key === 'working_hours_notice')?.value ?? ''
                };
                const liveWH = checkWorkingHours(whConfig);
                return (
                  <div className={`px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-2 border w-fit ${
                    liveWH.isOpen 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${liveWH.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    <span>{liveWH.isOpen ? 'DESK OPEN' : 'DESK CLOSED'}</span>
                  </div>
                );
              })()}
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-[11px] text-slate-400 leading-relaxed font-medium mb-6">
              When the operational desk is closed, <strong>users are blocked from performing tasks</strong>. Deposits, withdrawals, and wallet records remain accessible 24/7.
            </div>

            <div className="space-y-5">
              {/* Master Enforce Toggle */}
              {(() => {
                const isEnabled = (settings.find(s => s.key === 'working_hours_enabled')?.value === 'true' || settings.find(s => s.key === 'working_hours_enabled')?.value === true);
                return (
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                    <div>
                      <div className="text-[11px] font-black text-white uppercase tracking-wider">Enforce Working Hours</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tight mt-0.5">Restrict tasks outside active shift</div>
                    </div>
                    <button 
                      onClick={() => handleUpdate('working_hours_enabled', !isEnabled)}
                      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isEnabled ? 'bg-[#3DD6C8]' : 'bg-slate-800'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isEnabled ? 'left-7' : 'left-1 opacity-40'}`} />
                    </button>
                  </div>
                );
              })()}

              {/* Status Mode (Auto / Force Open / Force Closed) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Operational Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'auto', label: 'Daily Schedule', desc: 'Auto Clock' },
                    { id: 'force_open', label: 'Force Open', desc: '24/7 Active' },
                    { id: 'force_closed', label: 'Force Closed', desc: 'CS Offline' },
                  ].map(mode => {
                    const currentStatus = settings.find(s => s.key === 'working_hours_status')?.value || 'auto';
                    const isSelected = currentStatus === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => handleUpdate('working_hours_status', mode.id)}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          isSelected 
                            ? 'bg-[#3DD6C8]/10 border-[#3DD6C8] text-[#3DD6C8]' 
                            : 'bg-black/40 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                        }`}
                      >
                        <div className="text-[10px] font-black uppercase tracking-wider truncate">{mode.label}</div>
                        <div className="text-[8px] font-bold opacity-60 uppercase tracking-tight truncate">{mode.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shift Hours (Start & End) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Opening Time</label>
                  <input
                    type="time"
                    className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#3DD6C8]"
                    value={settings.find(s => s.key === 'working_hours_start')?.value || '10:00'}
                    onChange={e => handleUpdate('working_hours_start', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Closing Time</label>
                  <input
                    type="time"
                    className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#3DD6C8]"
                    value={settings.find(s => s.key === 'working_hours_end')?.value || '22:00'}
                    onChange={e => handleUpdate('working_hours_end', e.target.value)}
                  />
                </div>
              </div>

              {/* Timezone Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Operating Timezone</label>
                <select
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#3DD6C8]"
                  value={settings.find(s => s.key === 'working_hours_timezone')?.value || 'UTC'}
                  onChange={e => handleUpdate('working_hours_timezone', e.target.value)}
                >
                  <option value="UTC">UTC (Universal Coordinated Time)</option>
                  <option value="America/New_York">America/New_York (EST/EDT)</option>
                  <option value="America/Chicago">America/Chicago (CST/CDT)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST +4)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT +8)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST +9)</option>
                  <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
                </select>
              </div>

              {/* Closed Notice for Users */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Off-Hours Notice Message</label>
                <textarea
                  rows={2}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-white text-xs leading-relaxed focus:outline-none focus:border-[#3DD6C8] resize-none"
                  value={settings.find(s => s.key === 'working_hours_notice')?.value || ''}
                  placeholder="The optimization network is currently closed outside operational working hours. Deposits and withdrawals remain accessible 24/7."
                  onChange={e => handleUpdate('working_hours_notice', e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="bg-slate-900/40 border border-white/5 p-10 rounded-[48px] backdrop-blur-xl group hover:border-indigo-500/20 transition-all">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 ring-1 ring-indigo-500/20">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Internalization</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Matrix Language</p>
              </div>
            </div>
            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Default Platform Language</label>
                    <select 
                      className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#3DD6C8]/20 transition-all font-black uppercase tracking-widest text-[10px] appearance-none cursor-pointer"
                      value={settings.find(s => s.key === 'default_language')?.value || 'English'}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        const updated = settings.some(s => s.key === 'default_language')
                          ? settings.map(s => s.key === 'default_language' ? { ...s, value: newValue } : s)
                          : [...settings, { id: 'default_language', key: 'default_language', value: newValue, description: 'Default site language' }];
                        setSettings(updated);
                        handleSave(updated);
                      }}
                    >
                      <option value="English">English (US)</option>
                      <option value="Spanish">Español (Spanish)</option>
                      <option value="French">Français (French)</option>
                      <option value="German">Deutsch (German)</option>
                      <option value="Portuguese">Português (Portuguese)</option>
                      <option value="Russian">Русский (Russian)</option>
                      <option value="Chinese">中文 (Chinese)</option>
                      <option value="Japanese">日本語 (Japanese)</option>
                      <option value="Arabic">العربية (Arabic)</option>
                      <option value="Turkish">Türkçe (Turkish)</option>
                      <option value="Hindi">हिन्दी (Hindi)</option>
                      <option value="Vietnamese">Tiếng Việt (Vietnamese)</option>
                    </select>
                </div>
            </div>
          </section>

          {/* EMAIL & COMMUNICATION SECTION */}
          <section className="bg-slate-900/40 border border-white/5 p-10 rounded-[48px] backdrop-blur-xl group hover:border-violet-500/20 transition-all">
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-500/10 rounded-2xl text-violet-400 ring-1 ring-violet-500/20">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Email Matrix</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Support & Operations Dispatch</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveEmailMatrix}
                disabled={savingEmail}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-[11px] uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-violet-600/30 ring-1 ring-white/10"
              >
                {savingEmail ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                Save Email Matrix
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">1. Primary Member Support Email (Live on User Portal)</label>
                <input 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all" 
                  value={settings.find(s => s.key === 'support_email')?.value || ''} 
                  onChange={(e) => handleUpdate('support_email', e.target.value)} 
                  placeholder="support@smartbugmedia.io" 
                />
                <p className="text-[9px] text-slate-500 font-bold ml-1">Reflects dynamically in Customer Service (/service), Concierge Hub (/concierge), and Footer.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">2. Admin Alert Email (Second Email)</label>
                <input 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all" 
                  value={settings.find(s => s.key === 'admin_notification_email')?.value || ''} 
                  onChange={(e) => handleUpdate('admin_notification_email', e.target.value)} 
                  placeholder="operations@smartbugmedia.io" 
                />
                <p className="text-[9px] text-slate-600 font-bold ml-1">Receives automated notifications for deposit slips & withdrawals.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">3. Resend Dispatch Sender</label>
                <input 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-violet-300 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all" 
                  value={settings.find(s => s.key === 'resend_from_email')?.value || ''} 
                  onChange={(e) => handleUpdate('resend_from_email', e.target.value)} 
                  placeholder="SmartBugMedia <notifications@smartbugmedia.io>" 
                />
              </div>

              <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Realtime Supabase Sync: User portal updates immediately on save</span>
                </div>
                <button
                  type="button"
                  onClick={handleSaveEmailMatrix}
                  disabled={savingEmail}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600/80 hover:bg-violet-600 text-white font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {savingEmail ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  Save Email Settings
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* PILLAR 2: FINANCIAL MATRIX */}
        <div className="xl:col-span-2 space-y-8">
           <section className="bg-slate-900/40 border border-white/5 p-10 rounded-[48px] backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-700">
             <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
             <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 ring-1 ring-emerald-500/20">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Wealth Calibration</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Commissions & Minimums</p>
                    </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { key: 'min_deposit', label: 'Minimum Influx', icon: ArrowDownLeft, suffix: 'USD', placeholder: '10' },
                    { key: 'min_withdrawal', label: 'Minimum Extraction', icon: ArrowUpRight, suffix: 'USD', placeholder: '10' },
                    { key: 'min_task_balance', label: 'Minimum Task Balance', icon: Wallet, suffix: 'USD', placeholder: '60' },
                    { key: 'referral_commission_l1', label: 'L1 Growth Yield', icon: Share2, suffix: '%', placeholder: '20' },
                    { key: 'referral_commission_l2', label: 'L2 Growth Yield', icon: Share2, suffix: '%', placeholder: '8' },
                    { key: 'referral_commission_l3', label: 'L3 Growth Yield', icon: Share2, suffix: '%', placeholder: '4' },
                    { key: 'signup_bonus', label: 'Referral Signup Bonus', icon: UserPlus, suffix: 'USD', placeholder: '2' },
                    { key: 'welcome_bonus', label: 'First User Signup Bonus', icon: Wallet, suffix: 'USD', placeholder: '25' },
                    { key: 'reward_tier_1', label: 'Reward Tier 1 (Req/Bonus)', icon: Gift, suffix: 'USD', placeholder: '100/10' },
                    { key: 'reward_tier_2', label: 'Reward Tier 2 (Req/Bonus)', icon: Gift, suffix: 'USD', placeholder: '500/100' },
                    { key: 'reward_tier_3', label: 'Reward Tier 3 (Req/Bonus)', icon: Gift, suffix: 'USD', placeholder: '1000/200' },
                    { key: 'reward_tier_4', label: 'Reward Tier 4 (Req/Bonus)', icon: Gift, suffix: 'USD', placeholder: '3000/600' },
                    { key: 'reward_tier_5', label: 'Reward Tier 5 (Req/Bonus)', icon: Gift, suffix: 'USD', placeholder: '5000/1000' },
                    { key: 'reward_tier_6', label: 'Reward Tier 6 (Req/Bonus)', icon: Gift, suffix: 'USD', placeholder: '10000/5000' },
                    { key: 'require_task_completion_to_withdraw', label: 'Require Set Completion for Payout', icon: Lock, suffix: 'BOOL', placeholder: 'true' },
                ].map((cfg) => {
                    const item = settings.find(s => s.key === cfg.key);
                    return (
                        <div key={cfg.key} className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{cfg.label}</label>
                            <div className="relative group/input">
                                <input 
                                    className="w-full bg-black/40 border border-white/5 rounded-[24px] px-6 py-5 text-white font-black italic text-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
                                    value={item?.value || ''}
                                    onChange={(e) => handleUpdate(cfg.key, e.target.value)}
                                    placeholder={cfg.placeholder}
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 text-[10px] font-black group-focus-within/input:text-emerald-500 transition-colors">{cfg.suffix}</span>
                            </div>
                        </div>
                    );
                })}

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Default Protocol Currency</label>
                    <select 
                      className="w-full bg-black/40 border border-white/5 rounded-[24px] px-6 py-[1.125rem] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-black uppercase tracking-widest text-[10px] appearance-none cursor-pointer"
                      value={settings.find(s => s.key === 'default_currency')?.value || 'USD'}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        const updated = settings.map(s => s.key === 'default_currency' ? { ...s, value: newValue } : s);
                        setSettings(updated);
                        handleSave(updated);
                      }}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="CHF">CHF (Fr)</option>
                      <option value="AUD">AUD (A$)</option>
                      <option value="SGD">SGD (S$)</option>
                      <option value="AED">AED (Dh)</option>
                      <option value="ZAR">ZAR (R)</option>
                      <option value="BRL">BRL (R$)</option>
                      <option value="GHC">GHC (GH₵)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="CNY">CNY (¥)</option>
                      <option value="KRW">KRW (₩)</option>
                      <option value="HKD">HKD (HK$)</option>
                      <option value="NZD">NZD (NZ$)</option>
                      <option value="MXN">MXN ($)</option>
                      <option value="RUB">RUB (₽)</option>
                      <option value="SAR">SAR (SR)</option>
                      <option value="TRY">TRY (₺)</option>
                      <option value="IDR">IDR (Rp)</option>
                      <option value="MYR">MYR (RM)</option>
                      <option value="THB">THB (฿)</option>
                      <option value="PHP">PHP (₱)</option>
                      <option value="VND">VND (₫)</option>
                      <option value="BTC">BTC (₿)</option>
                      <option value="ETH">ETH (Ξ)</option>
                      <option value="USDC">USDC (USDC)</option>
                      <option value="BNB">BNB (BNB)</option>
                      <option value="PAYPALUSD">PYUSD (PayPal USD)</option>
                    </select>
                </div>
             </div>

             <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                {[
                    { key: 'wallet_trc20', label: 'USDT (TRC20) RECEIVING NODE', icon: Wallet, placeholder: 'T...' },
                    { key: 'wallet_erc20', label: 'USDT (ERC20) NODE', icon: Palette, placeholder: '0x...' },
                    { key: 'wallet_bep20', label: 'USDT (BEP20) NODE', icon: ShieldCheck, placeholder: '0x...' },
                    { key: 'wallet_eth', label: 'ETHEREUM (ETH) RECEIVING NODE', icon: Wallet, placeholder: '0x...' },
                    { key: 'wallet_btc', label: 'BTC RECEIVING NODE', icon: Target, placeholder: '1... or 3... or bc1...' },
                    { key: 'wallet_usdc', label: 'USDC RECEIVING NODE', icon: Wallet, placeholder: '0x... or Solana address' },
                    { key: 'wallet_bnb', label: 'BNB CHAIN (BEP20) NODE', icon: ShieldCheck, placeholder: '0x...' },
                    { key: 'wallet_paypalusd', label: 'PAYPAL USD (PYUSD) NODE', icon: Wallet, placeholder: '0x...' },
                ].map((cfg) => {
                    const item = settings.find(s => s.key === cfg.key);
                    return (
                        <div key={cfg.key} className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{cfg.label}</label>
                            <input 
                                className="w-full bg-black/60 border border-white/5 rounded-[24px] px-6 py-4 text-slate-300 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border-dashed"
                                value={item?.value || ''}
                                onChange={(e) => handleUpdate(cfg.key, e.target.value)}
                                placeholder={cfg.placeholder}
                            />
                        </div>
                    );
                })}
             </div>
           </section>

           <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/40 border border-white/5 p-10 rounded-[48px] backdrop-blur-xl group hover:border-pink-500/20 transition-all">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-400 ring-1 ring-pink-500/20">
                            <Palette size={24} />
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Identity Shards</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Platform Headline</label>
                            <input className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-black uppercase tracking-widest text-sm" value={settings.find(s => s.key === 'site_name')?.value || ''} onChange={(e) => handleUpdate('site_name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">WhatsApp Endpoint (Number or Link)</label>
                            <input className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-emerald-400 font-bold" value={settings.find(s => s.key === 'whatsapp_url')?.value || ''} onChange={(e) => handleUpdate('whatsapp_url', e.target.value)} placeholder="e.g. 1234567890" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Telegram Pathway</label>
                            <input className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sky-400 font-bold" value={settings.find(s => s.key === 'telegram_url')?.value || ''} onChange={(e) => handleUpdate('telegram_url', e.target.value)} placeholder="e.g. https://t.me/smartbugmedia_ops" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Tawk.to Property ID</label>
                            <input className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-pink-400 font-bold font-mono text-[11px]" value={settings.find(s => s.key === 'tawkto_property_id')?.value || ''} onChange={(e) => handleUpdate('tawkto_property_id', e.target.value)} placeholder="Property ID" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Tawk.to Widget ID</label>
                            <input className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-pink-400 font-bold font-mono text-[11px]" value={settings.find(s => s.key === 'tawkto_widget_id')?.value || ''} onChange={(e) => handleUpdate('tawkto_widget_id', e.target.value)} placeholder="Widget ID" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-white/5 p-10 rounded-[48px] backdrop-blur-xl group hover:border-indigo-500/20 transition-all">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 ring-1 ring-indigo-500/20">
                            <Layout size={24} />
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Legal Nodes</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Entity Name</label>
                            <input className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold" value={settings.find(s => s.key === 'platform_name')?.value || ''} onChange={(e) => handleUpdate('platform_name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Entity HQ Address</label>
                            <textarea className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-slate-400 text-[10px] font-bold h-20 resize-none" value={settings.find(s => s.key === 'platform_address')?.value || ''} onChange={(e) => handleUpdate('platform_address', e.target.value)} />
                        </div>
                    </div>
                </div>
           </section>

           {/* PILLAR 2B: QUICK HUB POLICIES & LEGAL DOCUMENTS MATRIX */}
           <section id="quick-hub-documents" className="bg-slate-900/40 border border-white/5 p-8 md:p-10 rounded-[48px] backdrop-blur-xl relative overflow-hidden group hover:border-[#3DD6C8]/20 transition-all duration-700">
             <div className="absolute top-0 right-0 w-96 h-96 bg-[#3DD6C8]/5 blur-[120px] rounded-full pointer-events-none" />
             
             {/* Header */}
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-8 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-teal-500/10 rounded-2xl text-teal-400 ring-1 ring-teal-500/20 shadow-[0_0_20px_rgba(20,184,166,0.15)]">
                    <FileText size={26} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none flex items-center gap-3">
                      Quick Hub Document Matrix
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-teal-500/10 text-teal-300 border border-teal-500/30">Live Policies</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">
                      Configure user-facing legal, security, operational, and privacy directives.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={DOC_TEMPLATES[activeDocTab].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[10px] font-black uppercase tracking-wider border border-white/10 transition-all"
                  >
                    <span>View Live Page</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
             </div>

             {/* Document Switcher Tabs */}
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
               {(Object.keys(DOC_TEMPLATES) as Array<keyof typeof DOC_TEMPLATES>).map((tabKey) => {
                 const doc = DOC_TEMPLATES[tabKey];
                 const isSelected = activeDocTab === tabKey;
                 const hasCustomContent = !!settings.find(s => s.key === doc.contentKey)?.value;

                 return (
                   <button
                     key={tabKey}
                     type="button"
                     onClick={() => setActiveDocTab(tabKey)}
                     className={`p-4 rounded-2xl text-left border transition-all duration-300 relative ${
                       isSelected
                         ? `${doc.activeBg} shadow-lg scale-[1.02]`
                         : 'bg-black/30 border-white/5 hover:border-white/20 text-slate-400 hover:text-white'
                     }`}
                   >
                     <div className="flex items-center justify-between mb-2">
                       <span className={`text-[8.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                         isSelected ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'
                       }`}>
                         {doc.badge}
                       </span>
                       <span className={`w-2 h-2 rounded-full ${hasCustomContent ? 'bg-emerald-400' : 'bg-slate-700'}`} title={hasCustomContent ? 'Customized' : 'Using default'} />
                     </div>
                     <div className="text-xs font-black uppercase tracking-tight text-white">{doc.label}</div>
                     <div className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{doc.href}</div>
                   </button>
                 );
               })}
             </div>

             {/* Active Document Editor */}
             {(() => {
               const doc = DOC_TEMPLATES[activeDocTab];
               const currentTitle = settings.find(s => s.key === doc.titleKey)?.value ?? '';
               const currentSubtitle = settings.find(s => s.key === doc.subtitleKey)?.value ?? '';
               const currentContent = settings.find(s => s.key === doc.contentKey)?.value ?? '';
               const isCustomized = !!currentContent;

               return (
                 <div className="space-y-6 bg-black/40 p-6 md:p-8 rounded-[32px] border border-white/5">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                     <div className="flex items-center gap-2">
                       <span className={`text-xs font-black uppercase tracking-wider ${doc.color}`}>
                         Editing {doc.label}
                       </span>
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                         isCustomized 
                           ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                           : 'bg-slate-800 text-slate-500 border-slate-700'
                       }`}>
                         {isCustomized ? 'Custom Content Active' : 'Default Content Active'}
                       </span>
                     </div>

                     <div className="flex flex-wrap items-center gap-2">
                       <button
                         type="button"
                         onClick={() => handleLoadDefaultDoc(activeDocTab)}
                         className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[9px] font-black uppercase tracking-wider transition-all"
                       >
                         Load Default Template
                       </button>
                       <button
                         type="button"
                         onClick={() => handleResetDoc(activeDocTab)}
                         className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[9px] font-black uppercase tracking-wider transition-all"
                       >
                         Reset to Default
                       </button>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                         Document Title (Header)
                       </label>
                       <input 
                         className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold text-xs focus:outline-none focus:border-[#3DD6C8] transition-all"
                         value={currentTitle}
                         onChange={(e) => handleUpdate(doc.titleKey, e.target.value)}
                         placeholder={doc.defaultTitle}
                       />
                     </div>

                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                         Document Subtitle / Directive Pill
                       </label>
                       <input 
                         className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold text-xs focus:outline-none focus:border-[#3DD6C8] transition-all"
                         value={currentSubtitle}
                         onChange={(e) => handleUpdate(doc.subtitleKey, e.target.value)}
                         placeholder={doc.defaultSubtitle}
                       />
                     </div>
                   </div>

                   {/* SPECIAL SALARY STRUCTURE CONFIGURATION */}
                   {activeDocTab === 'salary' && (() => {
                     let currentSalaryTiers = DEFAULT_SALARY_DATA;
                     const tiersRaw = settings.find(s => s.key === 'salary_tiers_data')?.value;
                     if (tiersRaw) {
                       try {
                         const parsed = typeof tiersRaw === 'string' ? JSON.parse(tiersRaw) : tiersRaw;
                         if (Array.isArray(parsed) && parsed.length > 0) currentSalaryTiers = parsed;
                       } catch (e) {}
                     }
                     const salaryWorkingHours = settings.find(s => s.key === 'salary_working_hours_badge')?.value ?? '10:00 AM – 7:00 PM CT';

                     const updateTierReward = (tierIdx: number, dayIdx: number, val: number) => {
                       const updated = currentSalaryTiers.map((t, idx) => {
                         if (idx !== tierIdx) return t;
                         const newRewards = [...t.rewards];
                         newRewards[dayIdx] = Math.max(0, val || 0);
                         const newTotal = newRewards.reduce((a, b) => a + b, 0);
                         return { ...t, rewards: newRewards, total: newTotal };
                       });
                       handleUpdate('salary_tiers_data', JSON.stringify(updated));
                     };

                     return (
                       <div className="space-y-6 pt-2 pb-2">
                         {/* Working Hours Badge Input */}
                         <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 flex items-center gap-2">
                             <Clock size={12} /> Working Hours Badge & Daily Window
                           </label>
                           <input 
                             className="w-full bg-black/70 border border-amber-500/30 rounded-xl px-4 py-2.5 text-amber-200 font-bold text-xs focus:outline-none focus:border-amber-400 transition-all"
                             value={salaryWorkingHours}
                             onChange={(e) => handleUpdate('salary_working_hours_badge', e.target.value)}
                             placeholder="10:00 AM – 7:00 PM CT"
                           />
                           <p className="text-[9px] text-slate-500">Displayed in the header badge on the user-facing salary page.</p>
                         </div>

                         {/* Interactive Salary Tiers Matrix Editor */}
                         <div className="space-y-3">
                           <div className="flex items-center justify-between ml-1">
                             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
                               Salary Compensation Matrix (Tiers & Cycle Payouts)
                             </label>
                             <button
                               type="button"
                               onClick={() => handleUpdate('salary_tiers_data', JSON.stringify(DEFAULT_SALARY_DATA))}
                               className="text-[9px] font-black text-amber-400 hover:text-amber-300 uppercase tracking-wider"
                             >
                               Reset Matrix to Defaults
                             </button>
                           </div>

                           <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/60">
                             <table className="w-full text-left border-collapse text-xs">
                               <thead>
                                 <tr className="border-b border-white/10 bg-white/[0.02] text-[9px] font-black uppercase tracking-widest text-slate-400">
                                   <th className="p-3 pl-4">VIP Level</th>
                                   {SALARY_DAYS.map(day => (
                                     <th key={day} className="p-3 text-center">Day {day} ($)</th>
                                   ))}
                                   <th className="p-3 pr-4 text-right">30-Day Total</th>
                                 </tr>
                               </thead>
                               <tbody className="divide-y divide-white/5">
                                 {currentSalaryTiers.map((tier, tIdx) => (
                                   <tr key={tier.level || tIdx} className="hover:bg-white/[0.02]">
                                     <td className="p-3 pl-4 font-black text-white whitespace-nowrap">
                                       <span className="text-amber-400 mr-1.5">L{tier.level}</span> {tier.name}
                                     </td>
                                     {SALARY_DAYS.map((_, dIdx) => (
                                       <td key={dIdx} className="p-2 text-center">
                                         <input 
                                           type="number"
                                           min={0}
                                           className="w-20 bg-black/80 border border-white/10 rounded-lg px-2 py-1.5 text-center text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400"
                                           value={tier.rewards?.[dIdx] ?? 0}
                                           onChange={(e) => updateTierReward(tIdx, dIdx, parseFloat(e.target.value) || 0)}
                                         />
                                       </td>
                                     ))}
                                     <td className="p-3 pr-4 text-right font-mono font-black text-amber-400">
                                       ${((tier.rewards || []).reduce((a: number, b: number) => a + b, 0)).toLocaleString()}
                                     </td>
                                   </tr>
                                 ))}
                               </tbody>
                             </table>
                           </div>
                           <p className="text-[9px] text-slate-500 ml-1">
                             Modify the dollar amounts for each day milestone. The 30-day cumulative totals update automatically for users.
                           </p>
                         </div>
                       </div>
                     );
                   })()}

                   {/* FAQ SPECIAL QUICK TEMPLATE INSERTION */}
                   {activeDocTab === 'faq' && (
                     <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                       <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mr-2">FAQ Format Helpers:</span>
                       <button
                         type="button"
                         onClick={() => {
                           const template = `\n\n[Category: New Category Name]\nQ: What is the question?\nA: Provide the clear answer here.\n`;
                           handleUpdate(doc.contentKey, (currentContent || doc.defaultContent) + template);
                         }}
                         className="px-3 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-[9px] font-black uppercase tracking-wider border border-blue-500/30 transition-all"
                       >
                         + Insert Category Block
                       </button>
                       <button
                         type="button"
                         onClick={() => {
                           const template = `\n\nQ: Another question?\nA: Another answer here.\n`;
                           handleUpdate(doc.contentKey, (currentContent || doc.defaultContent) + template);
                         }}
                         className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[9px] font-black uppercase tracking-wider border border-white/10 transition-all"
                       >
                         + Insert Q&A Pair
                       </button>
                     </div>
                   )}

                   <div className="space-y-2">
                     <div className="flex items-center justify-between ml-1">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                         Document Body Content
                       </label>
                       <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">
                         {currentContent ? `${currentContent.length} chars` : 'Default template in use'}
                       </span>
                     </div>
                     <textarea 
                       rows={14}
                       className="w-full bg-black/70 border border-white/10 rounded-2xl p-5 text-slate-200 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-[#3DD6C8] transition-all"
                       value={currentContent}
                       onChange={(e) => handleUpdate(doc.contentKey, e.target.value)}
                       placeholder={`Enter your custom ${doc.label} here. Leave empty to display system defaults, or click "Load Default Template" above to start with the pre-written text.`}
                     />
                     <p className="text-[9px] text-slate-500 font-medium ml-1">
                       Tip: Separate numbered sections (e.g. 1. Title, 2. Title) or bullet points (- Item) with newlines. The platform automatically styles them for users.
                     </p>
                   </div>

                   <div className="flex items-center justify-between pt-4 border-t border-white/5">
                     <a
                       href={doc.href}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-[10px] font-black uppercase tracking-wider text-[#3DD6C8] hover:underline flex items-center gap-1.5"
                     >
                       <span>Preview {doc.href}</span>
                       <ExternalLink size={12} />
                     </a>

                     <button
                       type="button"
                       disabled={savingDoc}
                       onClick={() => handleSaveDoc(activeDocTab)}
                       className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#3DD6C8] hover:bg-[#34b7ab] text-slate-950 font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50"
                     >
                       {savingDoc ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                       <span>Save {doc.label}</span>
                     </button>
                   </div>
                 </div>
               );
             })()}
           </section>

           {/* PILLAR 3: VISUAL APPEARANCE & THEME ENGINE */}
           <section className="bg-slate-900/40 border border-white/5 p-10 rounded-[48px] backdrop-blur-xl relative overflow-hidden group hover:border-[#3DD6C8]/20 transition-all duration-700">
             <div className="absolute top-0 right-0 w-96 h-96 bg-[#3DD6C8]/5 blur-[120px] rounded-full pointer-events-none" />
             
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-[#3DD6C8]/10 rounded-2xl text-[#3DD6C8] ring-1 ring-[#3DD6C8]/30 shadow-[0_0_20px_rgba(61,214,200,0.2)]">
                    <Brush size={26} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none flex items-center gap-3">
                      Visual Terminal & Theme Engine
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#3DD6C8]/10 text-[#3DD6C8] border border-[#3DD6C8]/30">Live Sync</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">
                      Configure platform colors, accent tones, and terminal styling in real time.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const defaultTheme = {
                      primary: '#3DD6C8',
                      accent: '#E34304',
                      background: '#0B0B1E',
                      surface: 'rgba(15, 23, 42, 0.6)'
                    };
                    handleUpdate('theme_colors', defaultTheme);
                    if (typeof document !== 'undefined') {
                      const root = document.documentElement;
                      root.style.setProperty('--primary', defaultTheme.primary);
                      root.style.setProperty('--primary-glow', `${defaultTheme.primary}40`);
                      root.style.setProperty('--accent', defaultTheme.accent);
                      root.style.setProperty('--background', defaultTheme.background);
                    }
                    toast.success('Reset to Default Theme');
                  }}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest transition-all w-fit"
                >
                  <RotateCcw size={14} /> Reset Defaults
                </button>
             </div>

             {/* 1-Click Theme Presets */}
             <div className="space-y-4 mb-10">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-2">
                  <Sparkles size={14} className="text-[#3DD6C8]" />
                  Instant 1-Click Theme Presets
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {THEME_PRESETS.map((preset) => {
                    const themeValue = settings.find(s => s.key === 'theme_colors')?.value || {};
                    const isSelected = themeValue?.primary?.toLowerCase() === preset.primary.toLowerCase();
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          const updated = {
                            primary: preset.primary,
                            accent: preset.accent,
                            background: preset.background,
                            surface: preset.surface
                          };
                          handleUpdate('theme_colors', updated);
                          if (typeof document !== 'undefined') {
                            const root = document.documentElement;
                            root.style.setProperty('--primary', preset.primary);
                            root.style.setProperty('--primary-glow', `${preset.primary}40`);
                            root.style.setProperty('--accent', preset.accent);
                            root.style.setProperty('--background', preset.background);
                          }
                          toast.success(`Preset "${preset.name}" Applied`);
                        }}
                        className={`p-5 rounded-3xl text-left border transition-all duration-300 relative group overflow-hidden ${
                          isSelected 
                            ? 'bg-white/10 border-[#3DD6C8] shadow-[0_0_25px_rgba(61,214,200,0.15)] scale-[1.02]' 
                            : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-5 h-5 rounded-full shadow-md border border-white/20" style={{ backgroundColor: preset.primary }} />
                          <div className="w-3.5 h-3.5 rounded-full shadow-md border border-white/20" style={{ backgroundColor: preset.accent }} />
                          <div className="w-3 h-3 rounded-full border border-white/10 ml-auto" style={{ backgroundColor: preset.background }} />
                        </div>
                        <h4 className="text-xs font-black text-white uppercase tracking-tight mb-1">{preset.name}</h4>
                        <p className="text-[9px] text-slate-500 font-medium leading-relaxed">{preset.desc}</p>
                        {isSelected && (
                          <div className="mt-3 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-[#3DD6C8]">
                            <CheckCircle2 size={12} /> Active Preset
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
             </div>

             {/* Custom Color Controls & Live Interactive Terminal Preview */}
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Color Controls */}
                <div className="lg:col-span-6 space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 block">
                    Custom Color Palette Calibration
                  </label>

                  {/* Primary Color */}
                  {(() => {
                    const themeValue = settings.find(s => s.key === 'theme_colors')?.value || {};
                    const primary = themeValue?.primary || '#3DD6C8';
                    const accent = themeValue?.accent || '#E34304';
                    const background = themeValue?.background || '#0B0B1E';

                    const updateColor = (key: string, val: string) => {
                      const updated = {
                        primary,
                        accent,
                        background,
                        surface: 'rgba(15, 23, 42, 0.6)',
                        [key]: val
                      };
                      handleUpdate('theme_colors', updated);
                      if (typeof document !== 'undefined') {
                        const root = document.documentElement;
                        root.style.setProperty(`--${key}`, val);
                        if (key === 'primary') root.style.setProperty('--primary-glow', `${val}40`);
                      }
                    };

                    return (
                      <div className="space-y-4">
                        <div className="p-4 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <input 
                              type="color" 
                              value={primary.startsWith('#') ? primary : '#3DD6C8'} 
                              onChange={(e) => updateColor('primary', e.target.value)}
                              className="w-10 h-10 rounded-2xl cursor-pointer bg-transparent border-0"
                            />
                            <div>
                              <span className="text-xs font-black text-white uppercase tracking-wider block">Primary Brand Color</span>
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Buttons, glow borders, badges</span>
                            </div>
                          </div>
                          <input 
                            type="text" 
                            value={primary} 
                            onChange={(e) => updateColor('primary', e.target.value)}
                            className="w-28 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-right font-mono font-bold text-xs text-white focus:outline-none focus:border-[#3DD6C8]"
                          />
                        </div>

                        <div className="p-4 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <input 
                              type="color" 
                              value={accent.startsWith('#') ? accent : '#E34304'} 
                              onChange={(e) => updateColor('accent', e.target.value)}
                              className="w-10 h-10 rounded-2xl cursor-pointer bg-transparent border-0"
                            />
                            <div>
                              <span className="text-xs font-black text-white uppercase tracking-wider block">Accent / Hot Action Tone</span>
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Withdrawal, badges, alert dots</span>
                            </div>
                          </div>
                          <input 
                            type="text" 
                            value={accent} 
                            onChange={(e) => updateColor('accent', e.target.value)}
                            className="w-28 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-right font-mono font-bold text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="p-4 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <input 
                              type="color" 
                              value={background.startsWith('#') ? background : '#0B0B1E'} 
                              onChange={(e) => updateColor('background', e.target.value)}
                              className="w-10 h-10 rounded-2xl cursor-pointer bg-transparent border-0"
                            />
                            <div>
                              <span className="text-xs font-black text-white uppercase tracking-wider block">Terminal Base Tint</span>
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Global platform canvas background</span>
                            </div>
                          </div>
                          <input 
                            type="text" 
                            value={background} 
                            onChange={(e) => updateColor('background', e.target.value)}
                            className="w-28 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-right font-mono font-bold text-xs text-white focus:outline-none focus:border-blue-400"
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Live Preview Card */}
                <div className="lg:col-span-6">
                  {(() => {
                    const themeValue = settings.find(s => s.key === 'theme_colors')?.value || {};
                    const primary = themeValue?.primary || '#3DD6C8';
                    const accent = themeValue?.accent || '#E34304';
                    const background = themeValue?.background || '#0B0B1E';

                    return (
                      <div 
                        className="h-full rounded-3xl p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-500"
                        style={{ backgroundColor: background }}
                      >
                        <div className="flex items-center justify-between pb-6 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs" style={{ backgroundColor: `${primary}25`, color: primary, border: `1px solid ${primary}40` }}>
                              <Eye size={16} />
                            </div>
                            <div>
                              <span className="text-xs font-black text-white uppercase tracking-wider block">Real-Time Terminal Preview</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Simulated Member View</span>
                            </div>
                          </div>
                          <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5" style={{ backgroundColor: `${primary}15`, color: primary, border: `1px solid ${primary}30` }}>
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: primary }} />
                            Live Matrix
                          </div>
                        </div>

                        <div className="my-6 space-y-4">
                          <div className="p-5 rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Yield Optimization Balance</span>
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: `${accent}25`, color: accent }}>Hot Shard</span>
                            </div>
                            <div className="text-3xl font-black italic tracking-tight text-white flex items-baseline gap-2">
                              $14,850.00
                              <span className="text-xs font-mono font-bold" style={{ color: primary }}>+18.4%</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => toast('Theme Preview: Start Optimization demonstration button')}
                              className="py-3.5 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-transform hover:scale-105 active:scale-95"
                              style={{ backgroundColor: primary, color: '#0B0B1E', boxShadow: `0 0 25px ${primary}40` }}
                            >
                              Start Optimization
                            </button>
                            <button
                              type="button"
                              onClick={() => toast('Theme Preview: Withdraw Funds demonstration button')}
                              className="py-3.5 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-colors hover:bg-white/10 active:scale-95"
                              style={{ borderColor: `${accent}60`, color: accent }}
                            >
                              Withdraw Funds
                            </button>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          <span>Primary: <span className="font-mono text-white">{primary}</span></span>
                          <span>Accent: <span className="font-mono text-white">{accent}</span></span>
                          <span>Canvas: <span className="font-mono text-white">{background}</span></span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
             </div>
           </section>
        </div>
      </div> 
    </div> 
  ); 
}
