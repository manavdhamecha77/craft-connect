"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { PageLayout } from './page-layout';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: 'artisan' | 'customer';
  redirectTo?: string;
}

export function RouteGuard({ 
  children, 
  requireAuth = true, 
  requireRole,
  redirectTo = '/auth' 
}: RouteGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // If still loading, don't make decisions yet
      if (loading) {
        setAuthorized(false);
        return;
      }

      // If auth is required but user is not authenticated
      if (requireAuth && !user) {
        setAuthorized(false);
        router.replace(redirectTo);
        return;
      }

      // If specific role is required but user doesn't have it
      if (requireRole && user?.role !== requireRole) {
        setAuthorized(false);
        // Redirect based on user's actual role
        const redirectPath = user?.role === 'artisan' ? '/dashboard' : '/marketplace';
        router.replace(redirectPath);
        return;
      }

      // If auth is not required and user is authenticated, redirect away from auth pages
      if (!requireAuth && user && pathname.startsWith('/auth')) {
        setAuthorized(false);
        const redirectPath = user.role === 'artisan' ? '/dashboard' : '/marketplace';
        router.replace(redirectPath);
        return;
      }

      setAuthorized(true);
    };

    checkAuth();
  }, [user, loading, requireAuth, requireRole, redirectTo, router, pathname]);

  // Prevent browser back button from showing protected content when logged out
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!user && requireAuth) {
        // Clear history state for protected routes
        window.history.replaceState(null, '', redirectTo);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user, requireAuth, redirectTo]);

  // Show loading state
  if (loading || (!authorized && requireAuth)) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              {loading ? 'Loading...' : 'Checking authentication...'}
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Show unauthorized state
  if (!authorized) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this page.
            </p>
            <button
              onClick={() => router.replace(redirectTo)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return <>{children}</>;
}

// Convenience wrapper for artisan-only routes
export function ArtisanRoute({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requireAuth={true} requireRole="artisan">
      {children}
    </RouteGuard>
  );
}

// Convenience wrapper for customer-only routes  
export function CustomerRoute({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requireAuth={true} requireRole="customer">
      {children}
    </RouteGuard>
  );
}

// Convenience wrapper for protected routes (any authenticated user)
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requireAuth={true}>
      {children}
    </RouteGuard>
  );
}

// Convenience wrapper for public routes (redirect if authenticated)
export function PublicRoute({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requireAuth={false}>
      {children}
    </RouteGuard>
  );
}
