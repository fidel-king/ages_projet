'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useInitStore } from '@/lib/hooks/use-store';
import { Spinner } from '@/components/ui/spinner';

export default function HomePage() {
  const router = useRouter();
  const { loading: initLoading } = useInitStore();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!initLoading && !authLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/auth');
      }
    }
  }, [initLoading, authLoading, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner className="size-8" />
    </div>
  );
}
