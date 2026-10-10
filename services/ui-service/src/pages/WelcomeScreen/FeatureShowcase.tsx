import React from "react";
import { motion } from "framer-motion";
import { FiCpu, FiLayout, FiShoppingCart, FiFileText, FiBarChart2 } from "react-icons/fi";
import {
  SiAngular,
  SiGithub,
  SiJest,
  SiNextdotjs,
  SiNuxtdotjs,
  SiReact,
  SiSvelte,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiVuedotjs,
} from "react-icons/si";
import { LogoMark } from "../../components/core/Logo/Logo";

const GRID_TILES = [
  <SiReact key="react" />,
  <SiVuedotjs key="vue" />,
  <SiSvelte key="svelte" />,
  <SiAngular key="angular" />,
  <SiNextdotjs key="next" />,
  <SiNuxtdotjs key="nuxt" />,
  <SiTypescript key="ts" />,
  <SiTailwindcss key="tw" />,
  <SiVite key="vite" />,
  <SiJest key="jest" />,
];

const ORBIT_NODES = [
  { icon: <SiReact />, color: "#61DAFB", position: "left-6 top-6", bracket: "left-[52px] top-[52px] border-l border-t rounded-tl-2xl" },
  { icon: <SiTypescript />, color: "#3178C6", position: "right-6 top-6", bracket: "right-[52px] top-[52px] border-r border-t rounded-tr-2xl" },
  { icon: <SiTailwindcss />, color: "#38BDF8", position: "bottom-6 left-6", bracket: "bottom-[52px] left-[52px] border-b border-l rounded-bl-2xl" },
  { icon: <SiGithub />, color: "#FFFFFF", position: "bottom-6 right-6", bracket: "bottom-[52px] right-[52px] border-b border-r rounded-br-2xl" },
];

const TEMPLATE_ROWS = [
  { icon: <FiShoppingCart />, name: "Интернет-магазин", meta: "Next.js · React", badge: "Популярный", tone: "emerald" },
  { icon: <FiBarChart2 />, name: "Админ-панель", meta: "React · Next.js", badge: "Популярный", tone: "emerald" },
  { icon: <FiLayout />, name: "Лендинг", meta: "Vue · Nuxt.js", badge: "Новый", tone: "violet" },
  { icon: <FiFileText />, name: "Блог", meta: "Next.js", badge: "Бета", tone: "amber" },
];

const BADGE_TONES: Record<string, string> = {
  emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  violet: "border-brand-500/25 bg-brand-500/10 text-brand-300",
  amber: "border-amber-500/20 bg-amber-500/10 text-amber-400",
};

const CHART = [
  { label: "TS", value: 45 },
  { label: "ESLint", value: 25 },
  { label: "Prettier", value: 12 },
  { label: "Jest", value: 35 },
  { label: "Husky", value: 18 },
  { label: "Router", value: 22 },
  { label: "i18n", value: 30 },
  { label: "PWA", value: 40 },
  { label: "SSR", value: 55 },
  { label: "Redux", value: 28 },
];

const CHART_MAX = 60;
const HIGHLIGHT = 0;

const Card = ({
  title,
  text,
  className = "",
  visualClassName = "h-64",
  children,
}: {
  title: string;
  text: string;
  className?: string;
  visualClassName?: string;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5 }}
    className={`relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-zinc-900 to-zinc-900/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${className}`}
  >
    <div className="relative z-10 p-6 pb-0 sm:p-7 sm:pb-0">
      <h3 className="text-xl font-medium tracking-tight text-white sm:text-[22px]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">{text}</p>
    </div>
    <div className={`relative mt-6 ${visualClassName}`}>{children}</div>
  </motion.div>
);

const FrameworksVisual = () => (
  <div className="absolute inset-x-0 top-2 px-6">
    <div className="relative">
      <div className="grid grid-cols-5 gap-3 [mask-image:radial-gradient(ellipse_75%_90%_at_50%_50%,black_20%,transparent_85%)]">
        {GRID_TILES.map((icon, index) => (
          <div
            key={index}
            className="flex aspect-square items-center justify-center rounded-2xl border border-white/[0.05] bg-white/[0.025] text-2xl text-zinc-700 sm:text-3xl"
          >
            {icon}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/35 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[22px] border border-white/20 bg-gradient-to-b from-brand-400 to-brand-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_20px_50px_-12px_rgba(139,92,246,0.9)]">
        <LogoMark className="h-11 w-auto" />
      </div>
    </div>
  </div>
);

const OrbitVisual = () => (
  <>
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/25 blur-3xl" />
    <div className="absolute left-14 right-14 top-1/2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    {ORBIT_NODES.map((node) => (
      <React.Fragment key={node.position}>
        <span className={`absolute h-10 w-16 border-white/10 ${node.bracket}`} />
        <span
          className={`absolute flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-xl shadow-[0_8px_24px_-8px_rgba(0,0,0,0.8)] ${node.position}`}
          style={{ color: node.color }}
        >
          {node.icon}
        </span>
      </React.Fragment>
    ))}
    <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-500/15" />
    <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-500/30" />
    <div
      className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 animate-spin"
      style={{ animationDuration: "14s" }}
    >
      <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400 shadow-[0_0_12px_2px_rgba(167,139,250,0.8)]" />
    </div>
    <div
      className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 animate-spin"
      style={{ animationDuration: "9s", animationDirection: "reverse" }}
    >
      <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_10px_2px_rgba(232,121,249,0.7)]" />
    </div>
    <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-gradient-to-b from-brand-400 to-brand-600 text-xl text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_40px_-4px_rgba(139,92,246,0.9)]">
      <FiCpu />
    </div>
  </>
);

