import { useEffect, useState } from "react";

type LanguageId = "typescript" | "flutter" | "html-css";
type WorkbenchFile = { path: string; name: string; content: string };
type WorkbenchFolder = { name: string; files: WorkbenchFile[] };
type WorkbenchLanguage = {
  label: string;
  command: string;
  folders: WorkbenchFolder[];
};

const workbenchLanguages: Record<LanguageId, WorkbenchLanguage> = {
  typescript: {
    label: "TypeScript",
    command: "npm run dev",
    folders: [
      {
        name: "src",
        files: [
          {
            path: "src/App.tsx",
            name: "App.tsx",
            content: `
            import { useState } from "react";
            function App() {
              const [role, setRole] = useState("Developer");

              return <h1>Hello, {role}!</h1>;
            }
            export default App;`,
          },
          {
            path: "src/index.css",
            name: "index.css",
            content: `
            :root {
              font-family: "Inter", sans-serif;
              color: #f8fafc;
              background: #0e1117;
            }
            .hero {
              display: grid;
              place-items: center;
              min-height: 100vh;
            }`,
          },
        ],
      },
      {
        name: "public",
        files: [
          {
            path: "public/favicon.svg",
            name: "favicon.svg",
            content: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
              <rect width="64" height="64" rx="16" fill="#111827" />
              <text x="50%" y="54%" fill="#f8fafc" text-anchor="middle"
                dominant-baseline="middle" font-family="sans-serif" font-size="32">
                ef
              </text>
            </svg>`,
          },
        ],
      },
      {
        name: "root",
        files: [
          {
            path: "package.json",
            name: "package.json",
            content: `{
              "name": "eriko-portfolio",
              "private": true,
              "scripts": {
                "start": "vite dev",
                "build": "vite build",
                "test": "vitest run"
              },
              "dependencies": {
                "react": "^19.2.0",
                "@tanstack/react-router": "1.170.41"
              }
            }`,
          },
        ],
      },
    ],
  },
  flutter: {
    label: "Flutter",
    command: "flutter run",
    folders: [
      {
        name: "lib",
        files: [
          {
            path: "lib/main.dart",
            name: "main.dart",
            content: `
            import 'package:flutter/material.dart';
            import 'screens/home_screen.dart';

            void main() {
              runApp(const PortfolioApp());
            }

            class PortfolioApp extends StatelessWidget {
              const PortfolioApp({super.key});

              @override
              Widget build(BuildContext context) {
                return MaterialApp(
                  title: 'My Portfolio',
                  theme: ThemeData(useMaterial3: true),
                  home: const HomeScreen(),
                );
              }
            }`,
          },
        ],
      },
      {
        name: "lib/screens",
        files: [
          {
            path: "lib/screens/home_screen.dart",
            name: "home_screen.dart",
            content: `
            import 'package:flutter/material.dart';
            import '../widgets/project_card.dart';

            class HomeScreen extends StatelessWidget {
              const HomeScreen({super.key});

              @override
              Widget build(BuildContext context) {
                return Scaffold(
                  appBar: AppBar(title: const Text('My Projects')),
                  body: ListView(
                    padding: const EdgeInsets.all(16),
                    children: const [
                      ProjectCard(title: 'Loyalty App', tech: 'Flutter'),
                      ProjectCard(title: 'English Learning', tech: 'Flutter'),
                    ],
                  ),
                );
              }
            }`,
          },
        ],
      },
      {
        name: "lib/widgets",
        files: [
          {
            path: "lib/widgets/project_card.dart",
            name: "project_card.dart",
            content: `
            import 'package:flutter/material.dart';
            class ProjectCard extends StatelessWidget {
              const ProjectCard({
                required this.title,
                required this.tech,
                super.key,
              });

              final String title;
              final String tech;

              @override
              Widget build(BuildContext context) {
                return Card(
                  child: ListTile(
                    title: Text(title),
                    subtitle: Text(tech),
                    trailing: const Icon(Icons.arrow_forward),
                  ),
                );
              }
            }`,
          },
        ],
      },
      {
        name: "root",
        files: [
          {
            path: "pubspec.yaml",
            name: "pubspec.yaml",
            content: `name: my_portfolio
description: A Flutter portfolio app
publish_to: 'none'

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter

flutter:
  uses-material-design: true`,
          },
        ],
      },
    ],
  },
  "html-css": {
    label: "HTML/CSS",
    command: "Live Server :5500",
    folders: [
      {
        name: "root",
        files: [
          {
            path: "index.html",
            name: "index.html",
            content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Portfolio</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main class="hero">
      <h1>Hello, Eriko!</h1>
      <p>Building thoughtful digital experiences.</p>
    </main>
  </body>
</html>`,
          },
          {
            path: "styles.css",
            name: "styles.css",
            content: `:root {
  font-family: Arial, sans-serif;
  color: #f8fafc;
  background: #0e1117;
}

.hero {
  display: grid;
  min-height: 100vh;
  place-content: center;
  text-align: center;
}

.hero h1 {
  color: #f97316;
}`,
          },
          {
            path: "assets/favicon.svg",
            name: "favicon.svg",
            content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#111827" />
  <text x="50%" y="54%" fill="#f8fafc" text-anchor="middle"
    dominant-baseline="middle" font-family="sans-serif" font-size="32">
    ef
  </text>
</svg>`,
          },
        ],
      },
    ],
  },
};

const languageOptions = Object.entries(workbenchLanguages) as [LanguageId, WorkbenchLanguage][];

function normalizeCode(content: string) {
  const lines = content.split("\n");

  while (lines.length > 0 && lines[0].trim() === "") lines.shift();
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();

  const indentation = Math.min(
    ...lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)?.[0].length ?? 0),
  );

  return lines.map((line) => (line.trim() ? line.slice(indentation) : "")).join("\n");
}

function getFileColor(fileName: string) {
  if (fileName.endsWith(".tsx")) return "text-sky-400";
  if (fileName.endsWith(".dart")) return "text-sky-500";
  if (fileName.endsWith(".yaml")) return "text-rose-400";
  if (fileName.endsWith(".html")) return "text-orange-400";
  if (fileName.endsWith(".css")) return "text-blue-400";
  if (fileName.endsWith(".svg")) return "text-amber-400";
  return "text-yellow-300";
}

export function CodeWorkbench() {
  const [activeLanguage, setActiveLanguage] = useState<LanguageId>("typescript");
  const [activeFilePath, setActiveFilePath] = useState("src/App.tsx");
  const [charIndex, setCharIndex] = useState(0);
  const language = workbenchLanguages[activeLanguage];
  const files = language.folders.flatMap((folder) => folder.files);
  const activeFile = files.find((file) => file.path === activeFilePath) ?? files[0];
  const activeCode = normalizeCode(activeFile?.content ?? "");

  const selectLanguage = (languageId: LanguageId) => {
    const firstFile = workbenchLanguages[languageId].folders[0]?.files[0];
    if (!firstFile) return;
    setActiveLanguage(languageId);
    setActiveFilePath(firstFile.path);
    setCharIndex(0);
  };

  const selectFile = (file: WorkbenchFile) => {
    setActiveFilePath(file.path);
    setCharIndex(0);
  };

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () =>
      setCharIndex(motionPreference.matches ? activeCode.length : 0);

    updateMotionPreference();
    motionPreference.addEventListener("change", updateMotionPreference);
    return () => motionPreference.removeEventListener("change", updateMotionPreference);
  }, [activeCode]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeout = window.setTimeout(
      () => setCharIndex((index) => (index >= activeCode.length ? 0 : index + 1)),
      charIndex >= activeCode.length ? 1800 : 42,
    );
    return () => window.clearTimeout(timeout);
  }, [activeCode, charIndex]);

  const lines = activeCode.slice(0, charIndex).split("\n");

  return (
    <div className="w-full min-w-0">
      <div
        role="group"
        aria-label="Interactive code editor"
        className="float-slow h-[380px] w-full overflow-hidden rounded-xl border border-border bg-[#f7f6f2] font-mono text-xs text-slate-800 shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-[#0e1117] dark:text-slate-200 dark:shadow-black/30 lg:h-[440px]"
      >
        <div className="flex h-10 items-center justify-between border-b border-border px-3 dark:border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#ff6b6b]" />
            <span className="size-2 rounded-full bg-[#ffd166]" />
            <span className="size-2 rounded-full bg-[#06d6a0]" />
          </div>
          <span className="text-[10px] text-slate-600 dark:text-slate-500">eriko-portfolio</span>
          <span className="text-[10px] text-emerald-400">● Running</span>
        </div>
        <div className="flex h-[338px] lg:h-[398px]">
          <aside className="hidden w-36 shrink-0 overflow-y-auto border-r border-border p-3 text-[9px] leading-6 text-slate-600 dark:border-white/10 dark:text-slate-500 sm:block">
            <p className="mb-1 uppercase tracking-wider text-slate-600">Explorer</p>
            <p
              className="truncate text-slate-700 dark:text-slate-400"
              title={`${language.label} project`}
            >
              ⌄ {language.label.toLowerCase()}-project
            </p>
            {language.folders.map((folder) => (
              <div key={folder.name} className="mt-1">
                <p className="truncate pl-2 text-slate-600 dark:text-slate-500" title={folder.name}>
                  ⌄ {folder.name}
                </p>
                {folder.files.map((file) => (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => selectFile(file)}
                    aria-pressed={activeFile?.path === file.path}
                    title={file.path}
                    className={`block w-full truncate rounded pl-4 text-left transition-colors hover:bg-black/5 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-slate-200 ${activeFile?.path === file.path ? "text-sky-700 dark:text-sky-300" : "text-slate-600 dark:text-slate-500"}`}
                  >
                    <span className={getFileColor(file.name)}>◇</span> {file.name}
                  </button>
                ))}
              </div>
            ))}
          </aside>
          <div className="flex min-w-0 flex-1 flex-col">
            <div
              role="group"
              aria-label="Open source file"
              className="hide-scrollbar flex h-9 items-stretch overflow-x-auto border-b border-border bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.03]"
            >
              {files.map((file) => (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => selectFile(file)}
                  aria-pressed={activeFile?.path === file.path}
                  title={file.path}
                  className={`flex shrink-0 items-center gap-1.5 border-r border-border px-3 text-[10px] transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5 ${activeFile?.path === file.path ? "bg-[#f7f6f2] text-slate-800 dark:bg-[#0e1117] dark:text-slate-200" : "text-slate-600 dark:text-slate-500"}`}
                >
                  <span className={getFileColor(file.name)}>◇</span>
                  {file.name}
                </button>
              ))}
            </div>
            <pre className="flex-1 overflow-hidden px-4 py-3 text-left text-[11px] leading-[1.8] text-slate-800 dark:text-slate-200">
              {lines.map((line, index) => (
                <span key={index} className="flex min-h-[1.8em] w-full">
                  <span className="mr-3 w-3 shrink-0 select-none text-right text-slate-500 dark:text-slate-600">
                    {index + 1}
                  </span>
                  <span className="whitespace-pre-wrap break-words">
                    {line || "\u00a0"}
                    {index === lines.length - 1 && <span className="caret text-amber-300">_</span>}
                  </span>
                </span>
              ))}
            </pre>
            <div className="flex h-8 items-center gap-2 border-t border-border px-3 text-[10px] text-slate-600 dark:border-white/10 dark:text-slate-500">
              <span className="text-emerald-400">❯</span>
              <span>{language.command}</span>
              <span className="ml-auto text-emerald-400">ready</span>
            </div>
          </div>
        </div>
      </div>
      <div
        role="group"
        aria-label="Select code language"
        className="mt-4 flex flex-wrap justify-center gap-2"
      >
        {languageOptions.map(([languageId, option]) => (
          <button
            key={languageId}
            type="button"
            onClick={() => selectLanguage(languageId)}
            aria-pressed={activeLanguage === languageId}
            className={`rounded-full border px-3 py-1.5 font-mono text-[10px] transition-colors sm:px-4 sm:text-xs ${
              activeLanguage === languageId
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-border bg-card/80 text-muted-foreground hover:border-accent/40 hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
