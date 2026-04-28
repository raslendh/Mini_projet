import { Plus, X } from "lucide-react";

type NewsItem = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

type NewsPageProps = {
  news: NewsItem[];
  newsError: string | null;
  directedNewsError: string | null;
  scheduleError: string | null;
  directedNewsInput: string;
  setDirectedNewsInput: (value: string) => void;
  publishDirectedNews: () => void;
  openCreateNews: () => void;
  isCreateNewsOpen: boolean;
  setIsCreateNewsOpen: (open: boolean) => void;
  newsForm: { title: string; content: string };
  setNewsForm: (updater: (prev: { title: string; content: string }) => { title: string; content: string }) => void;
  createNewsItem: () => void;
};

function NewsPage({
  news,
  newsError,
  directedNewsError,
  scheduleError,
  directedNewsInput,
  setDirectedNewsInput,
  publishDirectedNews,
  openCreateNews,
  isCreateNewsOpen,
  setIsCreateNewsOpen,
  newsForm,
  setNewsForm,
  createNewsItem,
}: NewsPageProps) {
  return (
    <>
      <header className="section-header">
        <div>
          <h1>Actualites</h1>
          <p>Publier et consulter les actualites</p>
        </div>
        <button className="primary-btn" onClick={openCreateNews}>
          <Plus size={16} />
          Nouveau
        </button>
      </header>

      {newsError ? <div className="form-error">{newsError}</div> : null}
      {directedNewsError ? <div className="form-error">{directedNewsError}</div> : null}
      {scheduleError ? <div className="form-error">{scheduleError}</div> : null}

      <section className="directed-news-editor">
        <h2>Actualites dirigees</h2>
        <p>Tape un message ici puis publie-le pour qu'il soit visible sur la page Etudiants.</p>
        <textarea
          value={directedNewsInput}
          onChange={(e) => setDirectedNewsInput(e.target.value)}
          rows={4}
          placeholder="Ex: Reunion des etudiants de 3eme annee demain a 10h."
        />
        <div className="directed-news-actions">
          <button className="primary-btn" onClick={publishDirectedNews}>
            Publier pour les etudiants
          </button>
        </div>
      </section>

      <section className="news-grid">
        {news.length === 0 ? (
          <div className="empty">Aucune actualite pour le moment.</div>
        ) : (
          news.map((item) => (
            <article className="news-card" key={item.id}>
              <div className="news-head">
                <strong>{item.title}</strong>
                <small>{item.createdAt}</small>
              </div>
              <p>{item.content}</p>
            </article>
          ))
        )}
      </section>

      {isCreateNewsOpen ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-head">
              <div>
                <h2>Nouvelle actualite</h2>
                <p>Ajouter une actualite</p>
              </div>
              <button className="icon-btn" onClick={() => setIsCreateNewsOpen(false)} aria-label="Fermer">
                <X size={16} />
              </button>
            </div>

            <div className="form-grid form-grid-1">
              <label>
                <span>Titre</span>
                <input value={newsForm.title} onChange={(e) => setNewsForm((p) => ({ ...p, title: e.target.value }))} />
              </label>
              <label>
                <span>Contenu</span>
                <textarea
                  value={newsForm.content}
                  onChange={(e) => setNewsForm((p) => ({ ...p, content: e.target.value }))}
                  rows={6}
                />
              </label>
            </div>

            <div className="modal-actions">
              <button className="ghost-btn" onClick={() => setIsCreateNewsOpen(false)}>
                Annuler
              </button>
              <button className="primary-btn" onClick={createNewsItem}>
                Publier
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default NewsPage;
