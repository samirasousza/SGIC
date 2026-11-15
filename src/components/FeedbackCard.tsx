export type FeedbackType = "success" | "error";

export interface FeedbackData {
  type: FeedbackType;
  message: string;
}

interface FeedbackCardProps extends FeedbackData {
  successTitle?: string;
  errorTitle?: string;
}

export function FeedbackCard({
  type,
  message,
  successTitle = "Operação concluída",
  errorTitle = "Não foi possível concluir",
}: FeedbackCardProps) {
  const success = type === "success";

  return (
    <div
      role={success ? "status" : "alert"}
      className={`flex items-start gap-3 rounded-xl border p-4 ${
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
          success
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {success ? "✓" : "!"}
      </span>

      <div className="min-w-0 flex-1">
        <strong className="text-sm font-semibold">
          {success ? successTitle : errorTitle}
        </strong>
        <p className="mt-1 break-words text-sm">{message}</p>
      </div>
    </div>
  );
}
