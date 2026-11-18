import type {
  EvaluationFormModel,
  SaveEvaluationModel,
} from "../../models/evaluationModel";
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
    const currentItems = form.items
      .filter((item) => item.scale !== "COMPUTED")
      .map((item) => {
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
    <div className="space-y-8">
      {form.formType === "BOARD" && (
        <section className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
          <label className={fieldClass}>
            <span className="text-base font-semibold text-slate-800">
              Tempo de apresentação
            </span>

            <span className="text-xs font-normal text-slate-500">
              Informe o tempo total da apresentação no formato mm:ss.
            </span>

            <input
              value={value.presentationTime ?? form.presentationTime ?? ""}
              onChange={(event) =>
                onChange({
                  ...value,
                  presentationTime: event.target.value,
                })
              }
              placeholder="Ex.: 13:45"
              disabled={disabled}
              className={inputClass}
              inputMode="numeric"
              pattern="[0-9]{1,3}:[0-5][0-9]"
            />

            <span className="text-xs font-normal text-indigo-700">
              O tempo recomendado é de 13 a 15 minutos. A nota deste item é
              calculada automaticamente pelo sistema.
            </span>
          </label>
        </section>
      )}

      {sections.map((section) => {
        const sectionItems = form.items.filter(
          (item) => item.section === section,
        );

        return (
          <section
            key={section}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <h3 className="text-base font-bold text-slate-800">{section}</h3>
            </div>

            <div className="hidden grid-cols-[1fr_150px] gap-4 border-b border-slate-200 bg-slate-50/70 px-5 py-3 sm:grid">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Itens a avaliar
              </span>
              <span className="text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                Nota
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {sectionItems.map((item) => {
                const current = value.items?.find(
                  (entry) => entry.code === item.code,
                );

                const score = current ? current.score : item.score;

                const notApplicable = current
                  ? current.notApplicable
                  : item.notApplicable;

                if (item.scale === "COMPUTED") {
                  return (
                    <div
                      key={item.code}
                      className="grid grid-cols-1 gap-3 px-5 py-5 sm:grid-cols-[1fr_150px] sm:items-center sm:gap-4"
                    >
                      <div>
                        <p className="text-sm font-medium leading-relaxed text-slate-700">
                          {item.label}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Nota calculada automaticamente.
                        </p>
                      </div>

                      <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-3 text-center text-sm font-semibold text-indigo-700">
                        {score === null
                          ? "Aguardando cálculo"
                          : `${score} pontos`}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.code}
                    className="grid grid-cols-1 gap-3 px-5 py-5 sm:grid-cols-[1fr_150px] sm:items-center sm:gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium leading-relaxed text-slate-700">
                        {item.label}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {item.allowsNotApplicable
                          ? "Selecione a nota correspondente ou marque não se aplica."
                          : item.allowedValues.length > 0
                            ? `Opções disponíveis: ${item.allowedValues.join(", ")}.`
                            : "Atribua uma nota de 0 a 10."}
                      </p>
                    </div>

                    <ScoreField
                      label="Nota"
                      value={score}
                      allowedValues={item.allowedValues}
                      notApplicable={notApplicable}
                      disabled={disabled}
                      onChange={(nextScore) =>
                        updateItem(item.code, {
                          score: nextScore,
                          notApplicable: false,
                        })
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
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            Comentários
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Registre observações, justificativas ou considerações complementares
            sobre a avaliação.
          </p>
        </div>

        <label className={fieldClass}>
          <textarea
            value={value.comments ?? form.comments ?? ""}
            onChange={(event) =>
              onChange({
                ...value,
                comments: event.target.value,
              })
            }
            maxLength={5000}
            disabled={disabled}
            placeholder="Escreva seus comentários..."
            className={textareaClass}
          />

          <span className="text-right text-xs font-normal text-slate-400">
            {(value.comments ?? form.comments ?? "").length}/5000
          </span>
        </label>
      </section>
    </div>
  );
}
