import type { FormEvent } from "react";
import { GraduationCap, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

type LoginForm = {
  identifier: string;
  password: string;
};

type LoginPageProps = {
  loginError: string | null;
  loginForm: LoginForm;
  setLoginForm: (updater: (prev: LoginForm) => LoginForm) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function LoginPage({ loginError, loginForm, setLoginForm, onSubmit }: LoginPageProps) {
  return (
    <div className="login-shell">
      <section className="login-hero">
        <div className="login-brand">
          <div className="login-brand-icon">
            <GraduationCap size={22} />
          </div>
          <div>
            <strong>UniCursus</strong>
            <p>Gestion universitaire connectee a votre base MySQL</p>
          </div>
        </div>

        <div className="login-hero-copy">
          <span className="login-badge">Portail securise</span>
          <h1>Pilotez l&apos;universite depuis une interface claire et moderne.</h1>
          <p>
            Accedez aux etudiants, actualites et departements depuis une seule console, avec les donnees
            chargees depuis votre backend Django.
          </p>
        </div>

        <div className="login-highlights">
          <article className="login-highlight-card">
            <ShieldCheck size={18} />
            <div>
              <strong>Acces controle</strong>
              <p>Session locale simple pour proteger l&apos;espace d&apos;administration.</p>
            </div>
          </article>
          <article className="login-highlight-card">
            <Mail size={18} />
            <div>
              <strong>Suivi centralise</strong>
              <p>Etudiants, actualites et departements dans le meme environnement.</p>
            </div>
          </article>
        </div>

        <div className="login-metrics">
          <div className="login-metric">
            <span>Base active</span>
            <strong>MySQL / XAMPP</strong>
          </div>
          <div className="login-metric">
            <span>API</span>
            <strong>Django REST</strong>
          </div>
        </div>
      </section>

      <section className="login-panel-wrap">
        <div className="login-panel">
          <div className="login-panel-head">
            <span className="login-mini-label">Connexion</span>
            <h2>Bienvenue de retour</h2>
            <p>Connectez-vous avec un identifiant cree dans Django pour acceder au tableau de bord.</p>
          </div>

          {loginError ? <div className="form-error">{loginError}</div> : null}

          <form className="login-form" onSubmit={onSubmit}>
            <label>
              <span>Identifiant ou email</span>
              <div className="login-input">
                <Mail size={16} />
                <input
                  type="text"
                  value={loginForm.identifier}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, identifier: event.target.value }))}
                  placeholder="admin.unicursus ou admin@unicursus.tn"
                />
              </div>
            </label>

            <label>
              <span>Mot de passe</span>
              <div className="login-input">
                <LockKeyhole size={16} />
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Saisissez votre mot de passe"
                />
              </div>
            </label>

            <button type="submit" className="primary-btn login-submit">
              Se connecter
            </button>
          </form>

          <div className="login-panel-footer">
            <span>Compte de test</span>
            <strong>admin.unicursus</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
