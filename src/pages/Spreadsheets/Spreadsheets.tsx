
import { useState } from "react";
import { useNavigate } from "react-router";

import { Badge } from "../../components/Badge";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { PageHeader } from "../../components/PageHeader";
import { SpreadsheetExportModal } from "../../components/SpreadsheetExportModal";
import { SpreadsheetCard } from "../../components/SpreadsheetCard";
import { SpreadsheetFilters } from "../../components/SpreadsheetFilters";

import type { Role } from "../Login/LoginTypes";
import {
  spreadsheetDefinitions,
  spreadsheetExportHistory,
} from "./SpreadsheetUtils";

export function SpreadsheetsPage({
  role,
  cycle,
}: {
  role: Role;
  cycle: string;
}) {
  const navigate = useNavigate();

  const [defense, setDefense] = useState<"Parcial" | "Final">("Parcial");
  const [unit, setUnit] = useState("Escola Superior de Tecnologia");

  const [selectedSheet, setSelectedSheet] = useState<
    (typeof spreadsheetDefinitions)[number] | null
  >(null);

  const [lastExport, setLastExport] = useState<{
    title: string;
    format: string;
    sensitive: boolean;
  } | null>(null);

  const cycleRequired = cycle === "Todos os ciclos";

  // Inclui a exportação da sessão junto ao histórico mockado.
  const exportRows = lastExport
    ? [
        {
          id: 0,
          date: "Agora",
          title: lastExport.title,
          defense,
          unit,
          format: lastExport.format,
          responsible: role,
          sensitive: lastExport.sensitive,
        },
        ...spreadsheetExportHistory,
      ]
    : spreadsheetExportHistory;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", onClick: () => navigate("/") },
          { label: "Planilhas" },
        ]}
      />

      <PageHeader
        title="Planilhas consolidadas"
        description="Gere os documentos oficiais para encaminhamento à PROPESP/CPPI, sem redigitação."
      />

      {/* Aviso de ciclo */}
      {cycleRequired && (
        <div className="mb-6 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <Icon
            name="info"
            size={20}
          />

          <div>
            <strong className="text-sm font-semibold text-blue-900">
              Selecione um ciclo específico
            </strong>

            <p className="mt-1 text-sm leading-relaxed text-blue-800">
              As planilhas oficiais não podem combinar dados de ciclos
              diferentes. Use o filtro global do cabeçalho.
            </p>
          </div>
        </div>
      )}

      {/* Feedback da exportação */}
      {lastExport && (
        <div className="mb-6 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Icon name="check" size={18} />
          </span>

          <div>
            <strong className="text-sm font-semibold text-emerald-900">
              Exportação registrada
            </strong>

            <p className="mt-1 text-sm leading-relaxed text-emerald-800">
              {lastExport.title} gerada em {lastExport.format}
              {lastExport.sensitive
                ? " e identificada como contendo CPF."
                : "."}
            </p>
          </div>
        </div>
      )}

      {/* Filtros e contexto da exportação */}
      <SpreadsheetFilters
        role={role}
        cycle={cycle}
        defense={defense}
        setDefense={setDefense}
        unit={unit}
        setUnit={setUnit}
      />

      {/* Modelos disponíveis */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Modelos disponíveis
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Os títulos e a ordem das colunas seguem o modelo oficial.
          </p>
        </div>

        <Badge tone="info">{spreadsheetDefinitions.length} planilhas</Badge>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {spreadsheetDefinitions.map((sheet) => (
          <SpreadsheetCard
            key={sheet.id}
            sheet={sheet}
            defense={defense}
            cycleRequired={cycleRequired}
            onExport={() => setSelectedSheet(sheet)}
          />
        ))}
      </div>

      {/* Registro de exportações */}
      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Registro de exportações
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Todas as gerações ficam registradas para fins de auditoria.
            </p>
          </div>

          <Button variant="ghost" icon="arrow-right">
            Ver log completo
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50">
                {[
                  "Data e hora",
                  "Planilha",
                  "Defesa",
                  "Unidade",
                  "Formato",
                  "Responsável",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {exportRows.map((item) => (
                <tr
                  key={item.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
                    {item.date}
                  </td>

                  <td className="px-4 py-3 text-sm font-medium text-slate-800">
                    {item.title}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    {item.defense}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    {item.unit}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    {item.format}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    {item.responsible}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de exportação */}
      {selectedSheet && (
        <SpreadsheetExportModal
          sheet={selectedSheet}
          defense={defense}
          cycle={cycle}
          unit={unit}
          close={() => setSelectedSheet(null)}
          exportFile={(format) => {
            setLastExport({
              title: selectedSheet.title,
              format,
              sensitive: selectedSheet.sensitive,
            });

            setSelectedSheet(null);
          }}
        />
      )}
    </>
  );
}
