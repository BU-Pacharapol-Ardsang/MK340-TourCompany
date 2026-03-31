"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BrandMark from "./BrandMark";
import { MessageIcon } from "./CtaIcons";

const navLinks = [
  { href: "#packages", label: "แพ็กเกจ" },
  { href: "#why-us", label: "เหตุผลที่เลือกเรา" },
  { href: "#contact", label: "ปรึกษาทริป" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "px-4 py-3" : "px-4 py-5"
      }`}
    >
      <div
        className={`relative isolate mx-auto flex max-w-7xl items-center justify-between overflow-hidden rounded-full border px-5 transition-all duration-300 sm:px-6 ${
          scrolled
            ? "glass-panel border-[color:var(--line)] py-3 shadow-[0_20px_48px_-30px_rgba(8,29,61,0.32)]"
            : "border-white/18 bg-white/10 py-3 shadow-[0_24px_54px_-34px_rgba(8,29,61,0.5)]"
        }`}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${
            scrolled
              ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.3)_0%,rgba(240,247,255,0.12)_100%)]"
              : "bg-[linear-gradient(90deg,rgba(255,255,255,0.54)_0%,rgba(239,246,255,0.42)_50%,rgba(255,255,255,0.5)_100%)] backdrop-blur-xl"
          }`}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[1px] rounded-full border border-white/20"
        />

        <Link href="/" className="relative z-10 flex items-center gap-3">
          <BrandMark size="sm" showWordmark />
          <span
            className={`hidden text-xs uppercase tracking-[0.32em] transition-colors sm:block ${
              scrolled ? "text-[color:var(--muted)]" : "text-[color:#315782]"
            }`}
          >
            Travel brighter, remember clearly.
          </span>
        </Link>

        <div className="relative z-10 hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[color:var(--lavender-deep)] ${
                scrolled ? "text-[color:var(--foreground)]" : "text-[color:#1f4065]"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://line.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--lavender-deep)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[color:var(--earth-deep)]"
            >
            <MessageIcon className="h-4 w-4" />
            คุยแผนทริป
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-10 flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block h-0.5 w-6 rounded transition-colors ${
                scrolled ? "bg-[color:var(--foreground)]" : "bg-[color:#234266]"
              }`}
            />
          ))}
        </button>
      </div>

      {menuOpen && (
        <div className="mx-4 mt-3 rounded-[28px] border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[0_24px_64px_-42px_rgba(21,74,136,0.34)] md:hidden">
          <div className="flex flex-col gap-4 px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-medium text-[color:var(--foreground)]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--lavender-deep)] px-5 py-2.5 text-center font-semibold text-white"
            >
              <MessageIcon className="h-4 w-4" />
              คุยแผนทริป
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
