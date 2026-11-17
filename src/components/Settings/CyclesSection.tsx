import type { CycleModel } from "../../models/cycleModel";
import { Button } from "../Button";
import { SettingsField } from "./SettingsField";
import type { CycleFormModel } from "../../types/settingsTypes";

type CyclesSectionProps = {
  cycles: CycleModel[];
  cycleForm: CycleFormModel;
  editingCycleId: string | null;
  saving: boolean;
  onCycleFormChange: (value: CycleFormModel) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onEdit: (cycle: CycleModel) => void;
  onRefresh: () => void;
};

export function CyclesSection({
  cycles,
  cycleForm,
  editingCycleId,
  saving,
  onCycleFormChange,
  onSubmit,
  onCancel,
  onEdit,
  onRefresh,
}: CyclesSectionProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="h-fit rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="font-semibold text-gray-900">
            {editingCycleId ? "Editar prazos do ciclo" : "Cadastrar ciclo"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Defina o ciclo e os prazos dos relatórios parcial e final.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {!editingCycleId ? (
            <SettingsField
              label="Ciclo acadêmico"
              value={cycleForm.cycle}
              onChange={(value) =>
                onCycleFormChange({ ...cycleForm, cycle: value })
              }
              placeholder="2026/2027"
              required
            />
          ) : (
            <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
              Ciclo selecionado: <strong>{cycleForm.cycle}</strong>
            </div>
          )}

          <SettingsField
            label="Prazo do relatório parcial"
            type="date"
            value={cycleForm.partialReportDueDate}
            onChange={(value) =>
              onCycleFormChange({ ...cycleForm, partialReportDueDate: value })
            }
          />
          <SettingsField
            label="Prazo do relatório final"
            type="date"
            value={cycleForm.finalReportDueDate}
            onChange={(value) =>
              onCycleFormChange({ ...cycleForm, finalReportDueDate: value })
            }
          />
          <SettingsField
            label="Encerramento do ciclo"
            type="date"
            value={cycleForm.closesOn}
            onChange={(value) =>
              onCycleFormChange({ ...cycleForm, closesOn: value })
            }
          />

          <p className="text-xs text-gray-500">
            Datas não informadas ficam sem prazo definido. O prazo final deve
            ser posterior ao parcial.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={saving}>
              {saving
                ? "Salvando..."
                : editingCycleId
                  ? "Salvar alterações"
                  : "Cadastrar ciclo"}
            </Button>
            {editingCycleId && (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-900">Ciclos cadastrados</h2>
            <p className="mt-1 text-sm text-gray-500">
              {cycles.length} ciclo(s) encontrado(s).
            </p>
          </div>
          <Button variant="ghost" onClick={onRefresh}>
            Atualizar
          </Button>
        </div>

        {cycles.length === 0 ? (
          <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
            Nenhum ciclo cadastrado.
          </p>
        ) : (
          <div className="space-y-3">
            {cycles.map((cycle) => (
              <article
                key={cycle.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900">{cycle.cycle}</h3>
                  <Button variant="table" onClick={() => onEdit(cycle)}>
                    Editar prazos
                  </Button>
                </div>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-gray-500">Relatório parcial</dt>
                    <dd className="mt-1 text-gray-800">
                      {cycle.partialReportDueDate || "Sem prazo"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Relatório final</dt>
                    <dd className="mt-1 text-gray-800">
                      {cycle.finalReportDueDate || "Sem prazo"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Encerramento</dt>
                    <dd className="mt-1 text-gray-800">
                      {cycle.closesOn || "Não definido"}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
