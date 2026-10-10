import React from "react";
import { SiAngular, SiNextdotjs, SiNuxtdotjs, SiReact, SiSvelte, SiVuedotjs } from "react-icons/si";
import { TEMPLATES } from "../../../data/templates";
import OptionCard from "../../core/OptionCard/OptionCard";
import StepHeader from "../../core/StepHeader/StepHeader";

interface Framework {
  versions: string[];
  description: string;
  icon: React.ReactNode;
}

interface FrameworkSelectorProps {
  selectedFramework: string | null;
  setSelectedFramework: React.Dispatch<React.SetStateAction<string | null>>;
  selectedVersion: string | null;
  setSelectedVersion: React.Dispatch<React.SetStateAction<string | null>>;
  onNext: () => void;
}

const frameworks: Record<string, Framework> = {
  React: {
    versions: ["18.0.0", "17.0.0"],
    description: "Библиотека для интерфейсов с компонентным подходом.",
    icon: <SiReact className="text-[#61DAFB]" />,
  },
  Vue: {
    versions: ["3.2.0", "2.6.0"],
    description: "Прогрессивный фреймворк с реактивным data-binding.",
    icon: <SiVuedotjs className="text-[#42B883]" />,
  },
  Svelte: {
    versions: ["3.50.0"],
    description: "Компилируемый фреймворк без виртуального DOM.",
    icon: <SiSvelte className="text-[#FF3E00]" />,
  },
  Angular: {
    versions: ["16.0.0", "15.2.0"],
    description: "Полноценная платформа для корпоративных приложений.",
    icon: <SiAngular className="text-[#DD0031]" />,
  },
  "Next.js": {
    versions: ["13.4.0", "12.3.0"],
    description: "React-фреймворк с SSR и статической генерацией.",
    icon: <SiNextdotjs className="text-white" />,
  },
  "Nuxt.js": {
    versions: ["3.1.0", "2.15.8"],
    description: "Vue-фреймворк для универсальных приложений.",
    icon: <SiNuxtdotjs className="text-[#00DC82]" />,
  },
};

const hasTemplates = (framework: string) => TEMPLATES.some((t) => t.frameworks.includes(framework));

const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({
  selectedFramework,
  setSelectedFramework,
  selectedVersion,
  setSelectedVersion,
}) => {
  const handleFrameworkSelect = (framework: string) => {
    setSelectedFramework(framework);
    setSelectedVersion(frameworks[framework].versions[0]);
  };

  return (
    <div>
      <StepHeader
        eyebrow="Шаг 2"
        title="Выберите фреймворк"
        description="От выбора зависят доступные шаблоны и структура сгенерированного проекта."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Object.entries(frameworks).map(([name, framework]) => {
          const available = hasTemplates(name);
          return (
            <OptionCard
              key={name}
              title={name}
              description={framework.description}
              icon={framework.icon}
              selected={selectedFramework === name}
              disabled={!available}
              badge={available ? undefined : "скоро"}
              onClick={() => handleFrameworkSelect(name)}
            />
          );
        })}
      </div>

      {selectedFramework && (
        <div className="mt-8 animate-fade-up">
          <p className="mb-3 text-sm font-medium text-zinc-200">Версия {selectedFramework}</p>
          <div className="inline-flex flex-wrap gap-1 rounded-xl border border-white/[0.08] bg-zinc-900/80 p-1">
            {frameworks[selectedFramework].versions.map((version) => {
              const active = selectedVersion === version;
              return (
                <button
                  key={version}
                  type="button"
                  onClick={() => setSelectedVersion(version)}
                  aria-pressed={active}
                  className={`rounded-lg px-4 py-1.5 font-mono text-[13px] transition ${
                    active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {version}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FrameworkSelector;
