import type { SettingsFeedback as SettingsFeedbackType } from "./settingsTypes";

type SettingsFeedbackProps = {
  feedback: SettingsFeedbackType;
};

export function SettingsFeedback({ feedback }: SettingsFeedbackProps) {
  if (!feedback) return null;

  return (
    <div
      className={`rounded-lg border p-3 text-sm ${
        feedback.type === "success"
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
      role="status"
    >
      {feedback.message}
    </div>
  );
}
