import { footerConfig, socialIcons } from "@/config/footer";
import Link from "next/link";

export default function Footer() {
  // const {footerConfig} = footerConfig
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto px-6 sm:px-8 lg:px-10">
      <div className="w-full mx-auto max-w-7xl py-8 md:py-10 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <h2 className="text-2xl font-bold text-white">Studyflow</h2>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              {footerConfig.description}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              {footerConfig.about.title}
            </h3>
            <ul className="space-y-3">
              {footerConfig.about.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              {footerConfig.discover.title}
            </h3>
            <ul className="space-y-3">
              {footerConfig.discover.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              {footerConfig.social.title}
            </h3>
            <div className="flex gap-4">
              {footerConfig.social.links.map((link) => {
                const Icon = socialIcons[link.icon];
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                    aria-label={link.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">{footerConfig.copyright}</p>

            <div className="flex flex-wrap gap-6 justify-center">
              {footerConfig.legal.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
