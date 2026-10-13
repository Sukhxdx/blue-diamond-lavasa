import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";
import { currentStaffUser } from "@/lib/auth/current-user";
import { RESTAURANT_NAME } from "@/lib/restaurant/constants";

const adminLinks = [
  { href: "/admin/tables", label: "Tables" },
  { href: "/admin/staff", label: "Staff" },
  { href: "/admin/security", label: "Security" },
];

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const user = await currentStaffUser();

  return (
    <div className="min-h-full">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-paper focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      {user ? (
        <header className="bg-pine text-cream">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
            <div>
              <p className="font-serif text-2xl leading-none">{RESTAURANT_NAME}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-brass-bright">
                {user.name} · {user.role === "ADMIN" ? "Owner" : "Staff"}
              </p>
            </div>
            <LogoutButton />
          </div>
          {user.role === "ADMIN" ? (
            <nav className="mx-auto flex max-w-5xl gap-4 px-4 pb-4 text-sm" aria-label="Admin">
              {adminLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-brass-bright">
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </header>
      ) : null}
      <main id="content">{children}</main>
    </div>
  );
}
