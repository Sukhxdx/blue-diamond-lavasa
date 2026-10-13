"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TotpPanel({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function start() {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/totp", { method: "POST" });
      const body = (await response.json()) as { error?: string; secret?: string; qrDataUrl?: string };
      if (!response.ok) {
        setError(body.error ?? "Setup could not start.");
        return;
      }
      setSecret(body.secret ?? "");
      setQrDataUrl(body.qrDataUrl ?? "");
    } catch {
      setError("Setup could not start.");
    } finally {
      setPending(false);
    }
  }

  async function confirm(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/totp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? "That code was not accepted.");
        return;
      }
      setSecret("");
      setQrDataUrl("");
      setCode("");
      router.refresh();
    } catch {
      setError("That code was not accepted.");
    } finally {
      setPending(false);
    }
  }

  async function disable(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/totp", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, code }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? "Authenticator could not be turned off.");
        return;
      }
      setPassword("");
      setCode("");
      router.refresh();
    } catch {
      setError("Authenticator could not be turned off.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <p className="text-sm leading-6 text-muted">
        {enabled
          ? "Authenticator codes are required at sign-in."
          : "Authenticator codes are optional. Turn them on for the owner account."}
      </p>
      {enabled ? (
        <form onSubmit={disable} className="space-y-3 rounded-3xl border border-sand bg-paper p-4">
          <label className="block text-sm">
            Password
            <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-2xl border border-sand px-3 py-2" />
          </label>
          <label className="block text-sm">
            Current authenticator code
            <input inputMode="numeric" required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} className="mt-1 w-full rounded-2xl border border-sand px-3 py-2" />
          </label>
          <button type="submit" disabled={pending} className="rounded-full border border-sand px-4 py-2 text-sm disabled:opacity-50">
            {pending ? "Turning off…" : "Turn off authenticator"}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <button type="button" onClick={start} disabled={pending} className="rounded-full bg-pine px-4 py-2 text-sm text-cream disabled:opacity-50">
            {pending ? "Preparing…" : "Set up authenticator"}
          </button>
          {qrDataUrl ? (
            <form onSubmit={confirm} className="space-y-3 rounded-3xl border border-sand bg-paper p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="Authenticator setup QR code" width={160} height={160} />
              <p className="break-all text-xs text-muted">{secret}</p>
              <label className="block text-sm">
                Code from the app
                <input required inputMode="numeric" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} className="mt-1 w-full rounded-2xl border border-sand px-3 py-2" />
              </label>
              <button type="submit" disabled={pending} className="rounded-full bg-pine px-4 py-2 text-sm text-cream disabled:opacity-50">
                {pending ? "Checking…" : "Confirm authenticator"}
              </button>
            </form>
          ) : null}
        </div>
      )}
      {error ? <p className="text-sm text-pine-deep">{error}</p> : null}
    </div>
  );
}
