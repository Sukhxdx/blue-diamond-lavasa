"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type StaffRow = {
  id: string;
  name: string;
  email: string;
  disabled: boolean;
};

export function StaffManager({ staff }: { staff: StaffRow[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function createStaff(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? "The account could not be created.");
        return;
      }
      setName("");
      setEmail("");
      setPassword("");
      router.refresh();
    } catch {
      setError("The account could not be created.");
    } finally {
      setPending(false);
    }
  }

  async function toggle(id: string, disabled: boolean) {
    setError("");
    const response = await fetch(`/api/admin/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disabled }),
    });
    const body = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(body.error ?? "The account could not be updated.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={createStaff} className="space-y-3 rounded-3xl border border-sand bg-paper p-4">
        <h2 className="font-serif text-3xl">New staff account</h2>
        <p className="text-sm text-muted">Password: 12+ characters, with upper, lower, a digit, and a symbol.</p>
        <label className="block text-sm">
          Name
          <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded-2xl border border-sand px-3 py-2" />
        </label>
        <label className="block text-sm">
          Email
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-2xl border border-sand px-3 py-2" />
        </label>
        <label className="block text-sm">
          Password
          <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-2xl border border-sand px-3 py-2" />
        </label>
        {error ? <p className="text-sm text-pine-deep">{error}</p> : null}
        <button type="submit" disabled={pending} className="rounded-full bg-pine px-4 py-2 text-sm text-cream disabled:opacity-50">
          {pending ? "Creating…" : "Create staff"}
        </button>
      </form>

      <ul className="divide-y divide-sand rounded-3xl border border-sand bg-paper">
        {staff.map((person) => (
          <li key={person.id} className="flex items-center justify-between gap-3 px-4 py-4">
            <div>
              <p className="font-medium">{person.name}</p>
              <p className="text-sm text-muted">{person.email}</p>
              {person.disabled ? <p className="text-xs uppercase tracking-wide">Disabled</p> : null}
            </div>
            <button
              type="button"
              onClick={() => toggle(person.id, !person.disabled)}
              className="rounded-full border border-sand px-4 py-2 text-sm"
            >
              {person.disabled ? "Enable" : "Disable"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
