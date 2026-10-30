import { useState } from "react";
import type { Role } from "../pages/Login/LoginTypes";
import { isMentorRole } from "../pages/Projects/Projects.utils";
import { Icon } from "./Icon";
import { Badge } from "./Badge";
import { Button } from "./Button";

export function ReportReview({
  role,
  name,
  archived,
  close,
  uploading,
}: {
  role: Role;
  name: string;
  archived: boolean;
  close: () => void;
  uploading: () => void;
}) {
  const [commentSent, setCommentSent] = useState(false);
  const [approved, setApproved] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState(
    "Revise a discussão dos resultados e inclua as referências indicadas no comentário da página 8.",
  );

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-5">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 w-full border-0 bg-[#051b28]/[0.58] backdrop-blur-[3px] cursor-pointer"
        onClick={close}
        aria-label="Fechar versões"
      />

      {/* Modal Container */}
      <section className="relative z-10 w-full max-w-[720px] max-h-[calc(100vh-40px)] overflow-y-auto rounded-[14px] bg-white shadow-[0_24px_80px_rgba(5,27,40,0.25)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#dce5e9] p-6 pb-[18px]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.13em] text-[#176b91]">
              Histórico do documento
            </span>
            <h2 className="mt-[5px] font-['Manrope',sans-serif] text-xl font-bold text-[#182b38]">
              {name}
            </h2>
            <p className="mt-1 text-[9px] text-[#6c7f89]">
              Biodiversidade de insetos aquáticos na Amazônia
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={close}
            className="grid h-[34px] w-[34px] place-items-center rounded-[7px] border-0 bg-[#f4f7f8] text-[#6c7f89] hover:text-[#182b38] transition-colors cursor-pointer"
          >
            <Icon name="close" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Mensagem de sucesso */}
          {(commentSent || approved) && (
            <div className="mb-4 flex items-center gap-1.5 rounded-[7px] bg-[#eaf6ef] p-[9px_11px] text-[10px] font-semibold text-[#277a58]">
              <Icon name="check" size={16} />
              <span>
                {approved
                  ? "Relatório aprovado. A aluna foi notificada."
                  : "Comentário enviado para a aluna."}
              </span>
            </div>
          )}

          {/* Lista de Versões */}
          <div className="divide-y divide-[#dce5e9]">
            {/* V4 */}
            <div className="flex flex-wrap sm:flex-nowrap items-start gap-[11px] py-[13px] first:pt-0">
              <span className="grid h-[29px] w-[29px] shrink-0 place-items-center rounded-full bg-[#277a58] text-[9px] font-bold text-white">
                V4
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block text-[10px] text-[#182b38]">
                  Versão aprovada sem ressalvas
                </strong>
                <small className="mt-[3px] block text-[8px] text-[#6c7f89]">
                  Enviada em 20 mar 2026 às 09h08 • Aprovada em 20 mar 2026 às
                  11h45
                </small>
                <span className="mt-2 block text-[9px] italic text-[#91a0a8]">
                  Nenhum comentário adicionado pelo orientador.
                </span>
              </div>
              <div className="ml-10 sm:ml-0 flex items-center gap-2">
                <Badge tone="success">Aprovada</Badge>
                <Button variant="ghost" icon="download">
                  Baixar
                </Button>
              </div>
            </div>

            {/* V3 */}
            <div className="flex flex-wrap sm:flex-nowrap items-start gap-[11px] py-[13px]">
              <span className="grid h-[29px] w-[29px] shrink-0 place-items-center rounded-full bg-[#277a58] text-[9px] font-bold text-white">
                V3
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block text-[10px] text-[#182b38]">
                  Versão aprovada
                </strong>
                <small className="mt-[3px] block text-[8px] text-[#6c7f89]">
                  Enviada em 18 mar 2026 às 10h14 • Aprovada em 18 mar 2026 às
                  16h30
                </small>
                <p className="mt-2 rounded-r border-l-2 border-[#d6ad3d] bg-[#fff7d9] p-[9px_10px] text-[9px] leading-[1.5] text-[#314753]">
                  Comentário: Relatório aprovado. Os ajustes solicitados foram
                  atendidos e o documento está adequado para esta etapa.
                </p>
              </div>
              <div className="ml-10 sm:ml-0 flex items-center gap-2">
                <Badge tone="success">Aprovada</Badge>
                <Button variant="ghost" icon="download">
                  Baixar
                </Button>
              </div>
            </div>

            {/* V2 */}
            <div className="flex flex-wrap sm:flex-nowrap items-start gap-[11px] py-[13px]">
              <span className="grid h-[29px] w-[29px] shrink-0 place-items-center rounded-full bg-[#176b91] text-[9px] font-bold text-white">
                V2
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block text-[10px] text-[#182b38]">
                  Versão ajustada
                </strong>
                <small className="mt-[3px] block text-[8px] text-[#6c7f89]">
                  Enviada em 16 mar 2026 às 19h42
                </small>
                <p className="mt-2 rounded-r border-l-2 border-[#d6ad3d] bg-[#fff7d9] p-[9px_10px] text-[9px] leading-[1.5] text-[#314753]">
                  Comentário: Revise a discussão dos resultados e inclua as
                  referências indicadas no comentário da página 8.
                </p>
              </div>
              <div className="ml-10 sm:ml-0 flex items-center gap-2">
                <Badge tone="warning">Ajustes</Badge>
                <Button variant="ghost" icon="download">
                  Baixar
                </Button>
              </div>
            </div>

            {/* V1 */}
            <div className="flex flex-wrap sm:flex-nowrap items-start gap-[11px] py-[13px] last:pb-0">
              <span className="grid h-[29px] w-[29px] shrink-0 place-items-center rounded-full bg-[#e9eef0] text-[9px] font-bold text-[#6c7f89]">
                V1
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block text-[10px] text-[#182b38]">
                  Primeiro envio
                </strong>
                <small className="mt-[3px] block text-[8px] text-[#6c7f89]">
                  Enviada em 12 mar 2026 às 14h18
                </small>
                <p className="mt-2 rounded-r border-l-2 border-[#d6ad3d] bg-[#fff7d9] p-[9px_10px] text-[9px] leading-[1.5] text-[#314753]">
                  Comentário: Detalhar a metodologia de coleta e reorganizar a
                  seção de resultados.
                </p>
              </div>
              <div className="ml-10 sm:ml-0 flex items-center gap-2">
                <Badge>Substituída</Badge>
                <Button variant="ghost" icon="download">
                  Baixar
                </Button>
              </div>
            </div>
          </div>

          {/* Área de Avaliação do Orientador */}
          {isMentorRole(role) && !archived && (
            <div className="mt-5 border-t border-[#dce5e9] pt-4">
              {showCommentForm ? (
                <>
                  <label
                    className="mb-2 flex justify-between text-[13px] font-semibold text-[#182b38]"
                    htmlFor="review-comment"
                  >
                    Comentários sobre os ajustes necessários
                  </label>
                  <textarea
                    id="review-comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Descreva os ajustes que o aluno deve realizar..."
                    className="w-full min-h-[90px] resize-y rounded-lg border border-[#dce5e9] p-3 text-xs text-[#182b38] outline-none transition focus:border-[#176b91] focus:ring-2 focus:ring-[#176b91]/10 placeholder:text-[#6c7f89]/60"
                  />
                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setShowCommentForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      disabled={!comment.trim()}
                      onClick={() => {
                        setCommentSent(true);
                        setApproved(false);
                        setShowCommentForm(false);
                      }}
                    >
                      Enviar solicitação de ajustes
                    </Button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    icon="check"
                    onClick={() => {
                      setApproved(true);
                      setCommentSent(false);
                    }}
                  >
                    Aprovar relatório
                  </Button>
                  <Button onClick={() => setShowCommentForm(true)}>
                    Solicitar ajustes
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2.5 border-t border-[#dce5e9] bg-[#fafcfc] p-[15px_24px]">
          {role === "Aluno" && !archived && (
            <Button variant="secondary" icon="upload" onClick={uploading}>
              Anexar nova versão
            </Button>
          )}
          <Button onClick={close}>Fechar</Button>
        </div>
      </section>
    </div>
  );
}
