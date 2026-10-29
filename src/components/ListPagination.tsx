export function ListPagination({
  page,
  pageSize = 10,
  total,
  label,
  onPageChange,
}: {
  page: number;
  pageSize?: number;
  total: number;
  label: string;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, total);

  const buttonClass =
    "inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2";

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-slate-500">
        Exibindo {total > pageSize ? `${start}–${end}` : total} de {total}{" "}
        {label}
      </span>

      {total > pageSize && (
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className={`${buttonClass} border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            Anterior
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isCurrent = page === pageNumber;

            return (
              <button
                key={pageNumber}
                type="button"
                aria-current={isCurrent ? "page" : undefined}
                onClick={() => onPageChange(pageNumber)}
                className={`${buttonClass} ${
                  isCurrent
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className={`${buttonClass} border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}