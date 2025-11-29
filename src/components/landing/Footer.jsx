import React from "react";

const links = [
  { label: "About", href: "#" },
  { label: "Contact", href: "mailto:founders@socialgravity.ai" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="py-12 px-6 border-t border-gray-200 bg-white"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <span className="text-sm font-medium tracking-tight text-gray-800">
          SocialGravity
        </span>

        {/* Links */}
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-gray-500 hover:text-black transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Email + Copyright */}
        <div className="flex flex-col items-center md:items-end leading-tight">
          <a
            href="mailto:founders@socialgravity.ai"
            className="text-xs font-medium text-gray-700 hover:text-black transition-colors"
          >
            founders@socialgravity.ai
          </a>
          <span className="text-[11px] text-gray-400">© {year}</span>
        </div>
      </div>
    </footer>
  );
}
