import type { EvaluationFormModel, SaveEvaluationModel } from "../../models/evaluationModel";
import { ScoreField } from "./ScoreField";

const fieldClass = "flex flex-col gap-2 text-sm font-medium text-slate-700";
const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50";
const textareaClass = `${inputClass} min-h-28 resize-y`;

interface EvaluationFieldsProps {
  form: EvaluationFormModel;
  value: SaveEvaluationModel;
  disabled?: boolean;
  onChange: (value: SaveEvaluationModel) => void;
}

export function EvaluationFields({
  form,
  value,
  disabled = false,
  onChange,
}: EvaluationFieldsProps) {
  const updateItem = (
    code: EvaluationFormModel["items"][number]["code"],
    changes: { score?: number | null; notApplicable?: boolean },
  ) => {
    const currentItems = form.items.filter((item) => item.scale !== "COMPUTED").map((item) => {
      const current = value.items?.find((entry) => entry.code === item.code);
      return {
        code: item.code,
        score: current ? current.score : item.score,
        notApplicable: current ? current.notApplicable : item.notApplicable,
      };
    });

    onChange({
      ...value,
      items: currentItems.map((item) =>
        item.code === code ? { ...item, ...changes } : item,
      ),
    });
  };

  const sections = Array.from(new Set(form.items.map((item) => item.section)));

  return (
    <div className="space-y-6">
      {form.formType === "BOARD" && (
        <label className={fieldClass}>
          Tempo de apresentação (mm:ss)
          <input
            value={value.presentationTime ?? form.presentationTime ?? ""}
            onChange={(event) =>
              onChange({ ...value, presentationTime: event.target.value })
            }
            placeholder="Ex.: 13:45"
            disabled={disabled}
            className={inputClass}
            inputMode="numeric"
            pattern="[0-9]{1,3}:[0-5][0-9]"
          />
          <span className="text-xs font-normal text-slate-400">
            A nota deste item é calculada automaticamente pelo sistema.
          </span>
        </label>
      )}

      {sections.map((section) => (
        <section key={section} className="space-y-4">
          <h3 className="border-b border-slate-100 pb-2 text-sm font-semibold text-slate-800">
            {section}
          </h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {form.items
              .filter((item) => item.section === section)
              .map((item) => {
                const current = value.items?.find((entry) => entry.code === item.code);
                const score = current ? current.score : item.score;
                const notApplicable = current ? current.notApplicable : item.notApplicable;

                if (item.scale === "COMPUTED") {
                  return (
                    <div key={item.code} className={fieldClass}>
                      {item.label}
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-normal text-slate-600">
                        {score === null ? "A nota será calculada após informar o tempo." : `Nota calculada: ${score}`}
                      </div>
                    </div>
                  );
                }

                return (
                  <ScoreField
                    key={item.code}
                    label={item.label}
                    value={score}
                    allowedValues={item.allowedValues}
                    notApplicable={notApplicable}
                    disabled={disabled}
                    onChange={(nextScore) =>
                      updateItem(item.code, { score: nextScore, notApplicable: false })
                    }
                    onNotApplicableChange={
                      item.allowsNotApplicable
                        ? (checked) =>
                            updateItem(item.code, {
                              notApplicable: checked,
                              score: checked ? null : score,
                            })
                        : undefined
                    }
                  />
                );
              })}
          </div>
        </section>
      ))}

      <label className={fieldClass}>
        Comentários
        <textarea
          value={value.comments ?? form.comments ?? ""}
          onChange={(event) => onChange({ ...value, comments: event.target.value })}
          maxLength={5000}
          disabled={disabled}
          placeholder="Registre observações complementares, se necessário..."
          className={textareaClass}
        />
        <span className="text-right text-xs font-normal text-slate-400">
          {(value.comments ?? form.comments ?? "").length}/5000
        </span>
      </label>
    </div>
  );
}
