'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth } from '@/lib/firebase';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [checkingRedirect, setCheckingRedirect] = useState(true);

  // Revisa si viene de un redirect (por ejemplo en WebView donde popup falla)
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          router.push('/');
        }
      })
      .catch((err) => {
        // No es crítico; simplemente continúa con flujo normal
        console.warn('Redirect result error', err);
      })
      .finally(() => setCheckingRedirect(false));
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
      const code = error?.code as string | undefined;
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/invalid-email' || code === 'auth/user-not-found') {
        setErrorMsg('Credenciales inválidas. Verifica el correo y la contraseña.');
      } else {
        setErrorMsg('No se pudo iniciar sesión. Intenta nuevamente.');
      }
      console.error('Error durante inicio de sesión:', error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setErrorMsg(null);
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error: any) {
      // En WebView/Android a veces el popup no está soportado: usa redirect de respaldo
      const code = error?.code as string | undefined;
      const fallbackCodes = new Set([
        'auth/operation-not-supported-in-this-environment',
        'auth/popup-blocked',
        'auth/popup-closed-by-user',
      ]);
      try {
        if (!code || fallbackCodes.has(code)) {
          await signInWithRedirect(auth, provider);
          return; // Navegará de vuelta con getRedirectResult
        }
        // Otros errores: muestra mensaje genérico
        setErrorMsg('No se pudo iniciar sesión con Google.');
        console.error('Error durante login con Google (no fallback):', error);
      } catch (redirectErr) {
        setErrorMsg('No se pudo iniciar sesión con Google.');
        console.error('Error durante login con Google (redirect):', redirectErr);
      }
    }
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingresa tu correo electrónico a continuación para iniciar sesión en tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="grid gap-4">
            {errorMsg && (
              <div className="text-sm text-red-600" role="alert">{errorMsg}</div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              type="button"
              disabled={checkingRedirect}
            >
              {checkingRedirect ? 'Verificando...' : 'Iniciar Sesión con Google'}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          ¿No tienes una cuenta?{' '}
          <Link href="/signup" className="underline">
            Regístrate
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
