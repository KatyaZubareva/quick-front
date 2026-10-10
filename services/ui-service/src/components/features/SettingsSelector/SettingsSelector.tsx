import React from "react";
import { FiDatabase, FiEye, FiGlobe, FiMoon, FiMove, FiServer, FiSmartphone, FiZap } from "react-icons/fi";
import OptionCard from "../../core/OptionCard/OptionCard";
import StepHeader from "../../core/StepHeader/StepHeader";
import { toggleIn } from "../../../utils/toggleIn";

interface SettingsSelectorProps {
  selectedFeatures: string[];
  setSelectedFeatures: React.Dispatch<React.SetStateAction<string[]>>;
  onNext: () => void;
  onBack: () => void;
}

const frontendFeatures = [
  { name: "Dark Mode", description: "Тёмная тема с переключателем.", icon: <FiMoon /> },
  { name: "Live Preview", description: "Просмотр изменений в реальном времени.", icon: <FiEye /> },
  { name: "Drag & Drop", description: "Перетаскивание элементов интерфейса.", icon: <FiMove /> },
  { name: "PWA", description: "Установка приложения на устройство.", icon: <FiSmartphone /> },
  { name: "SSR", description: "Рендеринг на сервере для SEO.", icon: <FiServer /> },
  { name: "i18n", description: "Поддержка нескольких языков.", icon: <FiGlobe /> },
  { name: "Lazy Loading", description: "Загрузка кода по мере необходимости.", icon: <FiZap /> },
  { name: "State Management", description: "Глобальное состояние на Redux Toolkit.", icon: <FiDatabase /> },
];

const SettingsSelector: React.FC<SettingsSelectorProps> = ({ selectedFeatures, setSelectedFeatures }) => {
  const count = frontendFeatures.filter((f) => selectedFeatures.includes(f.name)).length;

  return (
    <div>
      <StepHeader
        eyebrow="Шаг 5"
        title="Функции приложения"
        description="Добавьте готовые возможности — код для них будет сгенерирован автоматически."
        action={<span className="chip">{count} из {frontendFeatures.length}</span>}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {frontendFeatures.map((feature) => (
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

export default SettingsSelector;
