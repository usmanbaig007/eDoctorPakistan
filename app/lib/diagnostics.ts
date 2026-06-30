import { getCurrentSession } from "./auth";
import { getSupabaseConfigStatus, supabase } from "./supabase";

export type DiagnosticStatus = "PASS" | "FAIL";

export interface DiagnosticCheck {
  name: string;
  status: DiagnosticStatus;
  detail: string;
}

export interface DebugSnapshot {
  currentUser: {
    id: string | null;
    email: string | null;
  } | null;
  connectionStatus: string;
  counts: {
    doctors: number;
    patients: number;
    appointments: number;
  };
  apiErrors: string[];
}

const DEFAULT_ROUTES = ["/", "/doctors", "/auth/login", "/dashboard/patient", "/debug", "/system-check"];

export async function runSystemChecks(routePaths: string[] = DEFAULT_ROUTES): Promise<DiagnosticCheck[]> {
  const checks: DiagnosticCheck[] = [];
  const envStatus = getSupabaseConfigStatus();

  checks.push({
    name: "Environment variables",
    status: envStatus.configured ? "PASS" : "FAIL",
    detail: envStatus.configured
      ? "Supabase URL and anon key are configured."
      : "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  });

  try {
    const sessionResponse = await getCurrentSession();
    if (sessionResponse.error) {
      throw sessionResponse.error;
    }
    checks.push({
      name: "Auth configuration",
      status: "PASS",
      detail: "Supabase auth is reachable and session lookup completed.",
    });
  } catch (error) {
    checks.push({
      name: "Auth configuration",
      status: "FAIL",
      detail: error instanceof Error ? error.message : "Unable to verify auth configuration.",
    });
  }

  try {
    const response = await supabase.from("doctors").select("id", {
      count: "exact",
      head: true,
    });
    if (response.error) {
      throw response.error;
    }
    checks.push({
      name: "Doctors table access",
      status: "PASS",
      detail: `Accessible (${response.count ?? 0} row(s)).`,
    });
  } catch (error) {
    checks.push({
      name: "Doctors table access",
      status: "FAIL",
      detail: error instanceof Error ? error.message : "Unable to query the doctors table.",
    });
  }

  try {
    const response = await supabase.from("patients").select("id", {
      count: "exact",
      head: true,
    });
    if (response.error) {
      throw response.error;
    }
    checks.push({
      name: "Patients table access",
      status: "PASS",
      detail: `Accessible (${response.count ?? 0} row(s)).`,
    });
  } catch (error) {
    checks.push({
      name: "Patients table access",
      status: "FAIL",
      detail: error instanceof Error ? error.message : "Unable to query the patients table.",
    });
  }

  try {
    const response = await supabase.from("appointments").select("id", {
      count: "exact",
      head: true,
    });
    if (response.error) {
      throw response.error;
    }
    checks.push({
      name: "Appointments table access",
      status: "PASS",
      detail: `Accessible (${response.count ?? 0} row(s)).`,
    });
  } catch (error) {
    checks.push({
      name: "Appointments table access",
      status: "FAIL",
      detail: error instanceof Error ? error.message : "Unable to query the appointments table.",
    });
  }

  const routeResults = await Promise.all(
    routePaths.map(async (route) => {
      try {
        const response = await fetch(route, { method: "HEAD" });
        return response.ok || response.status < 500;
      } catch {
        return false;
      }
    })
  );

  const failedRoutes = routePaths.filter((_, index) => !routeResults[index]);

  checks.push({
    name: "Route availability",
    status: failedRoutes.length === 0 ? "PASS" : "FAIL",
    detail:
      failedRoutes.length === 0
        ? `${routePaths.length} route(s) responded successfully.`
        : `Unavailable route(s): ${failedRoutes.join(", ")}`,
  });

  return checks;
}

export async function getDebugSnapshot(): Promise<DebugSnapshot> {
  const apiErrors: string[] = [];
  const currentSession = await getCurrentSession();
  const currentUser = currentSession.data?.session?.user
    ? {
        id: currentSession.data.session.user.id,
        email: currentSession.data.session.user.email ?? null,
      }
    : null;

  const counts = {
    doctors: 0,
    patients: 0,
    appointments: 0,
  };

  for (const [tableName, countKey] of [
    ["doctors", "doctors"],
    ["patients", "patients"],
    ["appointments", "appointments"],
  ] as const) {
    try {
      const response = await supabase.from(tableName).select("id", {
        count: "exact",
        head: true,
      });
      if (response.error) {
        throw response.error;
      }
      counts[countKey as keyof typeof counts] = response.count ?? 0;
    } catch (error) {
      apiErrors.push(`${tableName}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  return {
    currentUser,
    connectionStatus: getSupabaseConfigStatus().configured ? "Configured" : "Missing environment variables",
    counts,
    apiErrors,
  };
}
