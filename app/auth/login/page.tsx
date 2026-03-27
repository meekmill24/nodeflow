'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import NextImage from 'next/image'
import { ArrowRight, ShieldCheck, Mail, Lock, Sparkles, Loader2 } from 'lucide-react'

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      let loginEmail = email;

      // Check if the input is an email, if not, try to fetch email from profiles by username
      if (!email.includes('@')) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', email)
          .single() as { data: { email: string } | null, error: any };

        if (profileError || !profile || !profile.email) {
          loginEmail = `${email}@nodeflow.io`;
        } else {
          loginEmail = profile.email;
        }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      })
      if (error) throw error
      router.push('/app')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden" style={{background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #16213E 100%)'}}>
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse" style={{background: 'rgba(61,214,200,0.08)'}} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse delay-700" style={{background: 'rgba(227,67,4,0.06)'}} />
      
      {/* Decorative Floating Cards (Non-interactive) */}
      <div className="hidden lg:block absolute top-[15%] left-[10%] w-48 h-32 glass-dark rounded-3xl animate-float p-6 rotate-[-6deg]">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="h-2 w-24 bg-cyan-400/20 rounded-full mb-2" />
          <div className="h-2 w-16 bg-cyan-400/10 rounded-full" />
      </div>

      <div className="hidden lg:block absolute bottom-[20%] right-[12%] w-40 h-28 glass rounded-2xl animate-float delay-2 p-4 rotate-[4deg]">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <ShieldCheck className="w-4 h-4 text-green-600" />
          </div>
          <div className="h-2 w-20 bg-green-600/20 rounded-full mb-2" />
          <div className="h-2 w-12 bg-green-600/10 rounded-full" />
      </div>

      <div className="w-full max-w-md px-6 z-10">
        <div className="flex flex-col gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl mb-4 overflow-hidden" style={{background: 'rgba(61,214,200,0.15)', border: '2px solid rgba(61,214,200,0.4)', boxShadow: '0 0 32px rgba(61,214,200,0.2)'}}>
               <NextImage src="/logo.png" alt="NodeFlow Logo" width={80} height={80} className="object-cover transition-transform hover:scale-110" />
            </div>
             <h1 className="text-4xl font-black tracking-tighter text-white">NodeFlow<span style={{color:'#3DD6C8'}}>.</span></h1>
             <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{color:'rgba(61,214,200,0.6)'}}>Precision Optimization Platform</p>
          </div>

          <Card className="shadow-2xl rounded-[40px] overflow-hidden" style={{background: 'rgba(26,26,46,0.9)', border: '1px solid rgba(61,214,200,0.15)'}}>
            <CardHeader className="pt-10 pb-6 text-center">
              <CardTitle className="text-2xl font-black tracking-tighter text-white">Access Your Node</CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-widest mt-2" style={{color:'rgba(255,255,255,0.4)'}}>
                Authorize your session to start optimizing
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest ml-1" style={{color:'rgba(61,214,200,0.7)'}}>Email / Username</Label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'rgba(61,214,200,0.5)'}} />
                       <Input
                        id="email"
                        type="text"
                        placeholder="Email or Username"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-14 rounded-2xl text-white placeholder:text-zinc-500 font-bold !text-white transition-all"
                        style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(61,214,200,0.2)'}}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between ml-1">
                      <Label htmlFor="password" title="password" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Password</Label>
                      <Link href="#" className="text-[10px] font-black uppercase tracking-widest hover:underline" style={{color:'#E34304'}}>Reset</Link>
                    </div>
                    <div className="relative group">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'rgba(61,214,200,0.5)'}} />
                       <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 pr-12 h-14 rounded-2xl text-white font-bold !text-white transition-all"
                        style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(61,214,200,0.2)'}}
                      />
                       <button 
                         type="button" 
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                         style={{color:'rgba(61,214,200,0.4)'}}
                       >
                         {showPassword ? <Sparkles size={18} /> : <Lock size={18} />}
                       </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100 animate-in fade-in slide-in-from-top-1">
                    {error}
                  </div>
                )}

                 <button 
                  type="submit" 
                  title="login-button"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl font-black tracking-[0.2em] shadow-2xl active:scale-95 transition-all uppercase text-xs text-white flex items-center justify-center gap-2"
                  style={{background: isLoading ? 'rgba(61,214,200,0.5)' : '#3DD6C8', color: '#0F0F23', boxShadow: '0 0 24px rgba(61,214,200,0.3)'}}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Access NodeFlow <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-10 text-center">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                  New here?{' '}
                  <Link
                    href="/auth/sign-up"
                    className="hover:underline font-black"
                    style={{color:'#E34304'}}
                  >
                    Join NodeFlow.
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center">
             <p className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.4em]">© 2025 NodeFlow. Platform • v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
