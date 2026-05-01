'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { useAuth, useInitStore } from '@/lib/hooks/use-store';
import { APP_CONFIG } from '@/lib/data/constants';

export default function AuthPage() {
  const router = useRouter();
  const { loading: initLoading } = useInitStore();
  const { login, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simuler un delai
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = login(email, password);
    
    if (user) {
      router.push('/dashboard');
    } else {
      setError('Email ou mot de passe incorrect');
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <BookOpen className="size-8" />
          </div>
          <CardTitle className="text-2xl font-bold">{APP_CONFIG.nom}</CardTitle>
          <CardDescription className="text-balance">
            {APP_CONFIG.nomComplet}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Adresse email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@ages.gn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </Field>
              
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Spinner className="mr-2 size-4" />
                ) : (
                  <LogIn className="mr-2 size-4" />
                )}
                Se connecter
              </Button>
            </FieldGroup>
          </form>

          <div className="mt-6 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Comptes de demonstration :
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Admin :</strong> admin@ages.gn / admin123</p>
              <p><strong>Formateur :</strong> formateur1@ages.gn / form123</p>
              <p><strong>Superviseur :</strong> superviseur@ages.gn / sup123</p>
              <p><strong>Direction :</strong> direction@ages.gn / dir123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