const TemplatesVisual = () => (
  <div className="absolute inset-x-0 top-0 space-y-2.5 px-5 sm:px-7 [mask-image:linear-gradient(to_bottom,black_65%,transparent)]">
    {TEMPLATE_ROWS.map((row) => (
      <div
        key={row.name}
        className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-3"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-zinc-300">
          {row.icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-zinc-100">{row.name}</span>
          <span className="block truncate text-xs text-zinc-500">{row.meta}</span>
        </span>
        <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-medium ${BADGE_TONES[row.tone]}`}>
          {row.badge}
        </span>
      </div>
    ))}
  </div>
);

const ChartVisual = () => (
  <div className="absolute inset-x-5 top-0 bottom-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:inset-x-7">
    <div className="mb-4 flex items-center justify-between text-xs">
      <span className="font-medium text-zinc-300">Сэкономлено минут на настройке</span>
      <span className="flex items-center gap-3 text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-brand-500" />
          QuickFront
        </span>
      </span>
    </div>
    <div className="flex h-[calc(100%-2.5rem)] gap-3">
      <div className="flex flex-col justify-between pb-5 text-[10px] tabular-nums text-zinc-600">
        {[60, 45, 30, 15, 0].map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
      <div className="relative flex flex-1 items-end gap-1.5 sm:gap-2.5">
        {CHART.map((bar, index) => {
          const height = (bar.value / CHART_MAX) * 100;
          const active = index === HIGHLIGHT;
          return (
            <div key={bar.label} className="flex h-full flex-1 flex-col items-center">
              <div className="relative w-full max-w-[26px] flex-1 overflow-hidden rounded-md bg-white/[0.04]">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute inset-x-0 bottom-0 rounded-md ${
                    active
                      ? "bg-gradient-to-b from-brand-300 to-brand-500 shadow-[0_0_20px_-2px_rgba(139,92,246,0.8)]"
                      : "bg-gradient-to-b from-brand-500 to-brand-700 opacity-80"
                  }`}
                />
              </div>
              <span className="mt-1.5 h-3.5 truncate text-[10px] text-zinc-600">{bar.label}</span>
            </div>
          );
        })}
        <div className="absolute left-[2%] top-[4%] z-10 w-44 rounded-xl border border-white/20 bg-gradient-to-b from-brand-400 to-brand-600 p-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_16px_40px_-12px_rgba(139,92,246,0.9)] sm:left-[7%]">
          <p className="text-[11px] text-white/70">TypeScript</p>
          <div className="mt-1.5 flex justify-between text-xs">
            <span className="text-white/80">Вручную</span>
            <span className="font-semibold">45 мин</span>
          </div>
          <div className="mt-0.5 flex justify-between text-xs">
            <span className="text-white/80">QuickFront</span>
            <span className="font-semibold">5 сек</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FeatureShowcase = () => (
  <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-32 sm:px-6 lg:py-44">
    <div className="mx-auto mb-14 max-w-2xl text-center">
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-[44px] sm:leading-[1.1]">
        Фронтенд без рутины
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-zinc-500">
        Инструменты, которые берут на себя настройку проекта, чтобы вы сразу начинали писать продукт.
      </p>
    </div>

    <div className="grid gap-4 lg:grid-cols-10">
      <Card
        className="lg:col-span-5"
        title="Любой популярный фреймворк"
        text="React, Vue, Svelte, Angular, Next.js и Nuxt — с актуальными версиями и правильной структурой."
      >
        <FrameworksVisual />
      </Card>

      <Card
        className="lg:col-span-5"
        title="AI помощник"
        text="GigaChat подберёт стек, шаблон и функции под вашу задачу прямо во время настройки."
      >
        <OrbitVisual />
      </Card>

      <Card
        className="lg:col-span-4"
        title="Готовые шаблоны"
        text="Магазин, админка, лендинг и блог — с продуманной архитектурой из коробки."
        visualClassName="h-72"
      >
        <TemplatesVisual />
      </Card>

      <Card
        className="lg:col-span-6"
        title="Минуты вместо часов"
        text="Линтеры, тесты, роутинг, i18n и PWA настраиваются автоматически — без чтения документации."
        visualClassName="h-72"
      >
        <ChartVisual />
      </Card>
    </div>
  </section>
);

export default FeatureShowcase;
