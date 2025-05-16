import { cn } from "@/lib/utils";

interface BookingStepsProps {
  activeStep: number;
}

interface StepInfo {
  number: number;
  label: string;
}

const steps: StepInfo[] = [
  { number: 1, label: "Room Selection" },
  { number: 2, label: "Guest Details" },
  { number: 3, label: "Payment" },
  { number: 4, label: "Confirmation" }
];

export default function BookingSteps({ activeStep }: BookingStepsProps) {
  return (
    <div className="max-w-3xl mx-auto mb-10">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="w-full flex items-center">
            <div 
              className={cn(
                "relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-medium",
                activeStep >= step.number 
                  ? "bg-primary text-white" 
                  : "bg-neutral-200 text-neutral-600"
              )}
            >
              {step.number}
            </div>
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "flex-grow h-0.5",
                  activeStep > step.number ? "bg-primary" : "bg-neutral-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-sm font-medium">
        {steps.map((step) => (
          <div 
            key={step.number} 
            className={cn(
              "w-full text-center",
              activeStep >= step.number ? "text-primary" : "text-neutral-600"
            )}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}
