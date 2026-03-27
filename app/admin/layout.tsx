'use client'; 
import { useAuth } from '@/context/AuthContext'; 
import { useRouter } from 'next/navigation'; 
import { useEffect, useState } from 'react'; 
import { supabase } from '@/lib/supabase/index'; 
import Link from 'next/link'; 
import { usePathname } from 'next/navigation'; 
import { 
  LayoutDashboard, Users, Layers, Grid3X3, Share2, Receipt, LogOut, DollarSign, Menu, X, ArrowDownToLine, ArrowUpFromLine, Package, Bell, Settings, AlertCircle, Wallet as WalletIcon, ArrowUpRight, Wallet, ShieldCheck
} from 'lucide-react'; 
import AnimatePage from '@/components/AnimatePage'; 
import NotificationCenter from '@/components/NotificationCenter';

const navItems = [ 
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' }, 
  { icon: Users, label: 'Users', href: '/admin/users' }, 
  { icon: WalletIcon, label: 'Deposits', href: '/admin/deposits' },
  { icon: ArrowUpFromLine, label: 'Withdrawals', href: '/admin/withdrawals' },
  { icon: Package, label: 'Bundles', href: '/admin/bundles' }, 
  { icon: Bell, label: 'Notify Users', href: '/admin/notify' }, 
  { icon: Layers, label: 'Levels', href: '/admin/levels' }, 
  { icon: Grid3X3, label: 'Task Items', href: '/admin/tasks' }, 
  { icon: Share2, label: 'Referrals', href: '/admin/referrals' }, 
  { icon: Receipt, label: 'Transactions', href: '/admin/transactions' }, 
  { icon: Settings, label: 'Settings', href: '/admin/settings' }, 
]; 

export default function AdminLayout({ children }: { children: React.ReactNode }) { 
  const { user, profile, loading, signOut } = useAuth(); 
  const router = useRouter(); 
  const pathname = usePathname(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingCounts, setPendingCounts] = useState({ deposits: 0, withdrawals: 0 });

  useEffect(() => {
    if (!loading) {
      // Check if user is already on the login page
      if (pathname === '/admin/login') {
        // If they are already authenticated as an admin, redirect them out of the login page
        if (user && profile?.role === 'admin') {
          router.replace('/admin');
        }
        return;
      }

      // Normal protection for /admin/* pages:
      if (!user || !profile || profile.role !== 'admin') {
        router.push('/admin/login');
      }
    }
  }, [user, profile, loading, router, pathname]);

  useEffect(() => {
    const fetchPending = async () => {
      const [deps, withs] = await Promise.all([
        supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('type', 'deposit').eq('status', 'pending'),
        supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('type', 'withdrawal').eq('status', 'pending'),
      ]);
      setPendingCounts({
        deposits: deps.count || 0,
        withdrawals: withs.count || 0,
      });
    };
    if (user && profile?.role === 'admin' && pathname !== '/admin/login') fetchPending();
  }, [user, profile, pathname]);

  // Do not render layout shell on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Non-blocking loading state: Show the shell if we have a user, otherwise wait for auth
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background:'#0F0F23'}}>
        <div className="flex flex-col items-center gap-4 animate-pulse">
           <div className="w-16 h-16 rounded-3xl flex items-center justify-center" style={{background:'rgba(61,214,200,0.15)' , border:'2px solid rgba(61,214,200,0.3)'}}>
              <ShieldCheck size={32} style={{color:'#3DD6C8'}} />
           </div>
           <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{color:'rgba(61,214,200,0.6)'}}>Establishing Secure Node...</span>
        </div>
      </div>
    );
  }
  
  if (!user || !profile || profile.role !== 'admin') return null; 

  const totalPending = pendingCounts.deposits + pendingCounts.withdrawals;

  return ( 
    <div className="min-h-screen flex text-slate-200 relative overflow-x-hidden" style={{background:'#0F0F23'}}> 
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-[76px] left-6 z-50 p-3 backdrop-blur-md rounded-2xl shadow-2xl border transition-all duration-300 hover:scale-110 active:scale-95 text-white"
        style={{background:'rgba(61,214,200,0.9)', border:'1px solid rgba(61,214,200,0.3)'}}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 backdrop-blur-xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} style={{background:'rgba(15,15,35,0.95)', borderRight:'1px solid rgba(61,214,200,0.12)'}}>
        <div className="h-full flex flex-col p-6">
          <div className="mb-10 px-2 flex items-center gap-3">
            <div className="min-w-[40px] h-10 rounded-xl bg-slate-900 border border-[#3DD6C8]/20 flex items-center justify-center p-1.5 overflow-hidden shadow-[0_0_15px_rgba(61,214,200,0.1)]">
               <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-black" style={{color:'#3DD6C8', fontFamily:'Montserrat, sans-serif'}}>
                NodeFlow<span style={{color:'#E34304'}}>.</span>
              </h1>
              <p className="text-[9px] font-black uppercase tracking-widest" style={{color:'rgba(255,255,255,0.3)'}}>Command Center</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const hasAlert = (item.label === 'Deposit Wallet' && (pendingCounts.deposits > 0 || pendingCounts.withdrawals > 0));
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive ? 'text-white shadow-lg' : 'text-slate-400 hover:text-white'}
                  `}
                  style={isActive ? {background:'rgba(61,214,200,0.2)', border:'1px solid rgba(61,214,200,0.3)'} : {}}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} style={isActive ? {color:'#3DD6C8'} : {}} className={isActive ? '' : 'text-slate-500 group-hover:text-white'} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                {item.label === 'Deposits' && pendingCounts.deposits > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {pendingCounts.deposits}
                  </span>
                )}
                {item.label === 'Withdrawals' && pendingCounts.withdrawals > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {pendingCounts.withdrawals}
                  </span>
                )}
                </Link>
              );
            })}
          </nav>

          <button 
            onClick={() => signOut()}
            className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:ml-64 relative z-10 min-h-screen"> 
        <header className="p-6 md:p-8 flex items-center justify-between lg:justify-end border-b backdrop-blur-md sticky top-0 z-30" style={{borderColor:'rgba(61,214,200,0.1)', background:'rgba(15,15,35,0.6)'}}>
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-[#3DD6C8]/20 flex items-center justify-center p-1.5 overflow-hidden">
               <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="text-xl font-black" style={{color:'#3DD6C8', fontFamily:'Montserrat,sans-serif'}}>NodeFlow<span style={{color:'#E34304'}}>.</span></div>
          </div>
          <div className="flex items-center gap-4">
            {totalPending > 0 && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-xs font-semibold animate-pulse">
                <AlertCircle size={14} />
                <span>{totalPending} Action Needed</span>
              </div>
            )}
            <NotificationCenter />
            <div className="flex items-center gap-3 px-4 py-2 rounded-full" style={{background:'rgba(61,214,200,0.08)', border:'1px solid rgba(61,214,200,0.2)'}}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black" style={{background:'#3DD6C8', color:'#0F0F23'}}>
                {profile?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="text-sm font-medium hidden sm:block">
                {profile?.username || 'Admin'}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1 overflow-auto" style={{background:'radial-gradient(circle at top right, rgba(61,214,200,0.04), transparent)'}}> 
          <div className="max-w-[1600px] mx-auto"> 
            <AnimatePage key={pathname}>{children}</AnimatePage> 
          </div> 
        </div> 
      </main> 
    </div> 
  ); 
}
