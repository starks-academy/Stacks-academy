"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users, FolderOpen, Clock, CheckCircle2, XCircle,
  Loader2, ExternalLink, ShieldAlert, RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { buildersApi, BuilderProfile } from "@/lib/api/builders";
import { galleryApi, GalleryProject } from "@/lib/api/gallery";

function StatCard({ label, value, icon, note }: {
  label: string; value: number | string; icon: React.ReactNode; note?: string;
}) {
  return (
    <div className="bg-[#14152C] border border-[#2A2B4A] rounded-2xl p-6 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="text-[#8E90B0] text-sm mb-1">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
        {note && <p className="text-[#8E90B0] text-xs mt-1">{note}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-white text-lg font-bold">{title}</h2>
      <span className="text-xs text-[#8E90B0] bg-[#2A2B4A] px-3 py-1 rounded-full">{count} items</span>
    </div>
  );
}

function PendingBuilderRow({ builder, onApprove, onReject, busy }: {
  builder: BuilderProfile; onApprove: (id: string) => void; onReject: (id: string) => void; busy: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#2A2B4A]/50 last:border-0 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center text-xs font-bold shrink-0">
          {builder.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{builder.name}</p>
          <p className="text-[#8E90B0] text-xs truncate">{builder.handle} · {builder.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs bg-[#2A2B4A] text-[#8E90B0] px-2 py-0.5 rounded-full hidden sm:block">{builder.category}</span>
        <button onClick={() => onApprove(builder.id)} disabled={busy}
          className="flex items-center gap-1 text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50">
          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
        </button>
        <button onClick={() => onReject(builder.id)} disabled={busy}
          className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50">
          <XCircle className="w-3.5 h-3.5" /> Reject
        </button>
      </div>
    </div>
  );
}

function PendingProjectRow({ project, onApprove, onReject, busy }: {
  project: GalleryProject; onApprove: (id: string) => void; onReject: (id: string) => void; busy: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#2A2B4A]/50 last:border-0 gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-white text-sm font-medium truncate">{project.title}</p>
        <p className="text-[#8E90B0] text-xs truncate max-w-xs">{project.description}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs bg-[#2A2B4A] text-[#8E90B0] px-2 py-0.5 rounded-full hidden sm:block">{project.category}</span>
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-[#8E90B0] hover:text-brand-orange transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
        <button onClick={() => onApprove(project.id)} disabled={busy}
          className="flex items-center gap-1 text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50">
          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
        </button>
        <button onClick={() => onReject(project.id)} disabled={busy}
          className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50">
          <XCircle className="w-3.5 h-3.5" /> Reject
        </button>
      </div>
    </div>
  );
}

function ApprovedBuilderRow({ builder }: { builder: BuilderProfile }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#2A2B4A]/50 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center text-xs font-bold shrink-0">
          {builder.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{builder.name}</p>
          <p className="text-[#8E90B0] text-xs truncate">{builder.handle} · {builder.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <span className="text-xs bg-[#2A2B4A] text-[#8E90B0] px-2 py-0.5 rounded-full">{builder.category}</span>
        <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>
        {(builder.twitterUrl || builder.websiteUrl) && (
          <a href={builder.twitterUrl || builder.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[#8E90B0] hover:text-brand-orange transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

function ApprovedProjectRow({ project }: { project: GalleryProject }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#2A2B4A]/50 last:border-0">
      <div className="min-w-0">
        <p className="text-white text-sm font-medium truncate">{project.title}</p>
        <p className="text-[#8E90B0] text-xs truncate max-w-xs">{project.description}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <span className="text-xs bg-[#2A2B4A] text-[#8E90B0] px-2 py-0.5 rounded-full">{project.category}</span>
        <span className="text-xs text-[#8E90B0]">▲ {project.upvotes}</span>
        <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-[#8E90B0] hover:text-brand-orange transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [approvedBuilders, setApprovedBuilders] = useState<BuilderProfile[]>([]);
  const [pendingBuilders, setPendingBuilders] = useState<BuilderProfile[]>([]);
  const [approvedProjects, setApprovedProjects] = useState<GalleryProject[]>([]);
  const [pendingProjects, setPendingProjects] = useState<GalleryProject[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) router.replace("/");
  }, [isLoading, isAuthenticated, user, router]);

  const fetchAll = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "admin") return;
    setLoadingData(true);
    const [ab, pb, ap, pp] = await Promise.allSettled([
      buildersApi.getBuilders(),
      buildersApi.getPending(),
      galleryApi.getAll(1, 50),
      galleryApi.getPending(1, 50),
    ]);
    if (ab.status === "fulfilled") setApprovedBuilders(Array.isArray(ab.value) ? ab.value : []);
    if (pb.status === "fulfilled") setPendingBuilders(Array.isArray(pb.value) ? pb.value : []);
    if (ap.status === "fulfilled") {
      const v = ap.value as { data?: GalleryProject[] } | GalleryProject[];
      setApprovedProjects(Array.isArray(v) ? v : (v?.data ?? []));
    }
    if (pp.status === "fulfilled") {
      const v = pp.value as { data?: GalleryProject[] } | GalleryProject[];
      setPendingProjects(Array.isArray(v) ? v : (v?.data ?? []));
    }
    setLoadingData(false);
  }, [isAuthenticated, user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleApproveBuilder = async (id: string) => {
    setBusyId(id);
    try { await buildersApi.approve(id); await fetchAll(); } finally { setBusyId(null); }
  };

  const handleRejectBuilder = async (id: string) => {
    if (!confirm("Reject and delete this builder profile?")) return;
    setBusyId(id);
    try { await buildersApi.reject(id, "Does not meet community standards"); await fetchAll(); } finally { setBusyId(null); }
  };

  const handleApproveProject = async (id: string) => {
    setBusyId(id);
    try { await galleryApi.approveProject(id); await fetchAll(); } finally { setBusyId(null); }
  };

  const handleRejectProject = async (id: string) => {
    if (!confirm("Reject this project?")) return;
    setBusyId(id);
    try { await galleryApi.rejectProject(id, "Does not meet community standards"); await fetchAll(); } finally { setBusyId(null); }
  };

  if (isLoading || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0A0B1A] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B1A] pt-28 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-[#8E90B0] text-sm">
              Logged in as <span className="text-brand-orange">{user.displayName || user.walletAddress.slice(0, 12) + "…"}</span>
            </p>
          </div>
        </div>
        <button onClick={fetchAll} disabled={loadingData}
          className="flex items-center gap-2 text-sm text-[#8E90B0] hover:text-white border border-[#2A2B4A] px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loadingData ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Approved Builders" value={loadingData ? "—" : approvedBuilders.length} icon={<Users className="w-5 h-5" />} />
        <StatCard label="Approved Projects" value={loadingData ? "—" : approvedProjects.length} icon={<FolderOpen className="w-5 h-5" />} />
        <StatCard label="Pending Builders" value={loadingData ? "—" : pendingBuilders.length} icon={<Clock className="w-5 h-5" />} />
        <StatCard label="Pending Projects" value={loadingData ? "—" : pendingProjects.length} icon={<Clock className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#14152C] border border-[#2A2B4A] rounded-2xl p-6">
          <SectionHeader title="Pending Builder Profiles" count={pendingBuilders.length} />
          {loadingData ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-brand-orange animate-spin" /></div>
            : pendingBuilders.length === 0 ? <p className="text-[#8E90B0] text-sm text-center py-8">No pending builder profiles.</p>
            : <div className="max-h-80 overflow-y-auto pr-1">{pendingBuilders.map((b) => (
                <PendingBuilderRow key={b.id} builder={b} onApprove={handleApproveBuilder} onReject={handleRejectBuilder} busy={busyId === b.id} />
              ))}</div>}
        </div>

        <div className="bg-[#14152C] border border-[#2A2B4A] rounded-2xl p-6">
          <SectionHeader title="Pending Gallery Projects" count={pendingProjects.length} />
          {loadingData ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-brand-orange animate-spin" /></div>
            : pendingProjects.length === 0 ? <p className="text-[#8E90B0] text-sm text-center py-8">No pending projects.</p>
            : <div className="max-h-80 overflow-y-auto pr-1">{pendingProjects.map((p) => (
                <PendingProjectRow key={p.id} project={p} onApprove={handleApproveProject} onReject={handleRejectProject} busy={busyId === p.id} />
              ))}</div>}
        </div>

        <div className="bg-[#14152C] border border-[#2A2B4A] rounded-2xl p-6">
          <SectionHeader title="Approved Builders" count={approvedBuilders.length} />
          {loadingData ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-brand-orange animate-spin" /></div>
            : approvedBuilders.length === 0 ? <p className="text-[#8E90B0] text-sm text-center py-8">No approved builders yet.</p>
            : <div className="max-h-80 overflow-y-auto pr-1">{approvedBuilders.map((b) => <ApprovedBuilderRow key={b.id} builder={b} />)}</div>}
        </div>

        <div className="bg-[#14152C] border border-[#2A2B4A] rounded-2xl p-6">
          <SectionHeader title="Approved Gallery Projects" count={approvedProjects.length} />
          {loadingData ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-brand-orange animate-spin" /></div>
            : approvedProjects.length === 0 ? <p className="text-[#8E90B0] text-sm text-center py-8">No approved projects yet.</p>
            : <div className="max-h-80 overflow-y-auto pr-1">{approvedProjects.map((p) => <ApprovedProjectRow key={p.id} project={p} />)}</div>}
        </div>
      </div>
    </div>
  );
}
