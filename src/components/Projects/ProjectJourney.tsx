import { Icon } from "../Icon";


export function ProjectJourney() {
  const steps = [
    { label: "Plano de trabalho", done: true },
    { label: "Relatórios 1–5", done: true },
    { label: "Defesa parcial", current: true },
    { label: "Relatórios 6–11" },
    { label: "Defesa final" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
              step.done
                ? "bg-green-500 text-white"
                : step.current
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            {step.done ? <Icon name="check" size={15} /> : index + 1}
          </div>

          <span className="flex-1 text-gray-700">{step.label}</span>

          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-8 ${
                step.done ? "bg-green-400" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}