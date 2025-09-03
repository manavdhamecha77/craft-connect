
"use server";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "@/lib/firebase";

type ActionResult = {
    user?: any;
    error?: string;
};

export async function handleSignUp(email: string, password: string, displayName: string): Promise<ActionResult> {
    const auth = getAuth(app);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        const { uid, email: userEmail, displayName: userDisplayName } = userCredential.user;
        return { user: { uid, email: userEmail, displayName: userDisplayName } };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function handleSignIn(email: string, password: string): Promise<ActionResult> {
    const auth = getAuth(app);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const { uid, email: userEmail, displayName } = userCredential.user;
        return { user: { uid, email: userEmail, displayName } };
    } catch (error: any) {
        return { error: error.message };
    }
}
