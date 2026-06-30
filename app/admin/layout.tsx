"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandLogo from "@/app/components/BrandLogo";
import { useAdminAuth } from "@/app/lib/admin-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const { loading, authorized, role } = useAdminAuth();

  useEffect(() => {
    // Never redirect when the user is already on the admin login page
    if (isLoginPage) return;
    if (!loading && !authorized) {
      router.push("/admin/login");
    }
  }, [loading, authorized, router, isLoginPage]);

  // Render the login page without the admin shell or auth guard UI
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40 text-center">
          <BrandLogo compact />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Administrator Portal</p>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">Checking administrator access…</h1>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            <BrandLogo compact />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Administrator Portal</p>
              <h1 className="text-2xl font-semibold text-slate-900">Platform management</h1>
              {role && <p className="mt-1 text-sm text-slate-500">Signed in as {role}</p>}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "Dashboard", href: "/admin" },
              { label: "Doctors", href: "/admin/doctors" },
              { label: "Appointments", href: "/admin/appointments" },
              { label: "Users", href: "/admin/users" },
              { label: "Logs", href: "/admin/activity-logs" },
              { label: "Analytics", href: "/admin/analytics" },
              { label: "Roles", href: "/admin/roles" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-100">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
