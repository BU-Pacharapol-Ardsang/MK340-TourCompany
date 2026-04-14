"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type AdminStatus = "saved" | "deleted" | "error";

type AdminStatusToastProps = {
  status?: string;
  id?: string;
  message?: string;
};

function getStatusMeta(status: AdminStatus, id?: string, message?: string) {
  if (status === "saved") {
    return {
      title: "บันทึกสำเร็จ",
      description: `อัปเดตข้อมูลทัวร์เรียบร้อย${id ? `: ${id}` : ""}`,
      className:
        "border-[rgba(29,95,191,0.32)] bg-[rgba(74,150,255,0.96)] text-white",
      durationMs: 2800,
    };
  }

  if (status === "deleted") {
    return {
      title: "ลบสำเร็จ",
      description: `ลบทัวร์เรียบร้อย${id ? `: ${id}` : ""}`,
      className:
        "border-[rgba(11,143,216,0.36)] bg-[rgba(19,131,211,0.94)] text-white",
      durationMs: 2800,
    };
  }

  return {
    title: "ไม่สำเร็จ",
    description: message ?? "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
    className:
      "border-[rgba(181,73,73,0.34)] bg-[rgba(181,73,73,0.95)] text-white",
    durationMs: 4200,
  };
}

export default function AdminStatusToast({ status, id, message }: AdminStatusToastProps) {
  const router = useRouter();
  const pathname = usePathname();

  const normalizedStatus =
    status === "saved" || status === "deleted" || status === "error"
      ? (status as AdminStatus)
      : null;

  const [visible, setVisible] = useState(Boolean(normalizedStatus));

  useEffect(() => {
    setVisible(Boolean(normalizedStatus));
  }, [normalizedStatus, id, message]);

  const meta = useMemo(() => {
    if (!normalizedStatus) {
      return null;
    }

    return getStatusMeta(normalizedStatus, id, message);
  }, [normalizedStatus, id, message]);

  useEffect(() => {
    if (!meta || !visible) {
      return;
    }

    const hideTimer = window.setTimeout(() => {
      setVisible(false);
    }, meta.durationMs);

    const clearQueryTimer = window.setTimeout(() => {
      router.replace(pathname, { scroll: false });
    }, meta.durationMs + 250);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(clearQueryTimer);
    };
  }, [meta, visible, pathname, router]);

  if (!meta) {
    return null;
  }

  return (
    <div
      className={`fixed right-4 top-4 z-[70] w-[min(92vw,420px)] transform transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`rounded-2xl border px-4 py-4 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.45)] backdrop-blur ${meta.className}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">{meta.title}</p>
            <p className="mt-1 text-sm/6 opacity-95">{meta.description}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setVisible(false);
              router.replace(pathname, { scroll: false });
            }}
            className="rounded-lg bg-white/18 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-white/28"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
