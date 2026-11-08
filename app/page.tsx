"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import resources, { Resource } from "../data/resources";

const NAV_SECTIONS = [
  { label: "Roadmaps", href: "#roadmap" },
  { label: "Engineering", href: "#engineering" },
  { label: "Browsers", href: "#browsers" },
  { label: "Videos", href: "#videos" },
  { label: "CSS", href: "#css" },
  { label: "JavaScript", href: "#javascript" },
  { label: "Glossary", href: "#glossary" },
  { label: "Games", href: "#games" },
] as const;

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
  { label: "Engineering News", href: "#engineering" },
  { label: "Browsers", href: "#browsers" },
  { label: "Videos", href: "#videos" },
  { label: "CSS", href: "#css" },
  { label: "JavaScript", href: "#javascript" },
  { label: "Glossary", href: "#glossary" },
  { label: "Games", href: "#games" },
] as const;

const FILTER_TAGS = [
  { label: "All", value: "all" as const },
  { label: "Engineering", value: "engineering" as const },
  { label: "Browsers", value: "browsers" as const },
  { label: "Videos", value: "videos" as const },
  { label: "CSS", value: "css" as const },
  { label: "JavaScript", value: "javascript" as const },
  { label: "Glossary", value: "glossary" as const },
  { label: "Games", value: "games" as const },
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
  const className = `flex h-full flex-col overflow-hidden bg-card border-2 ${BORDER_CLASSES[borderColor] ?? "border-white/10"} rounded-2xl p-6 hover:bg-card-hover transition-all duration-300 group no-underline`;

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRoadmap, setActiveRoadmap] = useState(0);

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

  const getSectionResources = (section: Resource["section"]) =>
    filteredResources.filter(resource => resource.section === section);

  return (
    <main className="min-h-screen bg-gradient-to-b from-transparent via-slate-900/80 to-transparent text-white overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center gap-4">
          <a
            href="#top"
            className="text-2xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent shrink-0"
          >
            Frontend Portal
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            {NAV_SECTIONS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(open => !open)}
              aria-label="Toggle navigation menu"
              className="md:hidden rounded-full p-3 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
            >
              <span className="text-lg">☰</span>
            </button>

            <a
              href="#engineering"
              className="hidden md:inline-flex px-6 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors shrink-0 text-sm sm:text-base"
            >
              Browse resources
            </a>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur-md">
            <div className="px-6 py-4 space-y-3">
              {NAV_SECTIONS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base font-medium text-gray-100 hover:bg-white/10"
                >
                  {label}
                </a>
              ))}
              <a
                href="#engineering"
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl bg-white px-4 py-3 text-base font-semibold text-black hover:bg-gray-200"
              >
                Browse resources
              </a>
            </div>
          </div>
        )}
      </nav>
      {/* Hero Section */}
      <section
        id="top"
        className="max-w-6xl mx-auto px-6 py-20 text-center scroll-mt-24"
      >
        <div className="inline-block px-4 py-2 rounded-full border border-white/20 text-sm text-gray-300 mb-6 bg-white/5">
          Curated for frontend developers
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-tight">
          Frontend Developer Portal
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-10">
          Hand-picked links to engineering blogs, browser updates, CSS
          references, and JavaScript resources — all in one place.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {QUICK_JUMP_SECTIONS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="px-5 py-2.5 rounded-full border border-white/20 text-sm text-gray-300 hover:border-white/40 hover:bg-white/10 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto">
          <StatCard number={String(resources.length)} label="Curated links" />
          <StatCard
            number={String(new Set(resources.map(resource => resource.section)).size)}
            label="Topic areas"
          />
          <StatCard number="100%" label="Frontend focus" />
          <StatCard number="Free" label="Always open" />
        </div>

        <div className="max-w-4xl mx-auto px-6 mb-16">
          <label htmlFor="resource-search" className="sr-only">
            Search resources
          </label>
          <div className="relative">
            <input
              id="resource-search"
              type="search"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Search resources by title, description, or category"
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {FILTER_TAGS.map(filter => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveSection(filter.value)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  activeSection === filter.value
                    ? "bg-white text-black"
                    : "border border-white/20 bg-white/5 text-gray-300 hover:border-white/40 hover:bg-white/10"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-gray-400">
            Showing {filteredResources.length} matching resource
            {filteredResources.length === 1 ? "" : "s"}
          </p>
        </div>
      </section>
      {/* Featured Resources Bento Grid */}
      <section
        aria-labelledby="featured-resources-heading"
        className="max-w-6xl mx-auto px-6 pb-16 scroll-mt-24"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
              Explore
            </p>
            <h2
              id="featured-resources-heading"
              className="text-2xl font-bold text-white"
            >
              Featured resources
            </h2>
          </div>
          <a
            href="#engineering"
            className="text-sm text-slate-400 transition-colors hover:text-white"
          >
            Browse all resources &rarr;
          </a>
        </div>
        <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-3">
          {resources.slice(0, 3).map((resource, index) => (
            <div
              key={resource.href}
              className={index === 0 ? "md:col-span-2 md:row-span-2" : ""}
            >
              <ColorfulLinkCard
                icon={resource.icon}
                title={resource.title}
                description={resource.description}
                href={resource.href}
                borderColor={resource.borderColor}
                featured={index === 0}
              />
            </div>
          ))}
        </div>
      </section>
      {/* Interactive Roadmap Module */}
      <section
        id="roadmap"
        aria-labelledby="roadmap-heading"
        className="max-w-6xl mx-auto px-6 pb-16 scroll-mt-24"
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
        className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 scroll-mt-24"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
        className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 scroll-mt-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Browser & Engines
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Latest updates and news from web browsers and rendering engines
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
        className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 scroll-mt-24"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
        className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 scroll-mt-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">CSS Resources</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore powerful CSS tools, generators, and documentation to enhance
            your design workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* JavaScript Resources Section */}
      <section
        id="javascript"
        className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 scroll-mt-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            JavaScript Resources
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore essential JavaScript tools and documentation
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
        className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 scroll-mt-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Web Development Glossary
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Clear definitions for web platform, CSS, and accessibility terms
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
      {/* Games Section */}
      <section
        id="games"
        className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 scroll-mt-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Games</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Take a break and play a classic game.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {getSectionResources("games").map(game => (
            <ColorfulLinkCard
              key={game.href}
              icon={game.icon}
              title={game.title}
              description={game.description}
              href={game.href}
              borderColor={game.borderColor}
            />
          ))}
        </div>
        {getSectionResources("games").length === 0 && (
          <p className="mt-6 text-center text-gray-400">
            No games match your search.
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
                  <a href="#games" className="hover:text-white transition-colors">
                    Games
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#top" className="hover:text-white transition-colors">
                    What is this portal?
                  </a>
                </li>
                <li className="text-gray-500">Curated link directory</li>
                <li className="text-gray-500">For frontend developers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contribute</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="text-gray-500">Suggest a link (coming soon)</li>
                <li>
                  <a href="#top" className="hover:text-white transition-colors">
                    Report broken link
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a
                    href="https://github.com"
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
              © 2026 Frontend Developer Portal. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-400">
              <a
                href="https://github.com"
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
