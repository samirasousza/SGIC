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
    "inline-flex items-center justify-center gap-2 min-h-10 px-4 rounded-lg text-[13px] font-semibold border transition-all duration-200 ease-out cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-50";

  // Mapeamento exato das variantes do CSS original
  const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    // .btn-primary: background: var(--navy), hover: translateY(-1px) + var(--navy-dark)
    primary:
      "bg-[#143c54] text-white border-transparent shadow-[0_4px_12px_rgba(18,59,86,0.12)] hover:bg-[#102f43] hover:-translate-y-px active:translate-y-0",

    // .btn-secondary: borda var(--line), fundo branco, hover com borda escurecida
    secondary:
      "bg-white text-[#143c54] border-[#dce5eb] hover:border-[#adc3cd] hover:bg-[#f9fbfc] active:bg-[#edf2f5]",

    // .btn-ghost: padding lateral reduzido, sem fundo, cor azul
    ghost:
      "bg-transparent text-[#143c54] px-1.5 border-transparent hover:bg-[#eaf1f5] active:bg-[#dce8ef]",

    // .btn-danger: cor vermelha com fundo suave avermelhado
    danger:
      "bg-[#fef2f2] text-[#dc2626] border-transparent hover:bg-[#fee2e2] active:bg-[#fecaca]",

    // .btn-table: variante compacta usada dentro de tabelas (6px 10px, texto 10px)
    table:
      "min-h-0 h-auto py-1.5 px-2.5 gap-1.5 rounded-[5px] text-[10px] bg-[#eaf1f5] text-[#143c54] border-transparent whitespace-nowrap hover:bg-[#dce8ef]",
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
