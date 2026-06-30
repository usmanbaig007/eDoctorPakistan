"use client";

import { useEffect, useState } from "react";
import { getCurrentSession } from "@/app/lib/auth";
import { getAdminAccessStatus } from "@/app/lib/admin";

export function useAdminAuth() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminSession() {
      try {
        const sessionResponse = await getCurrentSession();
        const user = sessionResponse.data.session?.user;

        if (!user?.email) {
          setAuthorized(false);
          setRole(null);
          setLoading(false);
          return;
        }

        const { isAdmin, role: assignedRole } = await getAdminAccessStatus(user.email);
        setAuthorized(isAdmin);
        setRole(assignedRole);
      } catch {
        setAuthorized(false);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    void loadAdminSession();
  }, []);

  return { loading, authorized, role };
}
