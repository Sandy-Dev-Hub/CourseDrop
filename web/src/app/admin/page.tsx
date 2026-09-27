"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";

export default function AdminPage() {
  const [apiKey, setApiKey] = useState("");
  const [activeTab, setActiveTab] = useState<"jobs" | "offers" | "audit">("jobs");
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const triggerJob = async (jobName: string) => {
    if (!apiKey) {
      alert("Please enter the Admin API key first.");
      return;
    }
    setLoading(true);
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
        setJobStatus(`❌ Error (${res.status}): ${data.detail || "Failed"}`);
      } else {
        setJobStatus(`✅ Success: ${data.message}`);
      }
    } catch (err) {
      setJobStatus(`❌ Network error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100">
      <Navbar />

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">CourseDrop Admin Portal</h1>
            <p className="text-xs text-gray-400 mt-1">
              Trigger background sync jobs, review flagged deals, and view audit events.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="password"
              placeholder="Admin API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-gray-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === "jobs"
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Maintenance Jobs
          </button>
        </div>

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                <h3 className="text-sm font-bold text-white">Catalog Sync</h3>
                <p className="text-xs text-gray-400 mt-1 mb-4">
                  Fetches courses from the public Coursera catalog and updates metadata.
                </p>
                <button
                  disabled={loading}
                  onClick={() => triggerJob("sync_catalog")}
                  className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  Run sync_catalog
                </button>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                <h3 className="text-sm font-bold text-white">Delisting Check</h3>
                <p className="text-xs text-gray-400 mt-1 mb-4">
                  Verifies course availability by slug. Delists after 3 consecutive 404s.
                </p>
                <button
                  disabled={loading}
                  onClick={() => triggerJob("check_delisting")}
                  className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  Run check_delisting
                </button>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                <h3 className="text-sm font-bold text-white">Offer Sync (Impact Feed)</h3>
                <p className="text-xs text-gray-400 mt-1 mb-4">
                  Ingests deals from configured affiliate feed and validates tracking hosts.
                </p>
                <button
                  disabled={loading}
                  onClick={() => triggerJob("sync_offers")}
                  className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  Run sync_offers
                </button>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                <h3 className="text-sm font-bold text-white">Reverify / Expiry Sweep</h3>
                <p className="text-xs text-gray-400 mt-1 mb-4">
                  Activates scheduled offers whose start date arrived and expires past deals.
                </p>
                <button
                  disabled={loading}
                  onClick={() => triggerJob("reverify")}
                  className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  Run reverify
                </button>
              </div>
            </div>

            {jobStatus && (
              <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-xs font-mono text-gray-200">
                {jobStatus}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
