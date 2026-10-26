export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/35 bg-white text-sm font-extrabold tracking-tight text-navy shadow-sm">
        <span className="text-[#071b2c]">UEA</span>
      </div>

      {!compact && (
        <div className="flex flex-col">
          <strong className="font-heading text-xl font-bold leading-tight tracking-tight">
            SGIC
          </strong>
          <small className="mt-0.5 text-xs font-medium tracking-wide opacity-75">
            Iniciação Científica
          </small>
        </div>
      )}
    </div>
  );
}
