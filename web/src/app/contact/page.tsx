"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { IconCheck, IconSparkles } from "@/components/Icons";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Contact & Submit a Deal
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-xs sm:text-sm text-[var(--text-secondary)]">
            Found an unlisted Coursera promotion or have questions about CourseDrop? Let us know.
          </p>
        </div>

        <div className="editorial-card p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-free-soft)] text-[var(--accent-free-soft-text)] mb-4">
                <IconCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Message Received</h3>
              <p className="mt-2 text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                Thank you for reaching out. Our team verifies submissions regularly.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="rounded-xl bg-[var(--accent-sage)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition-all"
                >
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-sage)] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-sage)] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                  Subject / Deal Link
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. New 50% discount on Deep Learning specialization"
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-sage)] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                  Details or Promo Code
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details, validity dates, or discount code..."
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-sage)] focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[var(--accent-sage)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] transition-all shadow-xs"
              >
                Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
