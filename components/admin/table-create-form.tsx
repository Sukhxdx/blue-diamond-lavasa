"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TableCreateForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, label }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? "The table could not be added.");
        return;
      }
      setCode("");
      setLabel("");
      router.refresh();
    } catch {
      setError("The table could not be added.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-3xl border border-sand bg-paper p-4 sm:grid-cols-[1fr_1fr_auto]">
      <label className="text-sm">
        Code
        <input
          required
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="T11"
          className="mt-1 w-full rounded-2xl border border-sand px-3 py-2"
        />
      </label>
      <label className="text-sm">
        Label
        <input
          required
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Table 11"
          className="mt-1 w-full rounded-2xl border border-sand px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="self-end rounded-full bg-pine px-4 py-2 text-sm text-cream disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add table"}
      </button>
      {error ? <p className="text-sm text-pine-deep sm:col-span-3">{error}</p> : null}
    </form>
  );
}
