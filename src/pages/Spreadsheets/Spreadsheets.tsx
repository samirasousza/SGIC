import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { Badge } from "../../components/Badge";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { PageHeader } from "../../components/PageHeader";
import { SpreadsheetExportModal } from "../../components/Spreadsheets/SpreadsheetExportModal";
import { SpreadsheetCard } from "../../components/Spreadsheets/SpreadsheetCard";
import { SpreadsheetFilters } from "../../components/Spreadsheets/SpreadsheetFilters";
import { useAppContext } from "../../contexts/appContext";
import type { UnitModel } from "../../models/projectModel";
import type { SpreadsheetDefinition } from "../../models/spreadsheetModel";
import { GetSpreadsheet } from "../../services/spreadsheetsService";
import type { ExportFormat } from "../../types/spreadsheetType";
import { spreadsheetDefinitions } from "./SpreadsheetUtils";
import { useUser } from "../../contexts/userContext";
import { GetAllUnits } from "../../services/unitsService";

interface ExportHistoryItem {
  id: number;
  date: string;
  title: string;
  defense: string;
  unit: string;
  format: string;
  responsible: string;
  sensitive: boolean;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function extension(format: ExportFormat) {
  return format === "XLSX" ? "xlsx" : format.toLowerCase();
}

export function SpreadsheetsPage() {
  const navigate = useNavigate();
  const { cycle, cyclesLoading, selectedRole } = useAppContext();
  const { user } = useUser();
  const [defense, setDefense] = useState<"Parcial" | "Final">("Parcial");
  const [unitId, setUnitId] = useState("");
  const [units, setUnits] = useState<UnitModel[]>([]);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [unitsError, setUnitsError] = useState("");
  const [selectedSheet, setSelectedSheet] =
    useState<SpreadsheetDefinition | null>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<ExportHistoryItem[]>([]);

  const role = selectedRole ?? user?.roles?.[0] ?? null;
  const isAdmin = role === "ADMIN";
  const canExport =
    role === "LOCAL_COMMITTEE" ||
    role === "TECHNICAL_SUPPORT" ||
    role === "ADMIN";
  const cycleRequired =
    !cycle || cycle === "all" || cycle === "Todos os ciclos";
  const userUnit = user?.course?.unit ?? null;

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    Promise.resolve()
      .then(() => {
        if (!active) return null;
        setUnitsLoading(true);
        setUnitsError("");
        return GetAllUnits();
      })
      .then((result) => {
        if (active && result) setUnits(result);
      })
      .catch(() => {
        if (active)
          setUnitsError("Não foi possível carregar as unidades acadêmicas.");
      })
      .finally(() => {
        if (active) setUnitsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const selectedUnit = useMemo(
    () =>
      isAdmin ? (units.find((unit) => unit.id === unitId) ?? null) : userUnit,
    [isAdmin, units, unitId, userUnit],
  );
  const unitLabel = isAdmin
    ? (selectedUnit?.name ?? "Todas as unidades")
    : (userUnit?.name ?? "Unidade vinculada à conta");

  async function exportSpreadsheet(format: ExportFormat) {
    if (!selectedSheet || cycleRequired) return;
    setExporting(true);
    setError("");
    try {
      const blob = await GetSpreadsheet(selectedSheet.id, {
        cycle,
        defenseType:
          selectedSheet.availability === "Somente final"
            ? "FINAL"
            : defense === "Parcial"
              ? "PARTIAL"
              : "FINAL",
        ...(isAdmin && unitId ? { unitId } : {}),
        format,
      });
      const safeCycle = cycle.replace(/[^\w-]/g, "-");
      const fileName = `${selectedSheet.id.toLowerCase()}-${safeCycle}-${selectedSheet.availability === "Somente final" ? "final" : defense.toLowerCase()}.${extension(format)}`;
      downloadBlob(blob, fileName);
      setHistory((current) => [
        {
          id: Date.now(),
          date: new Date().toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
          }),
          title: selectedSheet.title,
          defense:
            selectedSheet.availability === "Somente final" ? "Final" : defense,
          unit: unitLabel,
          format: format === "XLSX" ? "Excel" : format,
          responsible: user?.name ?? "Usuário autenticado",
          sensitive: selectedSheet.sensitive,
        },
        ...current,
      ]);
      setSelectedSheet(null);
    } catch {
      setError(
        "Não foi possível gerar a planilha. Verifique suas permissões e tente novamente.",
      );
    } finally {
      setExporting(false);
    }
  }

  if (!canExport) {
    return (
      <Card>
        <div className="py-10 text-center">
          <Icon name="info" size={30} />
          <h1 className="mt-3 font-semibold text-slate-800">
            Acesso não permitido
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            A exportação de planilhas está disponível para Comissão Local, Apoio
            Técnico e Administrador.
          </p>
          <div className="mt-5">
            <Button variant="secondary" onClick={() => navigate("/")}>
              Voltar ao início
            </Button>
          </div>
        </div>
      </Card>
    );
  }

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

      {cycleRequired && (
        <div className="mb-6 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <Icon name="info" size={20} />
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
      {error && (
        <p
          className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}
      {unitsError && (
        <p
          className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {unitsError}
        </p>
      )}

      <SpreadsheetFilters
        isAdmin={isAdmin}
        cycle={cyclesLoading ? "Carregando..." : cycleRequired ? "—" : cycle}
        defense={defense}
        setDefense={setDefense}
        units={units}
        unitId={unitId}
        setUnitId={setUnitId}
        userUnit={userUnit}
      />
      {isAdmin && unitsLoading && (
        <p className="-mt-5 mb-5 text-xs text-slate-500">
          Carregando unidades...
        </p>
      )}

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
            cycleRequired={
              cycleRequired || cyclesLoading || (isAdmin && unitsLoading)
            }
            onExport={() => setSelectedSheet(sheet)}
          />
        ))}
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Exportações desta sessão
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              O backend também registra cada exportação no log de auditoria.
            </p>
          </div>
          <Badge>{history.length} nesta sessão</Badge>
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
              {history.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
                    {item.date}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">
                    {item.title}
                    {item.sensitive && (
                      <span className="ml-2">
                        <Badge tone="warning">CPF</Badge>
                      </span>
                    )}
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
              {history.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Nenhuma exportação realizada nesta sessão.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedSheet && (
        <SpreadsheetExportModal
          sheet={selectedSheet}
          defense={defense}
          cycle={cycle}
          unitLabel={unitLabel}
          close={() => setSelectedSheet(null)}
          exportFile={exportSpreadsheet}
          exporting={exporting}
        />
      )}
    </>
  );
}
