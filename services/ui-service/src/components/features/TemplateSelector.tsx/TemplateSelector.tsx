import React, { useState } from "react";
import { createPortal } from "react-dom";
import { TEMPLATES } from "../../../data/templates.tsx";
import { ProjectTemplate } from "../../../types/template.tsx";
import { FiCheck, FiLayout, FiPlus, FiSave, FiSliders, FiSquare, FiTrash2, FiType, FiX } from "react-icons/fi";
import StepHeader from "../../core/StepHeader/StepHeader";
import { Button } from "../../core/Button/Button";

interface TemplateSelectorProps {
  selectedFramework: string | null;
  onSelectTemplate: (templateId: string) => void;
  selectedTemplate: string | null;
  templates: ProjectTemplate[];
  onBack?: () => void;
  onNext?: () => void;
}

type ComponentType = "header" | "footer" | "button";

interface UIComponent {
  id: string;
  type: ComponentType;
  content: string;
  styles: React.CSSProperties;
}

const PALETTE: { type: ComponentType; title: string; hint: string; icon: React.ReactNode }[] = [
  { type: "header", title: "Шапка", hint: "Верхняя навигация", icon: <FiType /> },
  { type: "footer", title: "Подвал", hint: "Нижний колонтитул", icon: <FiType /> },
  { type: "button", title: "Кнопка", hint: "Интерактивный элемент", icon: <FiSquare /> },
];

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: "Начальный",
  intermediate: "Средний",
  advanced: "Продвинутый",
};

const createComponent = (type: ComponentType): UIComponent => ({
  id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  type,
  content: type === "button" ? "Нажми меня" : type === "header" ? "Добро пожаловать" : "© 2025 Моё приложение",
  styles: {
    padding: type === "button" ? "10px 20px" : "20px",
    backgroundColor: type === "button" ? "#8b5cf6" : type === "header" ? "#18181b" : "#09090b",
    color: "#ffffff",
    borderRadius: type === "button" ? "12px" : "0",
    width: type === "button" ? "fit-content" : "100%",
    textAlign: "center",
    fontSize: type === "header" ? "18px" : "14px",
    fontWeight: type === "button" ? "500" : "600",
    cursor: "pointer",
    border: "none",
    transition: "all 0.2s ease",
    ...(type === "button" ? { margin: "24px auto" } : {}),
    ...(type === "footer" ? { marginTop: "auto" } : {}),
  },
});

const ColorField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="mb-2 block text-xs font-medium text-zinc-400">{label}</label>
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 p-1.5">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent font-mono text-xs text-zinc-200 focus:outline-none"
      />
    </div>
  </div>
);

