type SchedulePublication = {
  id: string;
  fileName: string;
  fileType: "csv" | "pdf";
  target: "etudiant" | "professeur";
  publishedAt: string;
};

type SchedulePageProps = {
  scheduleError: string | null;
  scheduleTarget: "etudiant" | "professeur";
  setScheduleTarget: (value: "etudiant" | "professeur") => void;
  setScheduleFile: (file: File | null) => void;
  scheduleFile: File | null;
  publishScheduleFile: () => void;
  schedulePublications: SchedulePublication[];
};

function SchedulePage({
  scheduleError,
  scheduleTarget,
  setScheduleTarget,
  setScheduleFile,
  scheduleFile,
  publishScheduleFile,
  schedulePublications,
}: SchedulePageProps) {
  return (
    <>
      <header className="section-header">
        <div>
          <h1>Emploi du temps</h1>
          <p>Importer et publier des fichiers CSV pour les etudiants ou les professeurs</p>
        </div>
      </header>

      {scheduleError ? <div className="form-error">{scheduleError}</div> : null}

      <section className="schedule-editor">
        <h2>Emploi du temps (CSV)</h2>
        <p>Importer un fichier CSV ou PDF puis publier pour les etudiants ou les professeurs.</p>
        <div className="schedule-form-row">
          <label className="schedule-file-field" htmlFor="schedule-csv-input">
            <span>Fichier CSV ou PDF</span>
            <input
              id="schedule-csv-input"
              type="file"
              accept=".csv,text/csv,.pdf,application/pdf"
              onChange={(e) => setScheduleFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <label className="schedule-target-field">
            <span>Cible</span>
            <select value={scheduleTarget} onChange={(e) => setScheduleTarget(e.target.value as "etudiant" | "professeur")}>
              <option value="etudiant">Etudiant</option>
              <option value="professeur">Professeur</option>
            </select>
          </label>
        </div>
        {scheduleFile ? <small className="schedule-file-name">Fichier choisi: {scheduleFile.name}</small> : null}
        <div className="directed-news-actions">
          <button className="primary-btn" onClick={publishScheduleFile}>
            Publier l'emploi du temps
          </button>
        </div>
      </section>

      <section className="schedule-publications">
        <h2>Publications emploi du temps</h2>
        {schedulePublications.length === 0 ? (
          <div className="empty">Aucun fichier CSV/PDF publie pour le moment.</div>
        ) : (
          <ul className="schedule-publications-list">
            {schedulePublications.slice(0, 10).map((item) => (
              <li key={item.id}>
                <div className="schedule-publication-head">
                  <strong>{item.fileName}</strong>
                  <span className="tag">{item.target === "etudiant" ? "Etudiant" : "Professeur"}</span>
                </div>
                <small>
                  Type: {item.fileType.toUpperCase()} • Publie le {item.publishedAt}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default SchedulePage;
