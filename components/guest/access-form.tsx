"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CONSENT_COPY } from "@/lib/restaurant/constants";

type Step = "details" | "code";

export function AccessForm({ tableCode, tableLabel }: { tableCode: string; tableLabel: string }) {
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [phoneLast4, setPhoneLast4] = useState("");
  const [devCode, setDevCode] = useState("");
  const router = useRouter();

  async function sendCode(event?: React.FormEvent) {
    event?.preventDefault();
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableCode, name, phone, consent: true }),
      });
      const body = (await response.json()) as { error?: string; phoneLast4?: string; devCode?: string };
      if (!response.ok) {
        setError(body.error ?? "The code could not be sent.");
        return;
      }
      setPhoneLast4(body.phoneLast4 ?? "");
      setDevCode(body.devCode ?? "");
      setStep("code");
    } catch {
      setError("The code could not be sent. Check the connection and try again.");
    } finally {
      setPending(false);
    }
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableCode, name, phone, consent: true, code }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? "That code is not correct.");
        return;
      }
      router.push(`/m/menu?table=${encodeURIComponent(tableCode)}`);
      router.refresh();
    } catch {
      setError("The code could not be checked. Try again.");
      setPending(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-md px-4 py-8">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-brass">Table</p>
      <h1 className="mt-2 font-serif text-5xl leading-none">{tableLabel}</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Enter your name and WhatsApp number to open the menu.
      </p>

      {step === "details" ? (
        <form onSubmit={sendCode} className="mt-8 space-y-4">
          <label className="block text-sm">
            Name
            <input
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-sand bg-paper px-4 py-3"
            />
          </label>
          <label className="block text-sm">
            WhatsApp number
            <input
              required
              inputMode="tel"
              autoComplete="tel"
              placeholder="98XXXXXXXX"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-sand bg-paper px-4 py-3"
            />
          </label>
          <label className="flex gap-3 rounded-2xl border border-sand bg-paper p-4 text-sm leading-6">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1"
              required
            />
            <span>{CONSENT_COPY}</span>
          </label>
          {error ? <p className="text-sm text-pine-deep">{error}</p> : null}
          <button
            type="submit"
            disabled={pending || !consent}
            className="w-full rounded-full bg-pine px-5 py-3 text-sm text-cream disabled:opacity-50"
          >
            {pending ? "Sending code…" : "Send WhatsApp code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="mt-8 space-y-4">
          <p className="text-sm leading-6">
            Enter the 6-digit code sent to WhatsApp ending {phoneLast4}. It expires in 5 minutes.
          </p>
          {devCode ? (
            <p className="rounded-2xl bg-sand px-4 py-3 text-sm">
              Local testing code: <span className="font-medium">{devCode}</span>
            </p>
          ) : null}
          <label className="block text-sm">
            Code
            <input
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              className="mt-1 w-full rounded-2xl border border-sand bg-paper px-4 py-3 tracking-[0.4em]"
            />
          </label>
          {error ? <p className="text-sm text-pine-deep">{error}</p> : null}
          <button
            type="submit"
            disabled={pending || code.length !== 6}
            className="w-full rounded-full bg-pine px-5 py-3 text-sm text-cream disabled:opacity-50"
          >
            {pending ? "Checking…" : "Open menu"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => sendCode()}
            className="w-full rounded-full border border-sand bg-paper px-5 py-3 text-sm disabled:opacity-50"
          >
            Send a new code
          </button>
        </form>
      )}
    </section>
  );
}
