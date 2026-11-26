"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import resources, { Resource } from "../data/resources";

const ROADMAP_GUIDES = [
  {
    name: "roadmap.sh",
    category: "Interactive roadmaps",
    description:
      "Explore visual, step-by-step roadmaps for frontend, JavaScript, and other software development paths.",
    href: "https://roadmap.sh/",
    icon: "🗺️",
  },
  {
    name: "State of JS",
    category: "Ecosystem insights",
    description:
      "Explore JavaScript ecosystem surveys and trends to learn which tools and technologies developers are using.",
    href: "https://stateofjs.com/",
    icon: "📊",
  },
  {
    name: "MDN Curriculum",
    category: "Structured curriculum",
    description:
      "Follow a structured path through essential frontend skills, from web standards to practical development.",
    href: "https://developer.mozilla.org/en-US/curriculum/",
    icon: "📚",
  },
] as const;

const QUICK_JUMP_SECTIONS = [
  { label: "Roadmaps", href: "#roadmap" },
  { label: "Engineering News", href: "#engineering" },
  { label: "Browsers", href: "#browsers" },
  { label: "Videos", href: "#videos" },
  { label: "CSS", href: "#css" },
  { label: "JavaScript", href: "#javascript" },
  { label: "Glossary", href: "#glossary" },
  { label: "Web Tools", href: "#tools" },
  { label: "Playground", href: "#playground" },
] as const;

const FILTER_TAGS = [
  { label: "All", value: "all" as const },
  { label: "Engineering", value: "engineering" as const },
  { label: "Browsers", value: "browsers" as const },
  { label: "Web Tools", value: "tools" as const },
  { label: "Videos", value: "videos" as const },
  { label: "CSS", value: "css" as const },
  { label: "JavaScript", value: "javascript" as const },
  { label: "Glossary", value: "glossary" as const },
] as const;

const BORDER_CLASSES: Record<string, string> = {
  purple: "border-purple-500 hover:border-purple-400",
  pink: "border-pink-500 hover:border-pink-400",
  orange: "border-orange-500 hover:border-orange-400",
  blue: "border-blue-500 hover:border-blue-400",
  green: "border-green-500 hover:border-green-400",
  red: "border-red-500 hover:border-red-400",
  indigo: "border-indigo-500 hover:border-indigo-400",
  teal: "border-teal-500 hover:border-teal-400",
  yellow: "border-yellow-500 hover:border-yellow-400",
  cyan: "border-cyan-500 hover:border-cyan-400",
  gray: "border-gray-500 hover:border-gray-400",
};

const StatCard = ({ number, label }: { number: string; label: string }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-white/30 transition-all">
    <div className="text-3xl font-bold text-white mb-2">{number}</div>
    <div className="text-gray-400 text-sm">{label}</div>
  </div>
);

