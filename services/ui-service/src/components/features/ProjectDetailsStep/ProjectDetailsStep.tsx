import React from "react";
import { FiAlertCircle } from "react-icons/fi";
import StepHeader from "../../core/StepHeader/StepHeader";

interface ProjectDetailsStepProps {
  projectName: string;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
  projectDescription: string;
  setProjectDescription: React.Dispatch<React.SetStateAction<string>>;
  errors: { projectName?: string; projectDescription?: string };
  clearErrors: () => void;
}

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="mt-2 flex items-center gap-1.5 text-[13px] text-red-400">
      <FiAlertCircle className="shrink-0" />
      {message}
    </p>
  ) : null;

const ProjectDetailsStep: React.FC<ProjectDetailsStepProps> = ({
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
  errors,
  clearErrors,
}) => (
  <div>
    <StepHeader
      eyebrow="Шаг 1"
      title="Расскажите о проекте"
      description="Название станет именем пакета и репозитория, а описание попадёт в README.md."
    />

    <div className="space-y-6">
      <div>
        <label htmlFor="project-name" className="mb-2 block text-sm font-medium text-zinc-200">
          Название проекта
        </label>
        <input
          id="project-name"
          type="text"
          autoFocus
          value={projectName}
          onChange={(e) => {
            setProjectName(e.target.value);
            clearErrors();
          }}
          className={`field ${errors.projectName ? "field-error" : ""}`}
          placeholder="my-awesome-app"
          aria-invalid={!!errors.projectName}
        />
        <FieldError message={errors.projectName} />
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor="project-description" className="block text-sm font-medium text-zinc-200">
            Описание
          </label>
          <span className="text-xs tabular-nums text-zinc-500">{projectDescription.length} / 500</span>
        </div>
        <textarea
          id="project-description"
          value={projectDescription}
          maxLength={500}
          onChange={(e) => {
            setProjectDescription(e.target.value);
            clearErrors();
          }}
          className={`field resize-none leading-relaxed ${errors.projectDescription ? "field-error" : ""}`}
          placeholder="Например: панель управления для аналитики продаж с графиками и фильтрами"
          rows={5}
          aria-invalid={!!errors.projectDescription}
        />
        <FieldError message={errors.projectDescription} />
      </div>
    </div>
  </div>
);

export default ProjectDetailsStep;
