import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiDownload,
  FiFolder,
  FiFileText,
  FiMenu,
  FiX,
} from "react-icons/fi";
import {
  SiAngular,
  SiGithub,
  SiNextdotjs,
  SiNuxtdotjs,
  SiReact,
  SiSvelte,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si";
import Logo, { LogoMark } from "../../components/core/Logo/Logo";
import { Button } from "../../components/core/Button/Button";
import FeatureShowcase from "./FeatureShowcase";

const Head = ({ title, description }: { title?: string; description?: string }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const metaDescription = document.querySelector("meta[name=\"description\"]");
    if (description && metaDescription) {
      metaDescription.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
};

const STACK = [
  { name: "React", icon: <SiReact /> },
  { name: "Vue", icon: <SiVuedotjs /> },
  { name: "Svelte", icon: <SiSvelte /> },
  { name: "Angular", icon: <SiAngular /> },
  { name: "Next.js", icon: <SiNextdotjs /> },
  { name: "Nuxt", icon: <SiNuxtdotjs /> },
  { name: "TypeScript", icon: <SiTypescript /> },
  { name: "Tailwind", icon: <SiTailwindcss /> },
];

const HOW_IT_WORKS = [
  {
    title: "Опишите проект",
    text: "Название и пара предложений о задаче.",
    preview: (
      <div className="space-y-2 text-left">
        <div className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-[13px] text-zinc-200">
          quick-shop<span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-brand-400" />
        </div>
        <div className="h-2 w-4/5 rounded bg-white/[0.07]" />
        <div className="h-2 w-3/5 rounded bg-white/[0.07]" />
      </div>
    ),
  },
  {
    title: "Выберите стек",
    text: "Фреймворк, шаблон, инструменты и функции.",
    preview: (
      <div className="flex flex-wrap justify-center gap-1.5">
        {["React", "TypeScript", "Tailwind", "ESLint", "Dark Mode"].map((chip, index) => (
          <span
            key={chip}
            className={`rounded-full border px-2.5 py-1 text-[12px] ${
              index < 3 ? "border-brand-500/50 bg-brand-500/15 text-brand-200" : "border-white/10 text-zinc-400"
            }`}
          >
            {chip}
          </span>
        ))}
      </div>
    ),
  },
  {
    title: "Заберите код",
    text: "ZIP-архив или новый репозиторий на GitHub.",
    preview: (
      <div className="grid grid-cols-2 gap-2 text-[12px]">
        <span className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-b from-brand-400 to-brand-600 py-2 font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
          <FiDownload /> ZIP
        </span>
        <span className="flex items-center justify-center gap-1.5 rounded-lg bg-white py-2 font-medium text-zinc-900">
          <SiGithub /> GitHub
        </span>
      </div>
    ),
  },
];

const TREE = [
  { depth: 0, name: "my-awesome-app", folder: true },
  { depth: 1, name: "src", folder: true },
  { depth: 2, name: "components", folder: true },
  { depth: 2, name: "hooks", folder: true },
  { depth: 3, name: "useDarkMode.ts" },
  { depth: 2, name: "App.tsx" },
  { depth: 2, name: "main.tsx" },
  { depth: 1, name: ".eslintrc.cjs" },
  { depth: 1, name: "package.json" },
  { depth: 1, name: "vite.config.ts" },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const FEATURES_LINK = import.meta.env.VITE_FEATURES_LINK || "#features";
  const TEMPLATES_LINK = import.meta.env.VITE_TEMPLATES_LINK || "#how";
  const DOCS_LINK = import.meta.env.VITE_DOCS_LINK || "#";
  const PRICING_LINK = import.meta.env.VITE_PRICING_LINK || "#";

  useEffect(() => {
    if (import.meta.env.VITE_NODE_ENV === "production") {
      console.log("Initializing analytics for quickfront.ru");
    }
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNext = () => navigate("/setup");

  const handleLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${
      import.meta.env.VITE_GITHUB_CLIENT_ID
    }&redirect_uri=${
      import.meta.env.VITE_GITHUB_REDIRECT_URI || "https://quickfront.ru/github-callback"
    }`;
  };

  const navLinks = [
    { label: "Функции", href: FEATURES_LINK },
    { label: "Как это работает", href: TEMPLATES_LINK },
    { label: "Документация", href: DOCS_LINK },
    { label: "Тарифы", href: PRICING_LINK },
  ];

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Head
        title="QuickFront — быстрый старт фронтенд-проектов"
        description="Инструмент для быстрого старта фронтенд-проектов с готовой архитектурой и настройками"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[900px] bg-grid" />
      <div className="pointer-events-none absolute left-1/2 top-[-260px] h-[620px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[140px]" />

      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
        <div
          className={`mx-auto max-w-6xl rounded-2xl border transition-all duration-300 ${
            scrolled || menuOpen
              ? "border-white/10 bg-zinc-950/75 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <div className="grid h-16 grid-cols-[1fr_auto] items-center gap-4 px-4 lg:grid-cols-[1fr_auto_1fr]">
            <a href={import.meta.env.BASE_URL} aria-label="QuickFront" className="flex items-center justify-self-start rounded-lg">
              <Logo />
            </a>

            <nav
              className={`hidden items-center rounded-full border p-1 transition-colors duration-300 lg:flex ${
                scrolled ? "border-transparent bg-transparent" : "border-white/[0.08] bg-white/[0.03]"
              }`}
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm text-zinc-400 transition hover:bg-white/[0.07] hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center justify-self-end gap-2">
              <button
                type="button"
                onClick={handleLogin}
                className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white sm:inline-flex"
              >
                <SiGithub className="text-[15px]" />
                Войти
              </button>
              <Button onClick={handleNext}>
                Начать бесплатно
              </Button>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
                aria-expanded={menuOpen}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-zinc-300 transition hover:bg-white/[0.07] hover:text-white lg:hidden"
              >
                {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="border-t border-white/[0.06] p-2 lg:hidden">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={handleLogin}
                className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white sm:hidden"
              >
                <SiGithub /> Войти через GitHub
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-36 lg:pt-24">
          <div>
            <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3 text-xs text-zinc-300">
                <span className="rounded-full bg-brand-500/20 px-2 py-0.5 font-medium text-brand-300">Новое</span>
                AI помощник на базе GigaChat
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[64px]"
            >
              Новый проект
              <br />
              за пару минут
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400"
            >
              Выберите фреймворк, шаблон и инструменты — QuickFront сгенерирует готовую архитектуру с настройками,
              которые обычно занимают целый день.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Button size="lg" onClick={handleNext}>
                Создать проект
              </Button>
              <Button size="lg" variant="outline" onClick={handleLogin} icon={<SiGithub />}>
                Войти через GitHub
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-5 text-sm text-zinc-500"
            >
              Бесплатно · Без регистрации · Код принадлежит вам
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/20 to-white/0" />
            <div className="relative overflow-hidden rounded-2xl bg-zinc-950 shadow-2xl shadow-brand-900/30">
              <div className="flex h-10 items-center gap-2 border-b border-white/[0.06] px-4">
                <span className="h-3 w-3 rounded-full bg-zinc-700" />
                <span className="h-3 w-3 rounded-full bg-zinc-700" />
                <span className="h-3 w-3 rounded-full bg-zinc-700" />
                <span className="ml-3 font-mono text-xs text-zinc-500">quickfront — terminal</span>
              </div>
              <div className="grid font-mono text-[13px] sm:grid-cols-[210px_1fr]">
                <div className="hidden border-r border-white/[0.06] p-4 sm:block">
                  {TREE.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.06 }}
                      className="flex items-center gap-1.5 py-[3px] text-zinc-400"
                      style={{ paddingLeft: item.depth * 14 }}
                    >
                      {item.folder ? (
                        <FiFolder className="shrink-0 text-brand-400" size={13} />
                      ) : (
                        <FiFileText className="shrink-0 text-zinc-600" size={13} />
                      )}
                      <span className={`truncate ${item.folder ? "text-zinc-200" : ""}`}>{item.name}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-1.5 p-4 leading-relaxed">
                  <p className="text-zinc-500">
                    <span className="text-brand-400">$</span> npx quickfront create
                  </p>
                  <p className="text-zinc-300">
                    <span className="text-emerald-400">✓</span> React 18 + TypeScript
                  </p>
                  <p className="text-zinc-300">
                    <span className="text-emerald-400">✓</span> ESLint, Prettier, Husky
                  </p>
                  <p className="text-zinc-300">
                    <span className="text-emerald-400">✓</span> Dark Mode, i18n
                  </p>
                  <p className="pt-2 text-zinc-500">
                    <span className="text-brand-400">$</span> npm run dev
                  </p>
                  <p className="text-zinc-300">
                    <span className="text-sky-400">VITE</span> ready in 312 ms
                  </p>
                  <p className="text-zinc-400">
                    ➜ Local: <span className="text-sky-300">http://localhost:5173/</span>
                    <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-zinc-400" />
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="border-y border-white/[0.06] bg-white/[0.015]">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <p className="mb-6 text-center text-sm text-zinc-500">Поддерживаемые технологии</p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
              {STACK.map((item) => (
                <span
                  key={item.name}
                  className="flex items-center gap-2 text-zinc-500 transition-colors hover:text-zinc-200"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        <FeatureShowcase />

        <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-32 sm:px-6 lg:pb-44">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium text-brand-400">Как это работает</p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-[40px] sm:leading-[1.1]">
              Три шага до первого коммита
            </h2>
          </div>

          <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
            <div className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-[10px] hidden h-px bg-gradient-to-r from-brand-500/0 via-brand-500/60 to-brand-500/0 md:block" />
            {HOW_IT_WORKS.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <span className="relative z-10 flex h-5 items-center gap-2.5 bg-zinc-950 px-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/60 [animation-duration:2.4s]" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-brand-400 shadow-[0_0_12px_3px_rgba(167,139,250,0.7)]" />
                  </span>
                  <span className="text-xs font-medium tabular-nums tracking-wide text-zinc-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>
                <h3 className="mt-5 text-lg font-medium text-white">{item.title}</h3>
                <p className="mt-1.5 max-w-[260px] text-sm text-zinc-400">{item.text}</p>
                <div className="mt-6 w-full max-w-[300px] rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-4">
                  {item.preview}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-32 sm:px-6 lg:pb-44">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950 px-6 py-20 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/30 blur-[110px]" />
            <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_60px_-20px_rgba(139,92,246,0.8)] backdrop-blur">
              <LogoMark className="h-14 w-auto" />
            </div>
            <h2 className="relative text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Готовы начать новый проект?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-zinc-400">
              Настройте стек под задачу и получите рабочий код быстрее, чем закончится кофе.
            </p>
            <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" onClick={handleNext}>
                Создать проект
              </Button>
              <Button size="lg" variant="outline" onClick={handleLogin} icon={<SiGithub />}>
                Войти через GitHub
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Logo className="h-7 w-auto" />
            <p className="text-sm text-zinc-500">Быстрый старт фронтенд-проектов</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-400">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="transition hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>
          <p className="text-sm text-zinc-600">© {new Date().getFullYear()} QuickFront</p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeScreen;
