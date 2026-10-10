import React from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { Button } from "../../core/Button/Button";

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isNextDisabled?: boolean;
  nextLabel?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  isFirstStep = false,
  isLastStep = false,
  isNextDisabled = false,
  nextLabel = "Далее",
}) => (
  <div className="flex items-center justify-between gap-3">
    <Button variant="ghost" onClick={onBack} icon={<FiArrowLeft />}>
      {isFirstStep ? "На главную" : "Назад"}
    </Button>
    {!isLastStep && (
      <Button onClick={onNext} disabled={isNextDisabled} iconRight={<FiArrowRight />}>
        {nextLabel}
      </Button>
    )}
  </div>
);

export default NavigationButtons;
