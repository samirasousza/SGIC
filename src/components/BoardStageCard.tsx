import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card } from "./Card";
import { Data } from "./Data";
import { EvaluatorPerson } from "./EvaluatorPerson";
import { Icon } from "./Icon";
import { SearchableInput } from "./SearchableInput";

import { evaluatorNames } from "../pages/Evaluaters/EvaluatorUtils";

type Stage = "partial" | "final";

interface Board {
  date: string;
  time: string;
  location: string;
  first: string;
  second: string;
  status: string;
}

export function BoardStageCard({
  stage,
  board,
  editing,
  canEdit,
  canDefine,
  archived,
  locked,
  onChange,
  onEdit,
  onCancel,
  onSave,
  onExternal,
}: {
  stage: Stage;
  board: Board;
  editing: boolean;
  canEdit: boolean;
  canDefine: boolean;
  archived: boolean;
  locked: boolean;
  onChange: (field: keyof Board, value: string) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onApprove: () => void;
  onExternal: () => void;
}) {
  const title = stage === "partial" ? "Defesa parcial" : "Defesa final";

  if (locked) {
    return (
      <Card>
        <div className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Icon name="clock" size={28} />
          </span>

          <Badge>Não liberada</Badge>

          <h2 className="mt-4 text-base font-semibold text-slate-800">
            Defesa final ainda não disponível
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
            As sugestões e a definição da banca final serão habilitadas quando o
            projeto alcançar o décimo primeiro mês do ciclo.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Badge
            tone={
              board.status === "Definida"
                ? "success"
                : board.status === "Sugerida"
                  ? "warning"
                  : "danger"
            }
          >
            {board.status}
          </Badge>

          <h2 className="mt-3 text-lg font-semibold text-slate-800">{title}</h2>

          {/* <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {archived
              ? "Composição registrada no ciclo encerrado."
              : canDefine
                ? board.status === "Definida"
                  ? "Banca aprovada. Os dados ainda podem ser alterados."
                  : "Sugestão do orientador pronta para revisão ou aprovação."
                : "Data e composição propostas ao comitê local."}
          </p> */}
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {archived
              ? "Composição registrada no ciclo encerrado."
              : canDefine
                ? board.status === "Definida"
                  ? "Banca aprovada. Os dados ainda podem ser alterados."
                  : board.status === "Sugerida"
                    ? "Sugestão do orientador pronta para revisão ou aprovação."
                    : "Aguardando sugestão do orientador."
                : board.status === "Sugerida"
                  ? "Sugestão enviada ao comitê local."
                  : "Nenhuma sugestão de banca enviada até o momento."}
          </p>
        </div>

        {/* {canEdit && !editing && (
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" icon="users" onClick={onEdit}>
              {canDefine ? "Revisar dados" : "Editar sugestão"}
            </Button>

            {canDefine && board.status !== "Definida" && (
              <Button icon="check" onClick={onApprove}>
                Aprovar banca
              </Button>
            )}
          </div>
        )} */}
        {canEdit && !editing && (
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" icon="users" onClick={onEdit}>
              {canDefine ? "Revisar dados" : "Editar sugestão"}
            </Button>

            {canDefine && board.status === "Sugerida" && (
              //   <Button icon="check" onClick={onApprove}>
              //     Aprovar banca
              //   </Button>
              <Button
                icon="check"
                disabled={
                  !board.date ||
                  !board.time ||
                  !board.first.trim() ||
                  !board.second.trim()
                }
                onClick={onSave}
              >
                {canDefine ? "Salvar alterações" : "Enviar sugestão"}
              </Button>
            )}
          </div>
        )}
      </div>

      {editing ? (
        <div className="space-y-5 p-5">
          {/* Data, horário e local */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Data sugerida
              </span>
              <input
                type="date"
                value={board.date}
                onChange={(event) => onChange("date", event.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Horário
              </span>
              <input
                type="time"
                value={board.time}
                onChange={(event) => onChange("time", event.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Local
                <small className="ml-2 font-normal text-slate-400">
                  Opcional para defesa on-line
                </small>
              </span>

              <input
                value={board.location}
                onChange={(event) => onChange("location", event.target.value)}
                placeholder="Sala, auditório ou link da reunião"
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
          </div>

          {/* Avaliadores */}
          <div className="space-y-4">
            <SearchableInput
              label="Avaliador interno"
              value={board.first}
              onChange={(value) => onChange("first", value)}
              options={evaluatorNames}
            />

            <SearchableInput
              label="Avaliador externo"
              value={board.second}
              onChange={(value) => onChange("second", value)}
              options={evaluatorNames}
            />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <Button variant="ghost" icon="user-plus" onClick={onExternal}>
              Solicitar cadastro de avaliador externo
            </Button>
          </div>

          {/* Ações */}
          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
            <Button variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>

            <Button
              icon="check"
              disabled={
                !board.date ||
                !board.time ||
                !board.first.trim() ||
                !board.second.trim()
              }
              onClick={onSave}
            >
              {canDefine ? "Salvar alterações" : "Enviar sugestão"}
            </Button>
          </div>
        </div>
      ) : (
        // <div className="space-y-4 p-5">
        //   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        //     <Data
        //       label="Data e horário"
        //       value={`${board.date.split("-").reverse().join("/")} às ${board.time}`}
        //     />

        //     <Data
        //       label="Local"
        //       value={board.location || "On-line • link a definir"}
        //     />
        //   </div>

        //   <div className="border-t border-slate-100 pt-4">
        //     <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        //       Composição da banca
        //     </p>

        //     <div className="space-y-3">
        //       <EvaluatorPerson index="01" name={board.first} />
        //       <EvaluatorPerson index="02" name={board.second} />
        //     </div>
        //   </div>
        // </div>
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Data
              label="Data e horário"
              value={
                board.date
                  ? `${board.date.split("-").reverse().join("/")} às ${board.time || "Horário a definir"}`
                  : "Não informado"
              }
            />

            <Data label="Local" value={board.location || "Não informado"} />
          </div>

          {board.first || board.second ? (
            <div className="border-t border-slate-100 pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Composição da banca
              </p>

              <div className="space-y-3">
                {board.first && (
                  <EvaluatorPerson
                    index="01"
                    name={board.first}
                    status={
                      board.status === "Definida" ? "Definido" : "Sugerido"
                    }
                  />
                )}

                {board.second && (
                  <EvaluatorPerson
                    index="02"
                    name={board.second}
                    status={
                      board.status === "Definida" ? "Definido" : "Sugerido"
                    }
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
              <Icon name="users" size={22} />
              <p className="mt-2 text-sm font-medium text-slate-600">
                Nenhum avaliador definido
              </p>
              <p className="mt-1 text-xs text-slate-400">
                A composição aparecerá aqui após o envio da sugestão.
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
