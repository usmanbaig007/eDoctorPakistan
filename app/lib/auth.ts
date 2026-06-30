import { supabase } from "./supabase";
import { LoginFormData, SignupFormData } from "@/app/types";

export async function signUpPatient(formData: SignupFormData) {
  try {
    return await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          gender: formData.gender,
        },
      },
    });
  } catch (error) {
    console.error("Error signing up patient:", error);
    const normalizedError = error instanceof Error ? error : new Error("Unable to complete sign-up.");
    return { data: { user: null, session: null }, error: normalizedError } as { data: { user: null; session: null }; error: Error };
  }
}

export async function signInPatient(formData: LoginFormData) {
  try {
    return await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
  } catch (error) {
    console.error("Error signing in patient:", error);
    const normalizedError = error instanceof Error ? error : new Error("Unable to sign in.");
    return { data: { user: null, session: null }, error: normalizedError } as { data: { user: null; session: null }; error: Error };
  }
}

export async function signOutPatient() {
  try {
    return await supabase.auth.signOut();
  } catch (error) {
    console.error("Error signing out patient:", error);
    const normalizedError = error instanceof Error ? error : new Error("Unable to sign out.");
    return { error: normalizedError } as { error: Error };
  }
}

export async function getCurrentSession() {
  try {
    return await supabase.auth.getSession();
  } catch (error) {
    console.error("Error retrieving session:", error);
    const normalizedError = error instanceof Error ? error : new Error("Unable to retrieve session.");
    return { data: { session: null }, error: normalizedError } as { data: { session: null }; error: Error };
  }
}

export async function resetPatientPassword(email: string) {
  const redirectTo = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`
    : undefined;

  try {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    const normalizedError = error instanceof Error ? error : new Error("Unable to reset password.");
    return { data: { user: null }, error: normalizedError } as { data: { user: null }; error: Error };
  }
}
