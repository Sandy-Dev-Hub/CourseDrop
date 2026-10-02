"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { IconAlertCircle, IconCheck, IconRefresh, IconShieldCheck } from "@/components/Icons";

export default function AdminPage() {
  const [apiKey, setApiKey] = useState("");
  const [activeTab, setActiveTab] = useState<"jobs" | "offers" | "audit">("jobs");
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [loadingJob, setLoadingJob] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const triggerJob = async (jobName: string) => {
    if (!apiKey) {
      alert("Please enter the Admin API key first.");
      return;
    }
    setLoadingJob(jobName);
    setJobStatus(`Running ${jobName}...`);
    try {
      const res = await fetch(`${apiBase}/api/v1/admin/jobs/${jobName}/run`, {
        method: "POST",
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setJobStatus(`Error (${res.status}): ${data.detail || "Failed"}`);
      } else {
        setJobStatus(`Success: ${data.message || "Job triggered successfully."}`);
      }
    } catch (err) {
      setJobStatus(`Network error: ${err}`);
    } finally {
      setLoadingJob(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 pt-28 pb-14 sm:pt-32 sm:pb-16">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-sage-soft)] text-[var(--accent-sage-soft-text)] border border-[var(--border-subtle)]">
                <IconShieldCheck size={16} />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                CourseDrop Admin Portal
              </h1>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Trigger background sync jobs, delisting checks, and affiliate ingest pipelines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="password"
              placeholder="Admin API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-sage)] focus:outline-none transition-all w-full sm:w-64"
            />
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-[var(--border-subtle)] pb-3 mb-6">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "jobs"
                ? "bg-[var(--accent-sage)] text-white shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
            }`}
          >
            Maintenance Jobs
          </button>
        </div>

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="editorial-card p-5">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Catalog Sync</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 mb-4 leading-relaxed">
                  Fetches courses from the public Coursera catalog and refreshes metadata.
                </p>
                <button
                  disabled={loadingJob === "sync_catalog"}
                  onClick={() => triggerJob("sync_catalog")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-sage)] px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50 active:scale-[0.98] transition-all"
                >
                  {loadingJob === "sync_catalog" ? (
                    <IconRefresh size={14} className="animate-spin" />
                  ) : null}
                  <span>Run sync_catalog</span>
                </button>
              </div>

              <div className="editorial-card p-5">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Delisting Check</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 mb-4 leading-relaxed">
                  Verifies course availability by slug. Delists offers after 3 consecutive 404s.
                </p>
                <button
                  disabled={loadingJob === "check_delisting"}
                  onClick={() => triggerJob("check_delisting")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-sage)] px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50 active:scale-[0.98] transition-all"
                >
                  {loadingJob === "check_delisting" ? (
                    <IconRefresh size={14} className="animate-spin" />
                  ) : null}
                  <span>Run check_delisting</span>
                </button>
              </div>

              <div className="editorial-card p-5">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Offer Sync (Impact Feed)</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 mb-4 leading-relaxed">
                  Ingests promotions from configured affiliate feeds and validates tracking URLs.
                </p>
                <button
                  disabled={loadingJob === "sync_offers"}
                  onClick={() => triggerJob("sync_offers")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-sage)] px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50 active:scale-[0.98] transition-all"
                >
                  {loadingJob === "sync_offers" ? (
                    <IconRefresh size={14} className="animate-spin" />
                  ) : null}
                  <span>Run sync_offers</span>
                </button>
              </div>

              <div className="editorial-card p-5">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Reverify & Expiry Sweep</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 mb-4 leading-relaxed">
                  Activates scheduled offers and transitions expired deals to inactive state.
                </p>
                <button
                  disabled={loadingJob === "reverify"}
                  onClick={() => triggerJob("reverify")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-sage)] px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50 active:scale-[0.98] transition-all"
                >
                  {loadingJob === "reverify" ? (
                    <IconRefresh size={14} className="animate-spin" />
                  ) : null}
                  <span>Run reverify</span>
                </button>
              </div>
            </div>

            {jobStatus && (
              <div
                className={`rounded-xl border p-4 text-xs font-mono transition-all ${
                  jobStatus.startsWith("Error")
                    ? "border-red-800/40 bg-red-950/20 text-red-400"
                    : jobStatus.startsWith("Success")
                    ? "border-[var(--accent-free)]/40 bg-[var(--accent-free-soft)] text-[var(--accent-free-soft-text)]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {jobStatus.startsWith("Error") ? (
                    <IconAlertCircle size={16} className="text-red-400" />
                  ) : jobStatus.startsWith("Success") ? (
                    <IconCheck size={16} className="text-[var(--accent-free)]" />
                  ) : (
                    <IconRefresh size={16} className="animate-spin text-[var(--accent-sage)]" />
                  )}
                  <span>{jobStatus}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
