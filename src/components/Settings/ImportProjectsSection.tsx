import type { FormEvent } from "react";
import type { ImportResultModel } from "../../models/projectModel";
import { Button } from "../Button";

type ImportProjectsSectionProps = {
  importJson: string;
  importResult: ImportResultModel | null;
  saving: boolean;
  onJsonChange: (value: string) => void;
  onFileSelect: (file?: File) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ImportProjectsSection({
  importJson,
  importResult,
  saving,
  onJsonChange,
  onFileSelect,
  onSubmit,
}: ImportProjectsSectionProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <h2 className="font-semibold text-gray-900">
          Importar projetos do SISPROJ
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Envie um JSON contendo os projetos que devem ser cadastrados ou
          atualizados.
        </p>
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-gray-700">
              Arquivo JSON
            </span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={(event) => onFileSelect(event.target.files?.[0])}
              className="block w-full cursor-pointer text-sm text-gray-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-gray-700">
              Conteúdo JSON
            </span>
            <textarea
              value={importJson}
              onChange={(event) => onJsonChange(event.target.value)}
              rows={18}
              required
              spellCheck={false}
              placeholder={'{\n  "projects": [\n    { ... }\n  ]\n}'}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-xs text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
            A importação é transacional: se qualquer projeto tiver erro, o lote
            inteiro é cancelado. Projetos identificados pelo número SISPROJ
            serão atualizados; os novos usuários recebem senhas temporárias no
            resultado.
          </div>
          <Button type="submit" disabled={saving || !importJson.trim()}>
            {saving ? "Importando..." : "Importar projetos"}
          </Button>
        </form>
      </section>

      <div className="space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="font-semibold text-gray-900">Estrutura esperada</h2>
          <p className="mt-1 text-sm text-gray-500">
            O endpoint recebe um objeto com a propriedade <code>projects</code>.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>
              <code>sisprojNumber</code>, <code>title</code>, <code>cycle</code>{" "}
              e datas ISO <code>YYYY-MM-DD</code>.
            </li>
            <li>
              <code>program</code>: PAIC, PIBIC, PIBIC_AF, PIBITI, PBICT_AF ou
              VOLUNTEER.
            </li>
            <li>
              <code>scholarshipType</code>: FAPEAM, UEA, CNPQ ou VOLUNTEER.
            </li>
            <li>
              <code>unitAcronym</code>: sigla de uma unidade já cadastrada.
            </li>
            <li>
              <code>student</code> e <code>advisor</code>: nome e e-mail;
              matrícula obrigatória para aluno.
            </li>
            <li>
              <code>coAdvisor</code> é opcional e segue o mesmo formato de
              pessoa.
            </li>
          </ul>
        </section>

        {importResult && (
          <ImportResult importResult={importResult} />
        )}
      </div>
    </div>
  );
}

function ImportResult({
  importResult,
}: {
  importResult: ImportResultModel;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      <h2 className="font-semibold text-gray-900">Resultado da importação</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-green-50 p-3">
          <p className="text-xs text-green-700">Projetos criados</p>
          <p className="mt-1 text-2xl font-bold text-green-800">
            {importResult.created}
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-xs text-blue-700">Projetos atualizados</p>
          <p className="mt-1 text-2xl font-bold text-blue-800">
            {importResult.updated}
          </p>
        </div>
      </div>
      <div className="mt-5">
        <h3 className="text-sm font-semibold text-gray-900">
          Novos usuários ({importResult.newUsers.length})
        </h3>
        {importResult.newUsers.length > 0 ? (
          <div className="mt-3 space-y-3">
            {importResult.newUsers.map((entry) => (
              <div
                key={entry.user.id}
                className="rounded-lg border border-gray-200 p-3"
              >
                <p className="text-sm font-medium text-gray-900">
                  {entry.user.name}
                </p>
                <p className="text-xs text-gray-500">{entry.user.email}</p>
                <div className="mt-2 flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2.5 py-2">
                  <code className="break-all text-xs text-gray-800">
                    {entry.temporaryPassword}
                  </code>
                  <Button
                    variant="table"
                    className="shrink-0"
                    onClick={() =>
                      void navigator.clipboard.writeText(
                        entry.temporaryPassword,
                      )
                    }
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-500">
            Nenhum usuário novo precisou ser criado.
          </p>
        )}
        <p className="mt-3 text-xs leading-5 text-amber-700">
          As senhas temporárias são exibidas somente nesta resposta. Copie e
          distribua com segurança; o usuário deverá alterá-la no primeiro
          acesso.
        </p>
      </div>
    </section>
  );
}