const ColorfulLinkCard = ({
  icon,
  title,
  description,
  href,
  borderColor,
  featured = false,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  borderColor: string;
  featured?: boolean;
}) => {
  const content = (
    <>
      <div
        className={`mb-3 text-3xl transition-transform duration-300 ${
          featured ? "" : "group-hover:scale-110"
        }`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">{description}</p>
      {featured && (
        <div className="mt-4 border-t border-white/10 pt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
            Community writing
          </p>
          <p className="mb-4 max-w-xl text-sm leading-relaxed text-slate-400">
            Explore practical tutorials, solutions, and lessons shared by
            developers from across the web community.
          </p>
          <div className="flex flex-wrap gap-2">
            {["React", "CSS", "JavaScript"].map(topic => (
              <span
                key={topic}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
      <span className="mt-auto text-xs text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
        {href.startsWith("/") ? "→ Play now" : "→ Visit site"}
      </span>
    </>
  );
  const className = `flex h-full min-h-40 flex-col overflow-hidden rounded-2xl border bg-card ${BORDER_CLASSES[borderColor] ?? "border-white/10"} p-5 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-card-hover hover:shadow-xl hover:shadow-accent/10 focus-visible:-translate-y-0.5 focus-visible:scale-[1.01] focus-visible:shadow-xl focus-visible:shadow-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 motion-reduce:transition-none motion-reduce:transform-none group no-underline`;

  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  );
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState<
    "all" | Resource["section"]
  >("all");
  const [activeRoadmap, setActiveRoadmap] = useState(0);
  const [filterAnimationVersion, setFilterAnimationVersion] = useState(0);
  const [scrollRequest, setScrollRequest] = useState<{
    targetId: string;
  } | null>(null);

  useEffect(() => {
    if (!scrollRequest) return;

    const target = document.getElementById(scrollRequest.targetId);
    if (!target) {
      console.error(`Unable to find section "${scrollRequest.targetId}".`);
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [scrollRequest]);

  const updateSectionFilter = (section: "all" | Resource["section"]) => {
    setActiveSection(section);
    setFilterAnimationVersion(version => version + 1);
  };

  const handleSectionChange = (section: "all" | Resource["section"]) => {
    updateSectionFilter(section);
    const targetId = section === "all" ? "top" : section;
    setScrollRequest({ targetId });
  };

  const filteredResources = useMemo(
    () =>
      resources.filter(resource => {
        if (activeSection !== "all" && resource.section !== activeSection) {
          return false;
        }

        if (!searchTerm.trim()) {
          return true;
        }

        const query = searchTerm.toLowerCase();
        return [resource.title, resource.description, resource.section].some(
          field => field.toLowerCase().includes(query),
        );
      }),
    [activeSection, searchTerm],
  );

  const playgroundResources = useMemo(
    () =>
      resources.filter(resource => {
        if (resource.section !== "playground" || !searchTerm.trim()) {
          return resource.section === "playground";
        }

        const query = searchTerm.toLowerCase();
        return [resource.title, resource.description, resource.section].some(
          field => field.toLowerCase().includes(query),
        );
      }),
    [searchTerm],
  );

  const getSectionResources = (section: Resource["section"]) =>
    section === "playground"
      ? playgroundResources
      : filteredResources.filter(resource => resource.section === section);

  return (
    <main className="min-h-screen bg-gradient-to-b from-transparent via-slate-900/80 to-transparent text-white">
      <header className="border-b border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6">
          <a
            href="#top"
            className="text-lg font-bold tracking-tight text-white sm:text-xl"
          >
            Frontend Committee
          </a>
        </div>
      </header>
      <div className="sticky top-0 z-50 border-b border-white/10 bg-background/95 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 lg:flex-row lg:items-center">
          <label htmlFor="resource-search" className="sr-only">
            Search resources
          </label>
          <div className="relative lg:w-72 xl:w-96">
            <input
              id="resource-search"
              type="search"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Search resources"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-accent/70 focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:pb-0">
            {FILTER_TAGS.map(filter => (
              <button
                key={filter.value}
                type="button"
                onClick={() => handleSectionChange(filter.value)}
                aria-pressed={activeSection === filter.value}
                className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                  activeSection === filter.value
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/30 hover:bg-white/[0.07]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <p className="shrink-0 text-xs text-slate-400 lg:ml-auto lg:text-sm">
            {filteredResources.length} matches
          </p>
        </div>
      </div>
      {/* Hero Section */}
      <section
        id="top"
        className="mx-auto max-w-6xl scroll-mt-40 px-4 py-12 text-center sm:px-6 sm:py-16 lg:py-20 md:scroll-mt-20"
      >
        <div
          id="about"
          className="mb-5 inline-flex scroll-mt-40 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 sm:mb-6 sm:px-4 sm:py-2 sm:text-sm"
        >
          Curated for frontend developers
        </div>
        <h1 className="mb-5 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-bold leading-[1.08] tracking-tight text-transparent sm:mb-6 sm:text-6xl lg:text-7xl">
          Frontend Committee
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg md:text-xl">
          A curated guide to frontend development and the web platform, with
          trusted references, tools, learning paths, and community resources.
        </p>

        <div className="mx-auto mb-10 flex max-w-3xl flex-wrap justify-center gap-2 sm:gap-3 md:mb-12">
          {QUICK_JUMP_SECTIONS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-slate-300 transition-colors hover:border-white/30 hover:bg-white/[0.07] hover:text-white sm:px-5 sm:text-sm"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto">
          <StatCard
            number={String(resources.filter(resource => resource.section !== "playground").length)}
            label="Curated links"
          />
          <StatCard
            number={String(new Set(resources.filter(resource => resource.section !== "playground").map(resource => resource.section)).size)}
            label="Resource topics"
          />
          <StatCard number="Web" label="Frontend ecosystem focus" />
          <StatCard number="Free" label="Always open" />
        </div>

      </section>
      {/* Topic Browser */}
      <section
        aria-labelledby="topic-browser-heading"
        className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16 scroll-mt-24"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
              Quick browse
            </p>
            <h2
              id="topic-browser-heading"
              className="text-2xl font-bold text-white"
            >
              Browse by topic
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {FILTER_TAGS.filter(filter => filter.value !== "all").map(filter => (
            <a
              key={filter.value}
              href={`#${filter.value}`}
              onClick={() => updateSectionFilter(filter.value)}
              className="group flex min-h-28 flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-accent/50 hover:bg-accent/10"
            >
              <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300">
                {resources.filter(resource => resource.section === filter.value).length} resources
              </span>
              <span className="text-sm font-semibold text-white">
                {filter.label} <span aria-hidden="true" className="text-accent">→</span>
              </span>
            </a>
          ))}
        </div>
      </section>
      {/* Interactive Roadmap Module */}
      <section
        id="roadmap"
        aria-labelledby="roadmap-heading"
        className="max-w-6xl mx-auto px-6 pb-16 scroll-mt-40 md:scroll-mt-20"
      >
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
            Plan your learning
          </p>
          <h2 id="roadmap-heading" className="text-2xl font-bold text-white">
            Interactive roadmaps
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Choose a guide to explore learning paths, curriculum, and
            JavaScript ecosystem trends.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div
            role="group"
            aria-label="Choose a roadmap resource"
            className="grid gap-3 sm:grid-cols-3 md:grid-cols-1"
          >
            {ROADMAP_GUIDES.map((guide, index) => (
              <button
                key={guide.name}
                type="button"
                aria-pressed={activeRoadmap === index}
                onClick={() => setActiveRoadmap(index)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                  activeRoadmap === index
                    ? "border-accent/60 bg-accent/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                <span aria-hidden="true" className="text-xl">
                  {guide.icon}
                </span>
                <span>
                  <span className="block font-semibold">{guide.name}</span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {guide.category}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div
            aria-live="polite"
            className="flex flex-col items-start justify-center rounded-2xl border border-border-color bg-card p-6 md:p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              {ROADMAP_GUIDES[activeRoadmap].category}
            </p>
            <h3 className="mt-3 text-xl font-bold text-white">
              {ROADMAP_GUIDES[activeRoadmap].name}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              {ROADMAP_GUIDES[activeRoadmap].description}
            </p>
            <a
              href={ROADMAP_GUIDES[activeRoadmap].href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-slate-200"
            >
              Explore {ROADMAP_GUIDES[activeRoadmap].name}
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </section>
      {/* Engineering & Tech News Section */}
      <section
        id="engineering"
        className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 scroll-mt-40 md:scroll-mt-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Engineering & Tech News
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stay updated with the latest engineering insights and tech news from
            industry leaders
          </p>
        </div>

        <div
          key={filterAnimationVersion}
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${filterAnimationVersion > 0 ? "filter-fade-in" : ""}`}
        >
          {getSectionResources("engineering").map(r => (
            <ColorfulLinkCard
              key={r.href}
              icon={r.icon}
              title={r.title}
              description={r.description}
              href={r.href}
              borderColor={r.borderColor}
            />
          ))}
        </div>
        {getSectionResources("engineering").length === 0 && (
          <p className="mt-6 text-center text-gray-400">
            No engineering resources match your search.
          </p>
        )}
      </section>
      {/* Browser & Engines Section */}
      <section
        id="browsers"
        className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 scroll-mt-40 md:scroll-mt-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Browser & Engines
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Latest updates and news from web browsers and rendering engines
          </p>
        </div>

        <div
          key={filterAnimationVersion}
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${filterAnimationVersion > 0 ? "filter-fade-in" : ""}`}
        >
          {getSectionResources("browsers").map(r => (
            <ColorfulLinkCard
              key={r.href}
              icon={r.icon}
              title={r.title}
              description={r.description}
              href={r.href}
              borderColor={r.borderColor}
            />
          ))}
        </div>
        {getSectionResources("browsers").length === 0 && (
          <p className="mt-6 text-center text-gray-400">
            No browser resources match your search.
          </p>
        )}
      </section>
      {/* Video Channels Section */}
      <section
        id="videos"
        className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 scroll-mt-40 md:scroll-mt-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Video Tutorials & Channels
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            High-quality YouTube channels for frontend learning, JavaScript,
            design, and modern web development.
          </p>
        </div>

        <div
          key={filterAnimationVersion}
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${filterAnimationVersion > 0 ? "filter-fade-in" : ""}`}
        >
          {getSectionResources("videos").map(r => (
            <ColorfulLinkCard
              key={r.href}
              icon={r.icon}
              title={r.title}
              description={r.description}
              href={r.href}
              borderColor={r.borderColor}
            />
          ))}
        </div>
        {getSectionResources("videos").length === 0 && (
          <p className="mt-6 text-center text-gray-400">
            No video resources match your search.
          </p>
        )}
      </section>

      {/* CSS Resources Section */}
      <section
        id="css"
        className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 scroll-mt-40 md:scroll-mt-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">CSS Resources</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore powerful CSS tools, generators, and documentation to enhance
            your design workflow
          </p>
        </div>

        <div
          key={filterAnimationVersion}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${filterAnimationVersion > 0 ? "filter-fade-in" : ""}`}
        >
          {getSectionResources("css").map(r => (
            <ColorfulLinkCard
              key={r.href}
              icon={r.icon}
              title={r.title}
              description={r.description}
              href={r.href}
              borderColor={r.borderColor}
            />
          ))}
        </div>
        {getSectionResources("css").length === 0 && (
          <p className="mt-6 text-center text-gray-400">
            No CSS resources match your search.
          </p>
        )}
      </section>

      {/* Web Tools Section */}
      <section
        id="tools"
        className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 scroll-mt-40 md:scroll-mt-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Web Tools</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Handy tools for preparing web assets and checking browser support.
          </p>
        </div>
        <div
          key={filterAnimationVersion}
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${filterAnimationVersion > 0 ? "filter-fade-in" : ""}`}
        >
          {getSectionResources("tools").map(r => (
            <ColorfulLinkCard
              key={r.href}
              icon={r.icon}
              title={r.title}
              description={r.description}
              href={r.href}
              borderColor={r.borderColor}
            />
          ))}
        </div>
        {getSectionResources("tools").length === 0 && (
          <p className="mt-6 text-center text-gray-400">
            No web tools match your search.
          </p>
        )}
      </section>

      {/* JavaScript Resources Section */}
      <section
        id="javascript"
        className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 scroll-mt-40 md:scroll-mt-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            JavaScript Resources
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore essential JavaScript tools and documentation
          </p>
        </div>
        <div
          key={filterAnimationVersion}
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${filterAnimationVersion > 0 ? "filter-fade-in" : ""}`}
        >
          {getSectionResources("javascript").map(r => (
            <ColorfulLinkCard
              key={r.href}
              icon={r.icon}
              title={r.title}
              description={r.description}
              href={r.href}
              borderColor={r.borderColor}
            />
          ))}
        </div>
        {getSectionResources("javascript").length === 0 && (
          <p className="mt-6 text-center text-gray-400">
            No JavaScript resources match your search.
          </p>
        )}
      </section>
      {/* Glossary Section */}
      <section
        id="glossary"
        className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 scroll-mt-40 md:scroll-mt-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Web Development Glossary
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Clear definitions for web platform, CSS, and accessibility terms
          </p>
        </div>
        <div
          key={filterAnimationVersion}
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${filterAnimationVersion > 0 ? "filter-fade-in" : ""}`}
        >
          {getSectionResources("glossary").map(r => (
            <ColorfulLinkCard
              key={r.href}
              icon={r.icon}
              title={r.title}
              description={r.description}
              href={r.href}
              borderColor={r.borderColor}
            />
          ))}
        </div>
        {getSectionResources("glossary").length === 0 && (
          <p className="mt-6 text-center text-gray-400">
            No glossary resources match your search.
          </p>
        )}
      </section>
      {/* Standalone Playground Feature */}
      <section
        id="playground"
        className="mx-auto max-w-6xl scroll-mt-40 border-t border-white/10 px-4 py-14 sm:px-6 sm:py-20 md:scroll-mt-20"
      >
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Take a break
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Play a game
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Step away from the docs and challenge yourself to a quick classic.
          </p>
        </div>
        <div
          key={filterAnimationVersion}
          className={`grid gap-4 sm:grid-cols-2 ${filterAnimationVersion > 0 ? "filter-fade-in" : ""}`}
        >
          {getSectionResources("playground").map(game => {
            const content = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <span
                    aria-hidden="true"
                    className="grid size-14 place-items-center rounded-2xl border border-emerald-200/15 bg-emerald-300/10 text-3xl"
                  >
                    {game.icon}
                  </span>
                  <span className="rounded-full border border-emerald-200/15 bg-emerald-300/5 px-3 py-1 text-xs font-medium text-emerald-200">
                    Play in browser
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-white">{game.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                    {game.description}
                  </p>
                </div>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 transition-colors group-hover:text-emerald-100">
                  Start playing <span aria-hidden="true">→</span>
                </span>
              </>
            );
            const className =
              "group flex min-h-64 flex-col rounded-3xl border border-emerald-200/15 bg-gradient-to-br from-emerald-300/[0.08] via-card to-card p-6 transition-colors hover:border-emerald-200/35 hover:from-emerald-300/[0.12] sm:p-8";

            return game.href.startsWith("/") ? (
              <Link key={game.href} href={game.href} className={className}>
                {content}
              </Link>
            ) : (
              <a
                key={game.href}
                href={game.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {content}
              </a>
            );
          })}
        </div>
        {getSectionResources("playground").length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-slate-400">
            No playground features match your search.
          </p>
        )}
      </section>
      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-white/10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Know a great resource?
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
          Help grow this portal — suggest a blog, doc, or tool that frontend
          developers should know about.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#engineering"
            className="px-8 py-4 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
          >
            Browse all resources
          </a>
          <a
            href="#top"
            className="px-8 py-4 rounded-lg border border-white/20 text-white font-semibold hover:border-white/50 hover:bg-white/5 transition-colors"
          >
            Back to top
          </a>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Topics</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a
                    href="#engineering"
                    className="hover:text-white transition-colors"
                  >
                    Engineering News
                  </a>
                </li>
                <li>
                  <a
                    href="#browsers"
                    className="hover:text-white transition-colors"
                  >
                    Browsers
                  </a>
                </li>
                <li>
                  <a
                    href="#videos"
                    className="hover:text-white transition-colors"
                  >
                    Videos
                  </a>
                </li>
                <li>
                  <a href="#css" className="hover:text-white transition-colors">
                    CSS
                  </a>
                </li>
                <li>
                  <a
                    href="#javascript"
                    className="hover:text-white transition-colors"
                  >
                    JavaScript
                  </a>
                </li>
                <li>
                  <a
                    href="#glossary"
                    className="hover:text-white transition-colors"
                  >
                    Glossary
                  </a>
                </li>
                <li>
                  <a href="#tools" className="hover:text-white transition-colors">
                    Web Tools
                  </a>
                </li>
                <li>
                  <a href="#playground" className="hover:text-white transition-colors">
                    Playground
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    What is this portal?
                  </a>
                </li>
                <li className="text-gray-500">Curated frontend resources</li>
                <li className="text-gray-500">References, tools, and learning paths</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contribute</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a
                    href="https://github.com/VSKerberos/next1/issues/new?title=Suggest%20a%20resource"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Suggest a resource
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/VSKerberos/next1/issues/new?title=Report%20a%20broken%20link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Report a broken link
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a
                    href="https://github.com/VSKerberos/next1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#top" className="hover:text-white transition-colors">
                    Back to top
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 Frontend Committee. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-400">
              <a
                href="https://github.com/VSKerberos/next1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a href="#top" className="hover:text-white transition-colors">
                Back to top
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
