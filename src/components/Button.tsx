import type { MouseEventHandler, ReactNode } from "react";
import { Icon } from "./Icon";

export interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "table";
  icon?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  icon,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  // Base comum para quase todas as variantes (.btn)
  const baseStyles =
    "inline-flex items-center justify-center gap-2 min-h-10 px-4 rounded-lg text-[13px] font-semibold border border-transparent bg-[#123a55] transition-all duration-200 ease-out cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-50";

  // Mapeamento exato das variantes do CSS original
  const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    // .btn-primary: background: var(--navy), hover: translateY(-1px) + var(--navy-dark)
    primary:
      "bg-navy text-white shadow-[0_4px_12px_rgba(18,59,86,0.12)] hover:bg-navy-dark hover:-translate-y-px active:translate-y-0",

    // .btn-secondary: borda var(--line), fundo branco, hover com borda escurecida
    secondary:
      "bg-surface text-navy border-line hover:border-[#adc3cd] hover:bg-[#f9fbfc] active:bg-line/40",

    // .btn-ghost: padding lateral reduzido, sem fundo, cor azul
    ghost:
      "bg-transparent text-blue px-1.5 border-transparent hover:bg-blue-soft/50 active:bg-blue-soft",

    // .btn-danger: cor vermelha com fundo suave avermelhado
    danger: "bg-red-soft text-red hover:bg-red/10 active:bg-red/20",

    // .btn-table: variante compacta usada dentro de tabelas (6px 10px, texto 10px)
    table:
      "min-h-0 h-auto py-1.5 px-2.5 gap-1.5 rounded-[5px] text-[10px] bg-blue-soft text-blue whitespace-nowrap hover:bg-blue/15",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon name={icon} size={variant === "table" ? 14 : 18} />}
      {children}
    </button>
  );
}
