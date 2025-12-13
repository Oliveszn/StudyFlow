import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  type LucideIcon,
} from "lucide-react";

type SocialIconName = "facebook" | "twitter" | "instagram" | "linkedin";

type SocialLink = {
  label: string;
  href: string;
  icon: SocialIconName;
};

export const footerConfig = {
  about: {
    title: "About",
    links: [
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact us", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "Investors", href: "/investors" },
    ],
  },
  discover: {
    title: "Discover Studyflow",
    links: [
      { label: "Teach on Studyflow", href: "/teach" },
      { label: "Plans and Pricing", href: "/pricing" },
      { label: "Affiliate", href: "/affiliate" },
      { label: "Help and Support", href: "/support" },
    ],
  },
  social: {
    title: "Follow Us",
    links: [
      { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
      { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
      { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
      { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
    ] satisfies SocialLink[],
  },
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
  copyright: "© 2025 Studyflow. All rights reserved.",
  description:
    "Studyflow is your premier destination for online learning. Access thousands of courses, learn at your own pace, and advance your career with expert-led instruction.",
};

export const socialIcons: Record<SocialIconName, LucideIcon> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
};
