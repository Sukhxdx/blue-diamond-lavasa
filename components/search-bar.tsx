type SearchBarProps = {
  checkIn?: string;
  checkOut?: string;
  guests?: string;
};

export function SearchBar({ checkIn = "", checkOut = "", guests = "2" }: SearchBarProps) {
  return (
    <form
      action="/stay"
      className="grid gap-3 rounded-2xl bg-paper p-3 text-ink shadow-xl sm:grid-cols-2 lg:grid-cols-[1fr_1fr_8rem_auto] lg:items-end"
    >
      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Check-in
        </span>
        <input
          type="date"
          name="checkIn"
          defaultValue={checkIn}
          required
          className="h-12 w-full rounded-xl border border-sand bg-white px-3 text-base"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Check-out
        </span>
        <input
          type="date"
          name="checkOut"
          defaultValue={checkOut}
          required
          className="h-12 w-full rounded-xl border border-sand bg-white px-3 text-base"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Guests
        </span>
        <input
          type="number"
          name="guests"
          min={1}
          max={30}
          defaultValue={guests}
          required
          inputMode="numeric"
          className="h-12 w-full rounded-xl border border-sand bg-white px-3 text-base"
        />
      </label>
      <button
        type="submit"
        className="h-12 rounded-xl bg-brass px-5 text-sm font-medium text-white hover:bg-[#86633a]"
      >
        Search stay
      </button>
    </form>
  );
}
