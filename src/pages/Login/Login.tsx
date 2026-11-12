import { useNavigate } from "react-router";
import { LoginForms } from "../../components/Login/LoginForms";
import { Logo } from "../../components/Logo";
import { login } from "../../services/authService";
import axios from "axios";
import { useUser } from "../../contexts/userContext";
import type { ApiErrorResponse } from "../../utils/apiErrorResponse";

export function LoginPage() {
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      const data = await login(credentials);

      localStorage.setItem("authToken", data.token);

      const user = await refreshUser();

      if (!user) {
        throw new Error("Não foi possível carregar os dados do usuário.");
      }

      navigate("/", { replace: true });
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        const status = err.response?.status;
        const response = err.response?.data;

        if (status === 401 || status === 403) {
          throw new Error("E-mail ou senha inválidos.", { cause: err });
        }

        if (status === 400) {
          const validationErrors = response?.errors;

          if (validationErrors) {
            const firstError = Object.values(validationErrors)[0];

            throw new Error(
              firstError || response?.detail || "Dados inválidos.",
              { cause: err },
            );
          }

          throw new Error(response?.detail || "Dados inválidos.", {
            cause: err,
          });
        }

        throw new Error(
          response?.detail || "Erro ao conectar com o servidor.",
          { cause: err },
        );
      }

      if (err instanceof Error) {
        throw err;
      }

      throw new Error("Erro inesperado. Tente novamente.", { cause: err });
    }
  };

  return (
    <main className="min-h-screen bg-surface md:grid md:grid-cols-[minmax(420px,46%)_1fr]">
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-[#071b2c] via-[#103b59] to-[#164e68] px-11 py-13 text-white md:flex lg:px-16 lg:py-13">
        {/* Logo superior */}
        <div className="relative z-10 text-white [&_.logo-mark]:border-white/35 [&_.logo-mark]:bg-white [&_.logo-mark]:text-navy">
          <Logo />
        </div>

        <div className="relative z-10 my-auto max-w-[520px]">
          <span className="text-xs font-bold uppercase tracking-[0.13em] text-[#9fd7de]">
            Universidade do Estado do Amazonas
          </span>
          <h1 className="my-4.5 max-w-[480px] font-heading text-[clamp(38px,4.1vw,60px)] font-bold leading-[1.08] tracking-[-0.045em] text-white">
            Pesquisa que transforma o nosso futuro.
          </h1>
          <p className="max-w-[470px] text-lg leading-[1.7] text-white/75">
            Acompanhe cada etapa da Iniciação Científica em um ambiente simples,
            seguro e integrado.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-[220px] h-[520px] w-[520px] rounded-full border border-white/[0.08]"
        >
          <div className="absolute inset-[70px] rounded-full border border-white/[0.08]">
            <div className="absolute inset-[70px] rounded-full border border-white/[0.08] bg-white/[0.025]" />
          </div>
        </div>

        {/* Rodapé institucional */}
        <small className="relative z-10 text-xs tracking-[0.02em] text-white/65">
          Pró-Reitoria de Pós-Graduação e Pesquisa
        </small>
      </section>

      <section className="grid min-h-screen place-items-center bg-surface p-6 sm:p-8 md:p-12">
        <LoginForms onSubmit={handleLogin} />
      </section>
    </main>
  );
}