const Segmented = ({
  label,
  options,
  value,
  onChange,
  format = (v: string) => v,
}: {
  label: string;
  options: string[];
  value?: string | number;
  onChange: (v: string) => void;
  format?: (v: string) => string;
}) => (
  <div>
    <label className="mb-2 block text-xs font-medium text-zinc-400">{label}</label>
    <div className="grid grid-cols-5 gap-1 rounded-xl border border-white/10 bg-zinc-900 p-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-lg py-1.5 text-xs transition ${
            value === option ? "bg-white text-zinc-900" : "text-zinc-400 hover:text-white"
          }`}
        >
          {format(option)}
        </button>
      ))}
    </div>
  </div>
);

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedFramework,
  onSelectTemplate,
  selectedTemplate,
}) => {
  const [showUIConstructor, setShowUIConstructor] = useState(false);
  const [uiComponents, setUIComponents] = useState<UIComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const filteredTemplates = TEMPLATES.filter((template: ProjectTemplate) =>
    selectedFramework ? template.frameworks.includes(selectedFramework) : true
  );

  const isCustomSelected = !!selectedTemplate?.startsWith("custom-ui");
  const current = uiComponents.find((c) => c.id === selectedComponent);

  const addComponents = (...types: ComponentType[]) => {
    setUIComponents((prev) => [...prev, ...types.map(createComponent)]);
  };

  const updateComponent = (id: string, patch: Partial<UIComponent>) => {
    setUIComponents((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const updateStyle = (id: string, property: keyof React.CSSProperties, value: string) => {
    setUIComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, styles: { ...c.styles, [property]: value } } : c))
    );
  };

  const openUIConstructor = () => {
    setUIComponents([]);
    setSelectedComponent(null);
    setShowUIConstructor(true);
  };

  const handleSaveUIConstructor = () => {
    onSelectTemplate(`custom-ui-${Date.now()}`);
    setShowUIConstructor(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const type = e.dataTransfer.getData("componentType") as ComponentType;
    if (type) addComponents(type);
  };

  const constructor = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex h-full max-h-[880px] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="flex h-14 items-center justify-between border-b border-white/[0.08] px-4">
          <div className="flex items-center gap-2.5 text-sm font-medium text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
              <FiLayout size={14} />
            </span>
            UI конструктор
          </div>
          <button
            type="button"
            onClick={() => setShowUIConstructor(false)}
            aria-label="Закрыть"
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <FiX />
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-64 shrink-0 flex-col border-r border-white/[0.08] p-4 md:flex">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">Компоненты</p>
            <div className="space-y-2">
              {PALETTE.map((item) => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("componentType", item.type)}
                  onDoubleClick={() => addComponents(item.type)}
                  className="flex cursor-grab items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition hover:border-white/20 hover:bg-white/[0.05] active:cursor-grabbing"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-zinc-300">
                    {item.icon}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-zinc-100">{item.title}</span>
                    <span className="block text-xs text-zinc-500">{item.hint}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-auto space-y-1.5 border-t border-white/[0.08] pt-4 text-xs leading-relaxed text-zinc-500">
              <p>Перетащите компонент на холст или дважды кликните по нему.</p>
              <p>Кликните по элементу на холсте, чтобы изменить стиль.</p>
            </div>
          </aside>

          <div
            className={`relative flex min-w-0 flex-1 flex-col overflow-auto bg-zinc-100 transition ${
              isDragOver ? "ring-2 ring-inset ring-brand-500" : ""
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onClick={() => setSelectedComponent(null)}
          >
            {uiComponents.length === 0 ? (
              <div className="m-auto flex max-w-sm flex-col items-center p-8 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand-500 shadow-sm">
                  <FiLayout size={28} />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">Пустой холст</h3>
                <p className="mb-6 mt-1 text-sm text-zinc-500">
                  Перетащите компоненты с панели слева или начните с готового набора.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addComponents("header", "button", "footer");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  <FiPlus /> Добавить пример
                </button>
              </div>
            ) : (
              <div className="flex min-h-full flex-col">
                {uiComponents.map((component) => (
                  <div
                    key={component.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedComponent(component.id === selectedComponent ? null : component.id);
                    }}
                    style={component.styles}
                    className={`relative ${
                      selectedComponent === component.id
                        ? "outline outline-2 outline-offset-2 outline-brand-500"
                        : "hover:outline hover:outline-1 hover:outline-brand-400/60"
                    }`}
                  >
                    {component.content}
                    {selectedComponent === component.id && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUIComponents((prev) => prev.filter((c) => c.id !== component.id));
                          setSelectedComponent(null);
                        }}
                        className={`absolute rounded-md bg-red-500 p-1.5 text-white shadow transition hover:bg-red-600 ${component.type === "button" ? "-right-3 -top-3" : "right-2 top-1/2 -translate-y-1/2"}`}
                        title="Удалить"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {current && (
            <aside className="w-80 shrink-0 space-y-5 overflow-y-auto border-l border-white/[0.08] p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <FiSliders className="text-brand-400" /> Стили элемента
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-zinc-400">Текст</label>
                <input
                  type="text"
                  value={current.content}
                  onChange={(e) => updateComponent(current.id, { content: e.target.value })}
                  className="field py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ColorField
                  label="Фон"
                  value={String(current.styles.backgroundColor ?? "#18181b")}
                  onChange={(v) => updateStyle(current.id, "backgroundColor", v)}
                />
                <ColorField
                  label="Цвет текста"
                  value={String(current.styles.color ?? "#ffffff")}
                  onChange={(v) => updateStyle(current.id, "color", v)}
                />
              </div>
              <Segmented
                label="Размер шрифта"
                options={["12px", "14px", "16px", "18px", "20px"]}
                value={current.styles.fontSize}
                onChange={(v) => updateStyle(current.id, "fontSize", v)}
                format={(v) => v.replace("px", "")}
              />
              <Segmented
                label="Скругление"
                options={["0", "4px", "8px", "12px", "999px"]}
                value={current.styles.borderRadius}
                onChange={(v) => updateStyle(current.id, "borderRadius", v)}
                format={(v) => (v === "999px" ? "●" : v.replace("px", ""))}
              />
              <div>
                <label className="mb-2 block text-xs font-medium text-zinc-400">Отступы</label>
                <input
                  type="text"
                  value={String(current.styles.padding ?? "")}
                  onChange={(e) => updateStyle(current.id, "padding", e.target.value)}
                  className="field py-2 font-mono text-xs"
                  placeholder="8px 16px"
                />
              </div>
            </aside>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.08] px-4 py-3">
          <span className="text-sm text-zinc-500">
            {uiComponents.length} {uiComponents.length === 1 ? "компонент" : "компонентов"}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setShowUIConstructor(false)}>
              Отмена
            </Button>
            <Button icon={<FiSave />} onClick={handleSaveUIConstructor} disabled={uiComponents.length === 0}>
              Сохранить шаблон
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <StepHeader
        eyebrow="Шаг 3"
        title={selectedFramework ? `Шаблоны для ${selectedFramework}` : "Шаблоны"}
        description="Начните с готовой основы или соберите собственный макет в конструкторе."
        action={
          <Button variant="outline" size="sm" icon={<FiLayout />} onClick={openUIConstructor}>
            UI конструктор
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filteredTemplates.map((template: ProjectTemplate) => {
          const isActive = selectedTemplate === template.id;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelectTemplate(template.id)}
              aria-pressed={isActive}
              className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-150 ${
                isActive
                  ? "border-brand-500/70 bg-brand-500/[0.06] shadow-glow"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex h-28 items-center justify-center border-b border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent [&_svg]:h-16 [&_svg]:w-16">
                {template.icon}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-zinc-100">{template.name}</h3>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                      isActive ? "border-brand-500 bg-brand-500 text-white" : "border-white/20 text-transparent"
                    }`}
                  >
                    <FiCheck size={12} strokeWidth={3} />
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-zinc-400">{template.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {template.features.slice(0, 3).map((feature) => (
                    <span key={feature} className="chip">
                      {feature}
                    </span>
                  ))}
                  {template.features.length > 3 && (
                    <span className="chip text-zinc-500">+{template.features.length - 3}</span>
                  )}
                </div>
                {template.difficulty && (
                  <p className="mt-3 text-xs text-zinc-500">Уровень: {DIFFICULTY_LABEL[template.difficulty]}</p>
                )}
              </div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={openUIConstructor}
          className={`flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-6 text-center transition ${
            isCustomSelected
              ? "border-brand-500/70 bg-brand-500/[0.06] shadow-glow"
              : "border-white/15 hover:border-white/30 hover:bg-white/[0.03]"
          }`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-zinc-200">
            {isCustomSelected ? <FiCheck /> : <FiPlus />}
          </span>
          <span>
            <span className="block font-medium text-zinc-100">
              {isCustomSelected ? "Свой дизайн сохранён" : "Свой дизайн"}
            </span>
            <span className="mt-1 block text-[13px] text-zinc-400">
              {isCustomSelected ? "Нажмите, чтобы собрать заново" : "Соберите макет из готовых блоков"}
            </span>
          </span>
        </button>
      </div>

      {showUIConstructor && createPortal(constructor, document.body)}
    </div>
  );
};

export default TemplateSelector;
