import React from 'react';

const links = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
];

export default function Footer() {
  return (
    <footer id="footer" className="py-12 px-6 border-t border-gray-100">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo/Name */}
        <span className="text-sm font-medium text-gray-800">Social Gravity</span>
        
        {/* Links */}
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        
        {/* Copyright */}
        <span className="text-xs text-gray-300">© 2024</span>
      </div>
    </footer>
  );
}