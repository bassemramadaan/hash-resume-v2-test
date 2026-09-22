import React from 'react';
import { motion } from 'motion/react';

export interface StepItem {
  id: string;
  stepNumber: string;
  labelAr: string;
  labelEn: string;
  kickerAr?: string;
  isCompleted: boolean;
}

interface StepProgressBarProps {
  steps: StepItem[];
  currentStepIndex: number;
  subStepIndex?: number;
  totalSubSteps?: number;
  isAr?: boolean;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  steps,
  currentStepIndex,
  subStepIndex = 0,
  totalSubSteps = 1,
  isAr = true,
}) => {
  const currentStep = steps[currentStepIndex] || steps[0];
  const stepNumber = currentStepIndex + 1;
  const totalSteps = steps.length;

  // Calculate fine-grained fractional progress across main steps + sub-steps
  const baseProgress = (currentStepIndex / totalSteps) * 100;
  const subStepProgress = totalSubSteps > 0 ? (subStepIndex / totalSubSteps) * (100 / totalSteps) : 0;
  const progressPercent = Math.min(Math.max(baseProgress + subStepProgress, 4), 100);

  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 pt-3.5 sm:pt-6 pb-1.5 sm:pb-2">
      {/* Thin Progress Bar */}
      <div className="w-full h-1 sm:h-1.5 bg-[#e8e5de] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#FF4D2D] rounded-full"
          initial={{ width: '4%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Progress Meta Row */}
      <div className="mt-2 sm:mt-3 flex items-center justify-between text-[11px] sm:text-sm text-[#7a8093]">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-bold text-[#12141a]">
            {isAr ? `خطوة ${stepNumber} من ${totalSteps}` : `Step ${stepNumber} of ${totalSteps}`}
          </span>
          <span className="text-[#e2dec9]">•</span>
          <span className="font-semibold text-[#001639] truncate max-w-[160px] sm:max-w-none">
            {isAr ? currentStep.labelAr : currentStep.labelEn}
          </span>
        </div>

        <span className="text-[11px] sm:text-xs text-[#7a8093] hidden sm:inline font-medium">
          {isAr ? 'هتخلص في أقل من دقيقتين' : 'Takes less than 2 minutes'}
        </span>
      </div>

      {/* 7 Dot Indicators */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 mt-2 sm:mt-3.5">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isCompleted = step.isCompleted || idx < currentStepIndex;

          return (
            <div
              key={step.id}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-5 sm:w-6 bg-[#FF4D2D]'
                  : isCompleted
                  ? 'w-2 sm:w-2.5 bg-[#1f8a5f]'
                  : 'w-1.5 sm:w-2 bg-[#d6d2c4]'
              }`}
              title={isAr ? step.labelAr : step.labelEn}
            />
          );
        })}
      </div>
    </div>
  );
};
