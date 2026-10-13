"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { safeNextPath } from "@/lib/auth/rbac";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [totpRequired, setTotpRequired] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, ...(totp ? { totp } : {}) }),
      });
      const body = (await response.json()) as { error?: string; code?: string };
      if (!response.ok) {
        if (body.code === "totp_required") setTotpRequired(true);
        setError(body.error ?? "Sign-in failed.");
        setPending(false);
        return;
      }
      router.push(safeNextPath(nextPath));
      router.refresh();
    } catch {
      setError("Sign-in failed. Check the connection and try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 w-full max-w-md space-y-4">
      <label className="block text-sm">
        Email
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-2xl border border-sand bg-paper px-4 py-3"
        />
      </label>
      <label className="block text-sm">
        Password
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-2xl border border-sand bg-paper px-4 py-3"
        />
      </label>
      {totpRequired ? (
        <label className="block text-sm">
          Authenticator code
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            required
            value={totp}
            onChange={(event) => setTotp(event.target.value.replace(/\D/g, "").slice(0, 6))}
            className="mt-1 w-full rounded-2xl border border-sand bg-paper px-4 py-3 tracking-[0.4em]"
          />
        </label>
      ) : null}
      {error ? <p className="text-sm text-pine-deep">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-pine px-5 py-3 text-sm text-cream disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
