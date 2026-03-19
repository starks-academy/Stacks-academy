"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  FolderOpen,
  Clock,
  CheckCircle2,
  Loader2,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { buildersApi, BuilderProfile } from "@/lib/api/builders";
import { galleryApi, GalleryProject } from "@/lib/api/gallery";

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  note,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  note?: string;
}) {
  return (
    <div className="bg-[#14152C] border border-[#2A2B4A] rounded-2xl p-6 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[#8E90B0] text-sm mb-1">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
        {note && <p className="text-[#8E90B0] text-xs mt-1">{note}</p>}
      </div>
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-white text-lg font-bold">{title}</h2>
      <span className="text-xs text-[#8E90B0] bg-[#2A2B4A] px-3 py-1 rounded-full">
        {count} items
      </span>
    </div>
  );
}

// ── Pending Banner ────────────────────────────────────────────────────────────

function PendingBanner({ label }: { label: string }) {
  return (
    <div className="border border-dashed border-[#2A2B4A] rounded-2xl p-8 text-center text-[#8E90B0]">
      <Clock className="w-8 h-8 mx-auto mb-3 opacity-40" />
      <p className="font-medium text-sm">{label} — pending moderation queue</p>
      <p className="text-xs mt-1 opacity-60">
        Approve / Reject actions will be available once the backend admin
        endpoints are ready.
      </p>
    </div>
  );
}

// ── Builder Row ───────────────────────────────────────────────────────────────

function BuilderRow({ builder }: { builder: BuilderProfile }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#2A2B4A]/50 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center text-xs font-bold shrink-0">
          {builder.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">
            {builder.name}
          </p>
          <p className="text-[#8E90B0] text-xs truncate">
            {builder.handle} · {builder.role}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <span className="text-xs bg-[#2A2B4A] text-[#8E90B0] px-2 py-0.5 rounded-full">
          {builder.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-green-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
        </span>
        {(builder.twitterUrl || builder.websiteUrl) && (
          <a
            href={builder.twitterUrl || builder.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8E90B0] hover:text-brand-orange transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

// ── Project Row ───────────────────────────────────────────────────────────────

function ProjectRow({ project }: { project: GalleryProject }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#2A2B4A]/50 last:border-0">
      <div className="min-w-0">
        <p className="text-white text-sm font-medium truncate">
          {project.title}
        </p>
        <p className="text-[#8E90B0] text-xs truncate max-w-xs">
          {project.description}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <span className="text-xs bg-[#2A2B4A] text-[#8E90B0] px-2 py-0.5 rounded-full">
          {project.category}
        </span>
        <span className="text-xs text-[#8E90B0]">▲ {project.upvotes}</span>
        <span className="flex items-center gap-1 text-xs text-green-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
        </span>
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8E90B0] hover:text-brand-orange transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [builders, setBuilders] = useState<BuilderProfile[]>([]);
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Redirect non-admins
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return;
    Promise.allSettled([buildersApi.getBuilders(), galleryApi.getAll(1, 50)])
      .then(([b, g]) => {
        if (b.status === "fulfilled")
          setBuilders(Array.isArray(b.value) ? b.value : []);
        if (g.status === "fulfilled") {
          const val = g.value as { data?: GalleryProject[] } | GalleryProject[];
          setProjects(Array.isArray(val) ? val : (val?.data ?? []));
        }
      })
      .finally(() => setLoadingData(false));
  }, [isAuthenticated, user]);

  if (isLoading || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0A0B1A] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B1A] pt-28 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-[#8E90B0] text-sm">
            Logged in as{" "}
            <span className="text-brand-orange">
              {user.displayName || user.walletAddress.slice(0, 12) + "…"}
            </span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Approved Builders"
          value={loadingData ? "—" : builders.length}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          label="Approved Projects"
          value={loadingData ? "—" : projects.length}
          icon={<FolderOpen className="w-5 h-5" />}
        />
        <StatCard
          label="Pending Builders"
          value="—"
          icon={<Clock className="w-5 h-5" />}
          note="Requires backend endpoint"
        />
        <StatCard
          label="Pending Projects"
          value="—"
          icon={<Clock className="w-5 h-5" />}
          note="Requires backend endpoint"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Builders (placeholder) */}
        <div className="bg-[#14152C] border border-[#2A2B4A] rounded-2xl p-6">
          <SectionHeader title="Pending Builder Profiles" count={0} />
          <PendingBanner label="No pending builder profiles accessible yet" />
        </div>

        {/* Pending Projects (placeholder) */}
        <div className="bg-[#14152C] border border-[#2A2B4A] rounded-2xl p-6">
          <SectionHeader title="Pending Gallery Projects" count={0} />
          <PendingBanner label="No pending gallery projects accessible yet" />
        </div>

        {/* Approved Builders */}
        <div className="bg-[#14152C] border border-[#2A2B4A] rounded-2xl p-6">
          <SectionHeader title="Approved Builders" count={builders.length} />
          {loadingData ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
            </div>
          ) : builders.length === 0 ? (
            <p className="text-[#8E90B0] text-sm text-center py-8">
              No approved builders yet.
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto pr-1">
              {builders.map((b) => (
                <BuilderRow key={b.id} builder={b} />
              ))}
            </div>
          )}
        </div>

        {/* Approved Projects */}
        <div className="bg-[#14152C] border border-[#2A2B4A] rounded-2xl p-6">
          <SectionHeader
            title="Approved Gallery Projects"
            count={projects.length}
          />
          {loadingData ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <p className="text-[#8E90B0] text-sm text-center py-8">
              No approved projects yet.
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto pr-1">
              {projects.map((p) => (
                <ProjectRow key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
