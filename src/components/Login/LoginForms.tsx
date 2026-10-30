import { useState } from "react";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { useNavigate } from "react-router";

export function LoginForms() {
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const submit = async (formData: FormData) => {
    setMessage("");

    const email = (formData.get("email") as string)?.trim().toLowerCase() || "";
    const password = (formData.get("password") as string) || "";

    console.log("Autenticado com sucesso:", { email, password });
  };

  return (
    <div className="w-full max-w-[430px] font-sans">
      {/* Mobile Logo */}
      <div className="mb-12 block md:hidden">
        <Logo />
      </div>

      {/* Título e Descrição */}
      <h2 className="my-2.5 font-heading text-[32px] font-bold leading-tight tracking-[-0.03em] text-ink">
        Entrar no SGIC
      </h2>
      <p className="mb-9 text-sm leading-[1.55] text-muted">
        Use seu e-mail institucional e senha para acessar o perfil
        correspondente.
      </p>

      {/* Formulário com Action nativa do React 19 */}
      <form action={submit} className="flex flex-col gap-3.5">
        {message && (
          <div
            className={`flex items-center gap-2 rounded-lg p-2.5 text-[10px] font-semibold ${
              message.startsWith("Instruções")
                ? "bg-green-soft text-green"
                : "bg-red-soft text-red"
            }`}
          >
            <Icon
              name={message.startsWith("Instruções") ? "check" : "info"}
              size={16}
            />
            {message}
          </div>
        )}

        {/* Campo E-mail */}
        <label className="flex flex-col">
          <span className="mb-1.5 text-[10px] font-semibold text-text-main">
            E-mail institucional
          </span>
          <input
            name="email"
            type="email"
            placeholder="apoiotecnico@uea.edu.br"
            autoComplete="username"
            required
            className="h-[43px] w-full rounded-lg border border-line bg-surface px-3 text-[11px] text-ink outline-none transition-all placeholder:text-muted/60 focus:border-blue focus:ring-1 focus:ring-blue-soft"
          />
        </label>

        {/* Campo Senha */}
        <label className="flex flex-col">
          <span className="mb-1.5 text-[10px] font-semibold text-text-main">
            Senha
          </span>
          <input
            name="password"
            type="password"
            placeholder="Digite sua senha"
            autoComplete="current-password"
            required
            className="h-[43px] w-full rounded-lg border border-line bg-surface px-3 text-[11px] text-ink outline-none transition-all placeholder:text-muted/60 focus:border-blue focus:ring-1 focus:ring-blue-soft"
          />
        </label>

        {/* Botão de Envio */}
        <div className="mt-1 w-full [&>button]:min-h-[48px] [&>button]:w-full [&>button]:justify-center">
          <Button type="submit" icon="arrow" onClick={() => navigate("/")}>
            Entrar
          </Button>
        </div>
      </form>

      {/* Nota de Segurança */}
      <div className="flex gap-3 rounded-[10px] bg-canvas p-3.5 text-[13px] leading-relaxed text-muted">
        <div className="shrink-0 text-blue">
          <Icon name="info" size={18} />
        </div>
        <p className="m-0 text-xs text-muted">
          Este acesso simula a autenticação institucional da UEA.
        </p>
      </div>
    </div>
  );
}
