import React from "react";
import { FiFilter, FiGitCommit } from "react-icons/fi";
import { SiCypress, SiEslint, SiJest, SiPrettier, SiStorybook, SiTypescript } from "react-icons/si";
import OptionCard from "../../core/OptionCard/OptionCard";
import StepHeader from "../../core/StepHeader/StepHeader";
import { toggleIn } from "../../../utils/toggleIn";

interface ConfigSelectorProps {
  selectedFeatures: string[];
  setSelectedFeatures: React.Dispatch<React.SetStateAction<string[]>>;
  onNext?: () => void;
  onBack?: () => void;
}

interface Feature {
  name: string;
  description: string;
  icon: React.ReactNode;
}

const projectConfigFeatures: Feature[] = [
  { name: "TypeScript", description: "Статическая типизация кода.", icon: <SiTypescript /> },
  { name: "ESLint", description: "Линтинг для единого стиля и качества.", icon: <SiEslint /> },
  { name: "Prettier", description: "Автоматическое форматирование.", icon: <SiPrettier /> },
  { name: "Husky", description: "Git-хуки для автоматизации задач.", icon: <FiGitCommit /> },
  { name: "Lint-Staged", description: "Проверки только для staged файлов.", icon: <FiFilter /> },
  { name: "Jest", description: "Unit-тестирование.", icon: <SiJest /> },
  { name: "Cypress", description: "End-to-end тестирование.", icon: <SiCypress /> },
  { name: "Storybook", description: "Среда для разработки UI-компонентов.", icon: <SiStorybook /> },
];

const ConfigSelector: React.FC<ConfigSelectorProps> = ({ selectedFeatures, setSelectedFeatures }) => {
  const count = projectConfigFeatures.filter((f) => selectedFeatures.includes(f.name)).length;

  return (
    <div>
      <StepHeader
        eyebrow="Шаг 4"
        title="Инструменты разработки"
        description="Подключите проверенные инструменты для качества кода и тестирования."
        action={<span className="chip">{count} из {projectConfigFeatures.length}</span>}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {projectConfigFeatures.map((feature) => (
          <OptionCard
            key={feature.name}
            multi
            title={feature.name}
            description={feature.description}
            icon={feature.icon}
            selected={selectedFeatures.includes(feature.name)}
            onClick={() => setSelectedFeatures((prev) => toggleIn(prev, feature.name))}
          />
        ))}
      </div>
    </div>
  );
};

export default ConfigSelector;
