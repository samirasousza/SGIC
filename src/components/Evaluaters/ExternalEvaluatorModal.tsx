import { Button } from "../Button";
import { Icon } from "../Icon";

export function ExternalEvaluatorModal({
  close,
  submit,
}: {
  close: () => void;
  submit: () => void;
}) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={close}
        aria-label="Fechar solicitação"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="external-evaluator-title"
        className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-[#143c54]">
              Novo avaliador externo
            </span>

            <h2
              id="external-evaluator-title"
              className="mt-1 text-lg font-semibold text-slate-800"
            >
              Solicitar cadastro ao administrador
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Informe os dados do avaliador para solicitar a criação do acesso.
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Nome completo *
              </span>
              <input
                required
                placeholder="Nome do avaliador"
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                E-mail *
              </span>
              <input
                required
                type="email"
                placeholder="email@instituicao.br"
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                CPF *
              </span>
              <input
                required
                placeholder="000.000.000-00"
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Titulação *
              </span>
              <select
                required
                defaultValue="Doutorado"
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="Doutorado">Doutorado</option>
                <option value="Mestrado">Mestrado</option>
                <option value="Especialização">Especialização</option>
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Instituição *
              </span>
              <input
                required
                placeholder="Instituição de vínculo"
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
            <Button variant="ghost" onClick={close}>
              Cancelar
            </Button>

            <Button type="submit" icon="check">
              Enviar solicitação
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}