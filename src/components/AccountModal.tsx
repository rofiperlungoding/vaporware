"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { saveAccount, type Account } from "@/lib/profile";
import { getSessionId } from "@/lib/session";
import { track } from "@/lib/track";
import { FEATURES } from "@/lib/config";
import { hasConsent, setConsent } from "@/lib/trust";
import { useFocusTrap } from "@/lib/useFocusTrap";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AccountModal({
  pickCount,
  onClose,
  onCreated,
}: {
  pickCount: number;
  onClose: () => void;
  onCreated: (account: Account) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(hasConsent());
  const [error, setError] = useState<string | null>(null);
  const trapRef = useFocusTrap<HTMLDivElement>();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function submit() {
    if (name.trim().length < 2) {
      setError("What should we call you?");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("That email doesn't look right.");
      return;
    }
    if (FEATURES.trustLayer && !agreed) {
      setError("Tick the box so we know it's okay to save your picks.");
      return;
    }
    const account = saveAccount(name, email);
    setConsent(true);
    track("trust_consent_given", { session_id: getSessionId() });
    if (typeof pendo !== "undefined") {
      pendo.identify({
        visitor: {
          id: getSessionId(),
          email: account.email,
          full_name: account.name,
        },
      });
    }
    onCreated(account);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] flex items-center justify-center bg-[var(--color-ink)]/45 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 26, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="w-full max-w-sm border-2 border-[var(--color-ink)] bg-[var(--color-card)] p-6 shadow-hard"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Save your picks"
        ref={trapRef}
      >
        <h3 className="font-display text-xl font-bold text-[var(--color-ink)]">
          Save your picks
        </h3>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          {pickCount > 0
            ? `Claim the ${pickCount} idea${pickCount === 1 ? "" : "s"} you've judged so far.`
            : "Keep your picks tied to you as you play."}
        </p>

        <div className="mt-5 space-y-3">
          <label className="block">
            <span className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]">
              Name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex"
              className="w-full border-2 border-[var(--color-ink)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:bg-[var(--color-card)]"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]">
              Email
            </span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full border-2 border-[var(--color-ink)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:bg-[var(--color-card)]"
            />
          </label>
        </div>

        {FEATURES.trustLayer ? (
          <label className="mt-4 flex items-start gap-2 text-[12px] leading-snug text-[var(--color-ink)]">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-cash-2)]"
            />
            <span>
              Save my picks on this device. We don&apos;t sell data, and you can
              clear it anytime.
            </span>
          </label>
        ) : null}

        {error ? (
          <p className="mt-3 font-mono text-xs text-[var(--color-nope)]">{error}</p>
        ) : null}

        <button
          onClick={submit}
          className="mt-5 w-full border-2 border-[var(--color-ink)] bg-[var(--color-cash)] py-2.5 font-display text-sm font-bold text-[var(--color-card)] shadow-hard-sm transition-transform hover:-translate-y-0.5"
        >
          Create free account
        </button>
        <button
          onClick={onClose}
          className="mt-3 w-full text-center font-mono text-xs text-[var(--color-ink-soft)] underline-offset-4 hover:underline"
        >
          keep playing as a guest
        </button>

        <p className="mt-4 text-center font-mono text-[10px] leading-relaxed text-[var(--color-ink-soft)]">
          No password for now. This keeps your picks on this device — cloud sync
          across devices arrives with the hosted backend.
        </p>
      </motion.div>
    </motion.div>
  );
}
