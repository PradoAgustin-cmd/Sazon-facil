"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithCredential,
} from "firebase/auth";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Capacitor } from "@capacitor/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error: any) {
      const code = error?.code as string | undefined;
      if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-email" ||
        code === "auth/user-not-found"
      ) {
        setErrorMsg(
          "Credenciales inválidas. Verifica el correo y la contraseña."
        );
      } else {
        setErrorMsg("No se pudo iniciar sesión. Intenta nuevamente.");
      }
      console.error("Error durante inicio de sesión:", error);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);

    // Detectar si estamos en mobile (APK) o web
    if (Capacitor.isNativePlatform()) {
      // Flujo nativo para Android/iOS con @capacitor-firebase/authentication
      try {
        const result = await FirebaseAuthentication.signInWithGoogle();

        if (result.user) {
          console.log("Usuario logueado (mobile):", result.user);
          router.push("/");
        } else {
          setErrorMsg("No se pudo obtener los datos del usuario.");
        }
      } catch (error: any) {
        // El usuario pudo cancelar
        if (error.message && error.message.includes("cancelled")) {
          console.log("El usuario canceló el inicio de sesión con Google.");
          return;
        }
        setErrorMsg("Error en el inicio de sesión con Google.");
        console.error(
          "Error en FirebaseAuthentication.signInWithGoogle:",
          error
        );
      }
    } else {
      // Flujo web (navegador)
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        router.push("/");
      } catch (error: any) {
        setErrorMsg("No se pudo iniciar sesión con Google.");
        console.error("Error en signInWithPopup:", error);
      }
    }
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingresa tu correo electrónico a continuación para iniciar sesión en tu
          cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="grid gap-4">
            {errorMsg && (
              <div className="text-sm text-red-600" role="alert">
                {errorMsg}
              </div>
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
            >
              Iniciar Sesión con Google
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link href="/signup" className="underline">
            Regístrate
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
