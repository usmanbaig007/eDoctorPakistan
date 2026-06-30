"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "@/app/lib/auth";
import {
  fetchPatientByAuthUid,
  fetchAppointmentsByPatientUid,
  cancelAppointment as cancelAppointmentRequest,
} from "@/app/lib/api";
import { Appointment, Patient } from "@/app/types";

export function useProtectedPatientPage() {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPatient() {
      const sessionResponse = await getCurrentSession();
      const session = sessionResponse.data.session;

      if (!session?.user) {
        router.push("/auth/login");
        return;
      }

      const authUid = session.user.id;
      const profile = await fetchPatientByAuthUid(authUid);

      if (!profile) {
        setError(
          "Unable to load patient profile. Please sign in again or create an account."
        );
        setLoading(false);
        return;
      }

      setPatient(profile);
      setLoading(false);
    }

    void loadPatient();
  }, [router]);

  return { patient, loading, error };
}

export function usePatientAppointments(authUid: string | null) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const reloadAppointments = useCallback(async () => {
    if (!authUid) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    const data = await fetchAppointmentsByPatientUid(authUid);
    setAppointments(data);
    setLoading(false);
  }, [authUid]);

  useEffect(() => {
    async function initialize() {
      await reloadAppointments();
    }

    void initialize();
  }, [reloadAppointments]);

  const cancelAppointment = useCallback(
    async (appointmentId: string) => {
      setActionError("");
      setActionMessage("");

      const success = await cancelAppointmentRequest(appointmentId);
      if (!success) {
        setActionError("Unable to cancel the appointment. Please try again.");
        return;
      }

      setActionMessage("Appointment cancelled successfully.");
      void reloadAppointments();
    },
    [reloadAppointments]
  );

  return {
    appointments,
    loading,
    error,
    actionMessage,
    actionError,
    cancelAppointment,
  };
}
