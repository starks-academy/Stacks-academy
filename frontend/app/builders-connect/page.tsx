"use client";

import { useEffect, useState } from "react";
import {
  Twitter,
  Globe,
  ExternalLink,
  Filter,
  Users,
  Loader2,
  PlusCircle,
  X,
  Check,
} from "lucide-react";
import {
  buildersApi,
  BuilderProfile,
  BuilderCategory,
  SubmitBuilderDto,
} from "@/lib/api/builders";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES: (BuilderCategory | "All")[] = [
  "All",
  "Ecosystem",
  "DeFi",
  "NFTs",
  "Tooling",
  "Education",
  "Infrastructure",
];

const GRADIENT_CLASSES = [
  "from-brand-orange to-red-500",
  "from-purple-500 to-indigo-500",
  "from-cyan-500 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-pink-500 to-rose-500",
  "from-orange-400 to-amber-600",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getGradient(id: string) {
  const idx =
    id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    GRADIENT_CLASSES.length;
  return GRADIENT_CLASSES[idx];
}

export default function BuildersConnectPage() {
  const { isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = useState<BuilderCategory | "All">(
    "All",
  );
  const [builders, setBuilders] = useState<BuilderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [form, setForm] = useState<SubmitBuilderDto>({
    name: "",
    handle: "",
    role: "",
    description: "",
    category: "Ecosystem",
    twitterUrl: "",
    websiteUrl: "",
  });

  useEffect(() => {
    const cat =
      activeFilter === "All" ? undefined : (activeFilter as BuilderCategory);
    setLoading(true);
    buildersApi
      .getBuilders(cat)
      .then(setBuilders)
      .catch(() => setBuilders([]))
      .finally(() => setLoading(false));
  }, [activeFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await buildersApi.submitProfile(form);
      setSubmitSuccess(true);
      setShowSubmitModal(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Builders Connect
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Follow the leading developers, organizations, and visionaries building
          the future of the Bitcoin economy on Stacks.
        </p>
        <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange px-4 py-2 rounded-full text-sm font-medium">
          <Users className="w-4 h-4" />
          Join the conversation
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <span className="flex items-center gap-1.5 text-sm text-gray-500 mr-2">
          <Filter className="w-4 h-4" /> Filters:
        </span>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === category
                ? "bg-brand-orange text-white shadow-[0_0_15px_rgba(245,131,32,0.3)]"
                : "bg-[#1A1A24] text-gray-400 border border-gray-800 hover:border-gray-500 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Builder Cards */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
        </div>
      ) : builders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No builders found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builders.map((builder) => {
            const gradientClass = getGradient(builder.id);
            const initials = getInitials(builder.name);

            return (
              <div
                key={builder.id}
                className="group bg-[#1A1A24]/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm hover:border-gray-600 transition-all duration-300 relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${gradientClass} opacity-0 group-hover:opacity-5 blur-2xl rounded-full transition-opacity duration-300`}
                />

                <div className="flex items-start justify-between mb-4 relative">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-full bg-linear-to-br ${gradientClass} p-0.5 shadow-lg`}
                    >
                      <div className="w-full h-full bg-[#1A1A24] rounded-full flex items-center justify-center text-lg font-bold text-white">
                        {initials}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-brand-orange transition-colors">
                        {builder.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {builder.handle}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {builder.twitterUrl && (
                      <a
                        href={builder.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-gray-800/50 flex items-center justify-center text-gray-400 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300"
                        aria-label={`${builder.name} on Twitter`}
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {builder.websiteUrl && (
                      <a
                        href={builder.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-gray-800/50 flex items-center justify-center text-gray-400 hover:bg-brand-orange hover:text-white transition-all duration-300"
                        aria-label={`${builder.name}'s website`}
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="mb-4 relative">
                  <span className="text-xs font-semibold text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded border border-brand-orange/20 mb-3 inline-block">
                    {builder.role}
                  </span>
                  <p className="text-sm text-gray-400 leading-relaxed min-h-[60px]">
                    {builder.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800 border-dashed relative">
                  <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded-full">
                    {builder.category}
                  </span>
                  <a
                    href={builder.twitterUrl || builder.websiteUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-brand-orange hover:text-orange-400 transition-colors flex items-center gap-1 group/link"
                  >
                    View Profile
                    <ExternalLink className="w-4 h-4 ml-0.5 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submit CTA */}
      <div className="mt-16 text-center bg-linear-to-r from-brand-orange/10 via-purple-500/10 to-brand-orange/10 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-2">
          Are you building on Stacks?
        </h3>
        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
          Submit your profile to be featured in the builder ecosystem directory.
          Requires wallet authentication.
        </p>
        {submitSuccess ? (
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-3 rounded-lg font-medium">
            <Check className="w-4 h-4" /> Profile submitted — pending review
          </div>
        ) : (
          <button
            onClick={() => setShowSubmitModal(true)}
            disabled={!isAuthenticated}
            title={
              !isAuthenticated
                ? "Connect your wallet to submit a profile"
                : undefined
            }
            className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-200 font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="w-4 h-4" />
            Submit Profile
          </button>
        )}
        {!isAuthenticated && (
          <p className="text-xs text-gray-600 mt-3">
            Connect your Stacks wallet to submit a profile.
          </p>
        )}
      </div>

      {/* Submit Profile Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSubmitModal(false)}
          />
          <div className="relative bg-[#1A1A24] border border-gray-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                Submit Builder Profile
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                  {submitError}
                </p>
              )}

              {[
                { label: "Name", key: "name", placeholder: "Your full name" },
                { label: "Handle", key: "handle", placeholder: "@yourhandle" },
                {
                  label: "Role",
                  key: "role",
                  placeholder: "e.g. Smart Contract Engineer",
                },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={placeholder}
                    value={form[key as keyof SubmitBuilderDto] as string}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full bg-[#0A0B1A] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-orange transition-colors placeholder:text-gray-600"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  required
                  placeholder="Tell the community about what you're building…"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="w-full bg-[#0A0B1A] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-orange transition-colors placeholder:text-gray-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      category: e.target.value as BuilderCategory,
                    }))
                  }
                  className="w-full bg-[#0A0B1A] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-orange transition-colors"
                >
                  {(
                    CATEGORIES.filter((c) => c !== "All") as BuilderCategory[]
                  ).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {[
                {
                  label: "Twitter URL (optional)",
                  key: "twitterUrl",
                  placeholder: "https://twitter.com/yourhandle",
                },
                {
                  label: "Website URL (optional)",
                  key: "websiteUrl",
                  placeholder: "https://yoursite.com",
                },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    {label}
                  </label>
                  <input
                    type="url"
                    placeholder={placeholder}
                    value={
                      (form[key as keyof SubmitBuilderDto] as string) || ""
                    }
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full bg-[#0A0B1A] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-orange transition-colors placeholder:text-gray-600"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg bg-brand-orange hover:bg-orange-500 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit for Review"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
