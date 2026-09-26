'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RegisterRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const query = searchParams.toString();
        router.replace(`/auth/sign-up${query ? `?${query}` : ''}`);
    }, [router, searchParams]);

    return (
        <div className="min-h-screen bg-[#0B0B1E] flex items-center justify-center text-white/50 text-sm">
            Redirecting to registration...
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0B0B1E]" />}>
            <RegisterRedirect />
        </Suspense>
    );
}
