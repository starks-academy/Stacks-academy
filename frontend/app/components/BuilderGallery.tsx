import { Heart, Twitter, Github } from "lucide-react";

export default function BuilderGallery() {
  const projects = [
    {
      title: "DeFi Lending Protocol",
      likes: 242,
      tag: "DeFi",
      gradient: "from-blue-600 to-cyan-400",
      builder: {
        name: "Alex Dev",
        avatar: "AD",
        twitter: "https://twitter.com",
        github: "https://github.com",
      },
    },
    {
      title: "NFT Marketplace",
      likes: 184,
      tag: "NFT",
      gradient: "from-purple-600 to-pink-500",
      builder: {
        name: "Sarah Chen",
        avatar: "SC",
        twitter: "https://twitter.com",
        github: "https://github.com",
      },
    },
    {
      title: "DAO Governance Tool",
      likes: 156,
      tag: "DAO",
      gradient: "from-orange-500 to-yellow-400",
      builder: {
        name: "Mike Jordan",
        avatar: "MJ",
        twitter: "https://twitter.com",
        github: "https://github.com",
      },
    },
    {
      title: "Token Swap dApp",
      likes: 142,
      tag: "DeFi",
      gradient: "from-green-500 to-emerald-300",
      builder: {
        name: "Elena R.",
        avatar: "ER",
        twitter: "https://twitter.com",
        github: "https://github.com",
      },
    },
    {
      title: "Staking Rewards Tracker",
      likes: 128,
      tag: "Staking",
      gradient: "from-indigo-600 to-blue-400",
      builder: {
        name: "David Kim",
        avatar: "DK",
        twitter: "https://twitter.com",
        github: "https://github.com",
      },
    },
    {
      title: "Community Badge System",
      likes: 115,
      tag: "Social",
      gradient: "from-rose-500 to-orange-400",
      builder: {
        name: "Lisa Wang",
        avatar: "LW",
        twitter: "https://twitter.com",
        github: "https://github.com",
      },
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
      <h2 className="text-3xl font-bold text-white mb-12">Builder Gallery</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-card-bg border border-card-border rounded-xl overflow-hidden hover:border-[#383A5D] transition-colors flex flex-col group text-left"
          >
            {/* Image Placeholder */}
            <div
              className={`w-full h-48 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}
            >
              {/* Optional minimal styling for the thumbnail */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] w-full h-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-black/20 rounded-lg border border-white/20 shadow-xl backdrop-blur-md"></div>
            </div>

            <div className="p-5 flex-grow flex flex-col justify-between hidden-border">
              <div>
                <h3 className="text-white font-semibold mb-3 text-lg">
                  {project.title}
                </h3>

                {/* Builder Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center text-xs font-bold text-brand-orange">
                      {project.builder.avatar}
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                      {project.builder.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={project.builder.twitter}
                      className="text-gray-500 hover:text-[#1DA1F2] transition-colors"
                      aria-label={`Twitter profile for ${project.builder.name}`}
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a
                      href={project.builder.github}
                      className="text-gray-500 hover:text-white transition-colors"
                      aria-label={`GitHub profile for ${project.builder.name}`}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="text-xs font-medium text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20">
                  {project.tag}
                </span>

                <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-red-400 transition-colors">
                  <Heart fill="currentColor" className="w-4 h-4" />
                  <span className="text-sm font-medium">{project.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
