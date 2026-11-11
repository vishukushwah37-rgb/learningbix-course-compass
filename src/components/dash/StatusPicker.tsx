import { useState } from "react";
import { selectClass } from "@/components/site/FormField";
import { cn } from "@/lib/utils";

/** Small inline dropdown that saves a row's status the moment it changes. */
export function StatusPicker({ value, options, onSave, label, className }: { value: string; options: readonly string[]; onSave: (v: string) => Promise<void>; label: string; className?: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <select
      aria-label={label}
      className={cn(selectClass, "h-8 w-auto min-w-32 text-xs font-medium", className)}
      value={value}
      disabled={busy}
      onChange={async (e) => {
        const next = e.target.value;
        if (next === value) return;
        setBusy(true);
        try {
          await onSave(next);
        } finally {
          setBusy(false);
        }
      }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
