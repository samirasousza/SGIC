import { useState } from "react";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Logo } from "../Logo";

interface LoginFormsProps {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
}

export function LoginForms({ onSubmit }: LoginFormsProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (formData: FormData) => {
    setMessage("");
    setLoading(true);

    const email = (formData.get("email") as string)?.trim().toLowerCase() || "";
    const password = (formData.get("password") as string) || "";

    try {
      await onSubmit({ email, password });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
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

      {/* Formulário */}
      <form action={submit} className="flex flex-col gap-3.5">
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
            onChange={() => setMessage("")}
            className="h-[43px] w-full rounded-lg border border-line bg-surface px-3 text-[11px] text-ink outline-none transition-all placeholder:text-muted/60 focus:border-blue focus:ring-1 focus:ring-blue-soft"
          />
        </label>

        {/* Campo Senha */}
        <label className="flex flex-col">
          <span className="mb-1.5 text-[10px] font-semibold text-text-main">
            Senha
          </span>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
              onChange={() => setMessage("")}
              className="h-[43px] w-full rounded-lg border border-line bg-surface px-3 pr-10 text-[11px] text-ink outline-none transition-all placeholder:text-muted/60 focus:border-blue focus:ring-1 focus:ring-blue-soft"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-muted transition-colors hover:text-ink"
            >
              <Icon name={showPassword ? "eye-off" : "eye"} size={16} />
            </button>
          </div>
        </label>

        {message && (
          <div
            className={`flex items-center gap-2 rounded-lg text-[10px] font-semibold ${
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

        {/* Botão de Envio */}
        <div className="mt-1 w-full [&>button]:min-h-[48px] [&>button]:w-full [&>button]:justify-center">
          <Button type="submit" icon="arrow" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
