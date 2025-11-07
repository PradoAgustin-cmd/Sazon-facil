import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase"; // tu configuración actual
import { Capacitor } from "@capacitor/core";

export const signInWithGoogle = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      // En la APK (mobile)
      const result = await FirebaseAuthentication.signInWithGoogle();
      return result.user;
    } else {
      // En el navegador (web)
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    }
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      await FirebaseAuthentication.signOut();
    } else {
      await auth.signOut();
    }
  } catch (error) {
    console.error("Error en logout:", error);
    throw error;
  }
};
