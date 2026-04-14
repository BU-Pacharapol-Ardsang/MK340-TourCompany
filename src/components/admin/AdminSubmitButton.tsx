"use client";

import { useFormStatus } from "react-dom";

type AdminSubmitButtonProps = {
  idleLabel: string;
  pendingLabel?: string;
};

export default function AdminSubmitButton({
  idleLabel,
  pendingLabel = "กำลังบันทึก...",
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-[color:var(--lavender-deep)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[color:var(--earth-deep)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
