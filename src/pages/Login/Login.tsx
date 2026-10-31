import { LoginForms } from "../../components/Login/LoginForms";
import { Logo } from "../../components/Logo";

export function LoginPage() {

  return (
    /* .login-shell: grid dividido em 2 colunas no desktop, tela cheia única no mobile */
    <main className="min-h-screen bg-surface md:grid md:grid-cols-[minmax(420px,46%)_1fr]">
      {/* .login-brand: painel azul institucional à esquerda com gradiente e círculos decorativos */}
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-[#071b2c] via-[#103b59] to-[#164e68] px-11 py-13 text-white md:flex lg:px-16 lg:py-13">
        {/* Logo superior */}
        <div className="relative z-10 text-white [&_.logo-mark]:border-white/35 [&_.logo-mark]:bg-white [&_.logo-mark]:text-navy">
          <Logo />
        </div>

        {/* .login-message: bloco central de texto */}
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

        {/* .brand-pattern: anéis concêntricos decorativos no canto inferior direito */}
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

      {/* .login-panel: painel direito centralizado para o formulário de login */}
      <section className="grid min-h-screen place-items-center bg-surface p-6 sm:p-8 md:p-12">
        <LoginForms
        //   onBack={() => setCredentialLoginOpen(false)}
        // onEnter={() => navigate("/")}
        />
      </section>
    </main>
  );
}
