"use client";

import { useState } from "react";

type AdminCopyLinkButtonProps = {
  value: string;
};

export default function AdminCopyLinkButton({ value }: AdminCopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1300);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1.5 font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5"
    >
      {copied ? "คัดลอกแล้ว" : "Copy URL"}
    </button>
  );
}
