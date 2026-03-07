"use client";

import { useState } from "react";
import { Twitter, Users, ExternalLink, Filter } from "lucide-react";

export default function BuildersConnectPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Ecosystem", "DeFi", "NFTs", "Tooling"];

  const builders = [
    {
      id: 1,
      name: "Stacks Developers",
      handle: "@StacksDevs",
      role: "Official Developer Hub",
      description:
        "The official home for developers building on Bitcoin using Stacks. Tutorials, updates, and ecosystem news.",
      url: "https://x.com/StacksDevs?s=20",
      followers: "12.5K",
      avatarGradient: "from-brand-orange to-red-500",
      initials: "SD",
      category: "Ecosystem",
    },
    {
      id: 2,
      name: "Stacks Org",
      handle: "@StacksOrg",
      role: "Ecosystem Updates",
      description:
        "Official real-time updates from the Stacks ecosystem, highlighting the transition towards a Bitcoin economy.",
      url: "https://x.com/StacksOrg?s=20",
      followers: "154K",
      avatarGradient: "from-purple-500 to-indigo-500",
      initials: "SO",
      category: "Ecosystem",
    },
    {
      id: 3,
      name: "Muneeb Ali",
      handle: "@muneeb",
      role: "Co-creator of Stacks",
      description:
        "CEO of Trust Machines. Co-creator of Stacks. Building Bitcoin L2 ecosystem for web3 applications.",
      url: "https://twitter.com/muneeb",
      followers: "185K",
      avatarGradient: "from-cyan-500 to-blue-600",
      initials: "MA",
      category: "Ecosystem",
    },
    {
      id: 4,
      name: "Alex Dev",
      handle: "@alex_btc",
      role: "DeFi Builder",
      description:
        "Smart contract engineer creating liquidity protocols on Stacks. Contributor to major Clarity open source repos.",
      url: "#",
      followers: "4.2K",
      avatarGradient: "from-emerald-400 to-teal-600",
      initials: "AD",
      category: "DeFi",
    },
    {
      id: 5,
      name: "Sarah Chen",
      handle: "@sarah_clarity",
      role: "NFT Innovator",
      description:
        "Developer behind several successful SIP-009 NFT collections. Passionate about bringing creators to Bitcoin.",
      url: "#",
      followers: "8.9K",
      avatarGradient: "from-pink-500 to-rose-500",
      initials: "SC",
      category: "NFTs",
    },
    {
      id: 6,
      name: "Hiro Systems",
      handle: "@hirosystems",
      role: "Developer Tooling",
      description:
        "Building developer tools for the Bitcoin economy. Creators of the Clarinet environment and Leather wallet.",
      url: "https://twitter.com/hirosystems",
      followers: "42K",
      avatarGradient: "from-orange-400 to-amber-600",
      initials: "HS",
      category: "Tooling",
    },
  ];

  const filteredBuilders =
    activeFilter === "All"
      ? builders
      : builders.filter((b) => b.category === activeFilter);

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
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        <span className="flex items-center gap-1.5 text-sm text-gray-500 mr-2">
          <Filter className="w-4 h-4" /> Filters:
        </span>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === category
                ? "bg-brand-orange text-white shadow-[0_0_15px_rgba(245,131,32,0.3)] border-brand-orange"
                : "bg-[#1A1A24] text-gray-400 border border-gray-800 hover:border-gray-500 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid of Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuilders.map((builder) => (
          <div
            key={builder.id}
            className="group bg-[#1A1A24]/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm hover:border-gray-600 transition-all duration-300 relative overflow-hidden"
          >
            {/* Subtle background glow on hover */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${builder.avatarGradient} opacity-0 group-hover:opacity-5 blur-2xl rounded-full transition-opacity duration-300`}
            ></div>

            <div className="flex items-start justify-between mb-4 relative">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-full bg-linear-to-br ${builder.avatarGradient} p-0.5 shadow-lg`}
                >
                  <div className="w-full h-full bg-[#1A1A24] rounded-full flex items-center justify-center text-lg font-bold text-white">
                    {builder.initials}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-orange transition-colors">
                    {builder.name}
                  </h3>
                  <a
                    href={builder.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-[#1DA1F2] transition-colors flex items-center gap-1"
                  >
                    {builder.handle}
                  </a>
                </div>
              </div>
              <a
                href={builder.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center text-gray-400 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300"
                aria-label={`Follow ${builder.name} on Twitter`}
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>

            <div className="mb-6 relative">
              <span className="text-xs font-semibold text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded border border-brand-orange/20 mb-3 inline-block">
                {builder.role}
              </span>
              <p className="text-sm text-gray-400 leading-relaxed min-h-[60px]">
                {builder.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800 border-dashed relative">
              <div className="text-sm text-gray-500">
                <span className="text-white font-semibold">
                  {builder.followers}
                </span>{" "}
                Followers
              </div>
              <a
                href={builder.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-brand-orange hover:text-orange-400 transition-colors flex items-center gap-1 group/link"
              >
                View Profile
                <ExternalLink className="w-4 h-4 ml-0.5 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-16 text-center bg-linear-to-r from-brand-orange/10 via-purple-500/10 to-brand-orange/10 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-2">
          Are you building on Stacks?
        </h3>
        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
          Share your progress, attach your projects to your profile, and connect
          with other builders to be featured in the global gallery.
        </p>
        <button className="bg-white text-black hover:bg-gray-200 font-medium px-6 py-2.5 rounded-lg transition-colors inline-block">
          Submit Profile
        </button>
      </div>
    </main>
  );
}
