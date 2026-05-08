import { Bookmark } from "@/types";

export type Collection = {
  _id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
};

export type Tag = {
  _id: string;
  name: string;
  color: string;
  count: number;
};

export const collections: Collection[] = [
  {
    _id: "all",
    name: "All Bookmarks",
    icon: "bookmark",
    color: "neutral",
    count: 24,
  },
  {
    _id: "design",
    name: "Design Resources",
    icon: "palette",
    color: "violet",
    count: 8,
  },
  { _id: "dev", name: "Development", icon: "code", color: "blue", count: 12 },
  { _id: "tools", name: "Tools", icon: "wrench", color: "amber", count: 6 },
  {
    _id: "reading",
    name: "Reading List",
    icon: "book-open",
    color: "emerald",
    count: 4,
  },
  {
    _id: "inspiration",
    name: "Inspiration",
    icon: "sparkles",
    color: "pink",
    count: 5,
  },
];

export const tags: Tag[] = [
  {
    _id: "react",
    name: "React",
    color: "bg-blue-500/10 text-blue-500",
    count: 8,
  },
  {
    _id: "typescript",
    name: "TypeScript",
    color: "bg-blue-600/10 text-blue-600",
    count: 6,
  },
  {
    _id: "ui",
    name: "UI/UX",
    color: "bg-violet-500/10 text-violet-500",
    count: 5,
  },
  {
    _id: "nextjs",
    name: "Next.js",
    color: "bg-foreground/10 text-foreground",
    count: 4,
  },
  {
    _id: "tailwind",
    name: "Tailwind",
    color: "bg-cyan-500/10 text-cyan-500",
    count: 7,
  },
  {
    _id: "tutorial",
    name: "Tutorial",
    color: "bg-emerald-500/10 text-emerald-500",
    count: 3,
  },
  {
    _id: "docs",
    name: "Documentation",
    color: "bg-amber-500/10 text-amber-500",
    count: 5,
  },
  {
    _id: "free",
    name: "Free",
    color: "bg-green-500/10 text-green-500",
    count: 4,
  },
];

export const bookmarks: Bookmark[] = [
  {
    _id: "1",
    title: "Shadcn UI",
    description:
      "Beautifully designed components built with Radix UI and Tailwind CSS.",
    favicon: "https://www.google.com/s2/favicons?domain=ui.shadcn.com&sz=64",
    tags: ["react", "ui", "tailwind"],
    createdAt: "2024-01-15",
    isFavorite: true,
    hasDarkIcon: true,
  },
  {
    _id: "2",
    title: "Vercel",
    description:
      "Develop. Preview. Ship. The best frontend developer experience.",
    favicon: "https://www.google.com/s2/favicons?domain=vercel.com&sz=64",
    tags: ["nextjs"],
    createdAt: "2024-01-14",
    isFavorite: true,
    hasDarkIcon: true,
  },
  {
    _id: "3",
    title: "Tailwind CSS",
    description: "A utility-first CSS framework for rap_id UI development.",
    favicon: "https://www.google.com/s2/favicons?domain=tailwindcss.com&sz=64",
    tags: ["tailwind", "docs"],
    createdAt: "2024-01-13",
    isFavorite: false,
  },
  {
    _id: "4",
    title: "Figma",
    description: "The collaborative interface design tool.",
    favicon: "https://www.google.com/s2/favicons?domain=figma.com&sz=64",
    tags: ["ui", "free"],
    createdAt: "2024-01-12",
    isFavorite: true,
  },
  {
    _id: "5",
    title: "Dribbble",
    description: "Discover the world's top designers & creatives.",
    favicon: "https://www.google.com/s2/favicons?domain=dribbble.com&sz=64",
    tags: ["ui"],
    createdAt: "2024-01-11",
    isFavorite: false,
  },
  {
    _id: "6",
    title: "React Documentation",
    description: "The library for web and native user interfaces.",
    favicon: "https://www.google.com/s2/favicons?domain=react.dev&sz=64",
    tags: ["react", "docs", "tutorial"],
    createdAt: "2024-01-10",
    isFavorite: true,
  },
  {
    _id: "7",
    title: "TypeScript Handbook",
    description: "TypeScript is JavaScript with syntax for types.",
    favicon:
      "https://www.google.com/s2/favicons?domain=typescriptlang.org&sz=64",
    tags: ["typescript", "docs"],
    createdAt: "2024-01-09",
    isFavorite: false,
  },
  {
    _id: "8",
    title: "Next.js Documentation",
    description: "The React Framework for the Web.",
    favicon: "https://www.google.com/s2/favicons?domain=nextjs.org&sz=64",
    tags: ["nextjs", "react", "docs"],
    createdAt: "2024-01-08",
    isFavorite: true,
    hasDarkIcon: true,
  },
  {
    _id: "9",
    title: "Luc_ide Icons",
    description: "Beautiful & consistent icon toolkit made by the community.",
    favicon: "https://www.google.com/s2/favicons?domain=luc_ide.dev&sz=64",
    tags: ["ui", "free"],
    createdAt: "2024-01-07",
    isFavorite: false,
  },
  {
    _id: "10",
    title: "Radix UI",
    description: "Unstyled, accessible components for building design systems.",
    favicon: "https://www.google.com/s2/favicons?domain=radix-ui.com&sz=64",
    tags: ["react", "ui"],
    createdAt: "2024-01-06",
    isFavorite: false,
    hasDarkIcon: true,
  },
  {
    _id: "11",
    title: "Linear",
    description: "The issue tracking tool you'll enjoy using.",
    favicon: "https://www.google.com/s2/favicons?domain=linear.app&sz=64",
    tags: [],
    createdAt: "2024-01-05",
    isFavorite: true,
  },
  {
    _id: "12",
    title: "Notion",
    description:
      "The all-in-one workspace for your notes, tasks, wikis, and databases.",
    favicon: "https://www.google.com/s2/favicons?domain=notion.so&sz=64",
    tags: ["free"],
    createdAt: "2024-01-04",
    isFavorite: false,
    hasDarkIcon: true,
  },
  {
    _id: "13",
    title: "Awwwards",
    description:
      "The awards of design, creativity and innovation on the internet.",
    favicon: "https://www.google.com/s2/favicons?domain=awwwards.com&sz=64",
    tags: ["ui"],
    createdAt: "2024-01-03",
    isFavorite: false,
  },
  {
    _id: "14",
    title: "Frontend Masters",
    description: "Advance your skills with in-depth, modern front-end courses.",
    favicon:
      "https://www.google.com/s2/favicons?domain=frontendmasters.com&sz=64",
    tags: ["tutorial", "react", "typescript"],
    createdAt: "2024-01-02",
    isFavorite: false,
  },
  {
    _id: "15",
    title: "CSS Tricks",
    description:
      "Daily articles about CSS, HTML, JavaScript, and all things web design.",
    favicon: "https://www.google.com/s2/favicons?domain=css-tricks.com&sz=64",
    tags: ["tutorial", "tailwind"],
    createdAt: "2024-01-01",
    isFavorite: false,
  },
  {
    _id: "16",
    title: "Framer",
    description: "Ship sites with unmatched speed and style.",
    favicon: "https://www.google.com/s2/favicons?domain=framer.com&sz=64",
    tags: ["ui"],
    createdAt: "2023-12-31",
    isFavorite: true,
    hasDarkIcon: true,
  },
];
