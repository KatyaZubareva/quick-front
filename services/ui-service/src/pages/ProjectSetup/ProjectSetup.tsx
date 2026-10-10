import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiMessageSquare, FiX } from "react-icons/fi";
import StepProgress, { StepInfo } from "../../components/core/Progress/StepProgress";
import Logo from "../../components/core/Logo/Logo";
import ProjectDetailsStep from "../../components/features/ProjectDetailsStep/ProjectDetailsStep";
import FrameworkSelector from "../../components/features/FrameworkSelector/FrameworkSelector";
import SettingsSelector from "../../components/features/SettingsSelector/SettingsSelector";
import ConfigSelector from "../../components/features/ConfigSelector/ConfigSelector";
import DownloadStep from "../../components/features/DownloadStep/DownloadStep";
import NavigationButtons from "../../components/layout/Navigation/NavigationButtons";
import TemplateSelector from "../../components/features/TemplateSelector.tsx/TemplateSelector";
import { TEMPLATES } from "../../data/templates.tsx";
import { AIAssistant } from "../../components/ai/AIAssistant";

const STEPS: StepInfo[] = [
  { title: "Детали", description: "Название и описание" },
  { title: "Фреймворк", description: "Технология и версия" },
  { title: "Шаблон", description: "Готовая основа" },
  { title: "Инструменты", description: "Качество кода и тесты" },
  { title: "Функции", description: "Возможности приложения" },
  { title: "Готово", description: "Скачать или отправить" },
];

const TOTAL_STEPS = STEPS.length;

const SummaryRow = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex items-center justify-between gap-3 py-2 text-sm">
    <span className="text-zinc-500">{label}</span>
    <span className={`truncate text-right ${value ? "text-zinc-200" : "text-zinc-600"}`}>{value || "—"}</span>
  </div>
);

const ProjectSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ projectName?: string; projectDescription?: string }>({});
  const [frameworkError, setFrameworkError] = useState<string | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const validateCurrentStep = () => {
    if (step === 1) {
      const newErrors: { projectName?: string; projectDescription?: string } = {};

      if (!projectName.trim()) {
        newErrors.projectName = "Название проекта обязательно";
      } else if (projectName.trim().length < 3) {
        newErrors.projectName = "Название проекта должно содержать не менее 3 символов";
      }

      if (!projectDescription.trim()) {
        newErrors.projectDescription = "Требуется описание проекта";
      } else if (projectDescription.trim().length < 10) {
        newErrors.projectDescription = "Описание должно быть не менее 10 символов";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    if (step === 2) {
      if (!selectedFramework) {
        setFrameworkError("Пожалуйста, выберите фреймворк перед продолжением.");
        return false;
      }
      setFrameworkError(null);
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
    }
  };

  const handlePreviousStep = () => {
    if (step === 1) {
      navigate("/");
      return;
    }
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFrameworkChange: React.Dispatch<React.SetStateAction<string | null>> = (framework) => {
    setSelectedFramework(framework);
    setSelectedTemplate(null);
    setFrameworkError(null);
  };

  const handleSelectTemplate = (templateCode: string | null) => {
    setSelectedTemplate(templateCode);
  };

  const clearErrors = () => {
    setErrors({});
  };

  const handleSuggestion = () => {
    setUnreadMessages(0);
  };

  const handleNewMessage = () => {
    if (!showAssistant) {
      setUnreadMessages((prev) => prev + 1);
    }
  };

  const toggleAssistant = () => {
    setShowAssistant((prev) => {
      if (!prev) setUnreadMessages(0);
      return !prev;
    });
  };

  const filteredTemplates = selectedFramework
    ? TEMPLATES.filter((t) => t.frameworks.includes(selectedFramework))
    : [];

  const templateName = selectedTemplate
    ? TEMPLATES.find((t) => t.id === selectedTemplate)?.name ??
      (selectedTemplate.startsWith("custom-ui") ? "Свой дизайн" : selectedTemplate)
    : null;

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 bg-grid" />
      <div className="pointer-events-none fixed left-1/2 top-[-20%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand-600/15 blur-[120px]" />

      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-zinc-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="На главную">
            <Logo />
          </Link>
          <button
            type="button"
            onClick={toggleAssistant}
            className={`relative inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition ${
              showAssistant
                ? "border-brand-500/50 bg-brand-500/15 text-brand-200"
                : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:text-white"
            }`}
          >
            <FiMessageSquare />
            <span className="hidden sm:inline">AI помощник</span>
            {unreadMessages > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-fuchsia-500 px-1 text-[11px] font-semibold text-white">
                {unreadMessages}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 lg:py-12">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <StepProgress
            steps={STEPS}
            currentStep={step - 1}
            onStepClick={(index) => setStep(index + 1)}
          />

          <div className="surface mt-10 hidden p-5 lg:block">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">Ваш проект</p>
            <div className="divide-y divide-white/[0.06]">
              <SummaryRow label="Название" value={projectName.trim() || null} />
              <SummaryRow
                label="Фреймворк"
                value={selectedFramework ? `${selectedFramework}${selectedVersion ? ` ${selectedVersion}` : ""}` : null}
              />
              <SummaryRow label="Шаблон" value={templateName} />
              <SummaryRow
                label="Опции"
                value={selectedFeatures.length ? `${selectedFeatures.length} выбрано` : null}
              />
            </div>
          </div>
        </aside>

        <section className="surface flex min-h-[560px] flex-col overflow-hidden">
          <div className="flex-1 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {step === 1 && (
                  <ProjectDetailsStep
                    projectName={projectName}
                    setProjectName={setProjectName}
                    projectDescription={projectDescription}
                    setProjectDescription={setProjectDescription}
                    errors={errors}
                    clearErrors={clearErrors}
                  />
                )}
                {step === 2 && (
                  <>
                    <FrameworkSelector
                      onNext={handleNextStep}
                      selectedFramework={selectedFramework}
                      setSelectedFramework={handleFrameworkChange}
                      selectedVersion={selectedVersion}
                      setSelectedVersion={setSelectedVersion}
                    />
                    {frameworkError && (
                      <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        <FiAlertCircle className="shrink-0" />
                        {frameworkError}
                      </div>
                    )}
                  </>
                )}
                {step === 3 && (
                  <TemplateSelector
                    onNext={handleNextStep}
                    onBack={handlePreviousStep}
                    onSelectTemplate={handleSelectTemplate}
                    selectedTemplate={selectedTemplate}
                    selectedFramework={selectedFramework}
                    templates={filteredTemplates}
                  />
                )}
                {step === 4 && (
                  <ConfigSelector
                    onNext={handleNextStep}
                    onBack={handlePreviousStep}
                    selectedFeatures={selectedFeatures}
                    setSelectedFeatures={setSelectedFeatures}
                  />
                )}
                {step === 5 && (
                  <SettingsSelector
                    onNext={handleNextStep}
                    onBack={handlePreviousStep}
                    selectedFeatures={selectedFeatures}
                    setSelectedFeatures={setSelectedFeatures}
                  />
                )}
                {step === 6 && (
                  <DownloadStep
                    onBack={handlePreviousStep}
                    selectedFramework={selectedFramework}
                    selectedVersion={selectedVersion}
                    selectedFeatures={selectedFeatures}
                    selectedTemplate={selectedTemplate}
                    templateName={templateName}
                    projectName={projectName}
                    projectDescription={projectDescription}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="border-t border-white/[0.06] bg-white/[0.015] px-6 py-4 sm:px-8">
            <NavigationButtons
              onBack={handlePreviousStep}
              onNext={handleNextStep}
              isFirstStep={step === 1}
              isLastStep={step === TOTAL_STEPS}
              nextLabel={step === TOTAL_STEPS - 1 ? "Завершить" : "Далее"}
              isNextDisabled={
                (step === 1 && Object.keys(errors).length > 0) ||
                (step === 2 && !selectedFramework)
              }
            />
          </div>
        </section>
      </main>

      <AnimatePresence>
        {showAssistant && (
          <motion.div
            className="fixed inset-x-3 bottom-3 z-40 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <button
              type="button"
              onClick={toggleAssistant}
              aria-label="Закрыть помощника"
              className="absolute right-3 top-3.5 z-10 rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <FiX />
            </button>
            <AIAssistant
              onSuggestion={handleSuggestion}
              onNewMessage={handleNewMessage}
              currentStep={step}
              selectedFramework={selectedFramework}
              selectedFeatures={selectedFeatures}
              selectedTemplate={selectedTemplate}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectSetup;
