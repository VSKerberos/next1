const NAV_SECTIONS = [
  { label: "Engineering", href: "#engineering" },
  { label: "Browsers", href: "#browsers" },
  { label: "CSS", href: "#css" },
  { label: "JavaScript", href: "#javascript" },
] as const;

const QUICK_JUMP_SECTIONS = [
  { label: "Engineering News", href: "#engineering" },
  { label: "Browsers", href: "#browsers" },
  { label: "CSS", href: "#css" },
  { label: "JavaScript", href: "#javascript" },
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

import resources from "../data/resources";

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
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  borderColor: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`block bg-white/5 border-2 ${BORDER_CLASSES[borderColor] ?? "border-white/10"} rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group no-underline`}
  >
    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed mb-4">{description}</p>
    <span className="text-xs text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
      → Visit site
    </span>
  </a>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white overflow-hidden">
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
          <a
            href="#engineering"
            className="px-6 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors shrink-0 text-sm sm:text-base"
          >
            Browse resources
          </a>
        </div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 max-w-3xl mx-auto">
          <StatCard number="50+" label="Curated links" />
          <StatCard number="4" label="Topic areas" />
          <StatCard number="100%" label="Frontend focus" />
          <StatCard number="Free" label="Always open" />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources
            .filter(r => r.section === "engineering")
            .map(r => (
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources
            .filter(r => r.section === "browsers")
            .map(r => (
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
          {resources
            .filter(r => r.section === "css")
            .map(r => (
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources
            .filter(r => r.section === "javascript")
            .map(r => (
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
