import { ArrowLeft, Mail, MapPin, Phone, Users } from "lucide-react";

type StudentDetails = {
  id: string;
  name: string;
  matricule: string;
  status: "Actif" | "Diplome" | "Soutenance";
  birthDate: string;
  email: string;
  phone: string;
  city: string;
  formation: string;
  department: string;
  year: string;
  inscriptionDate: string;
  average: number;
  cursus: Array<{
    yearLabel: string;
    state: "done" | "active" | "pending";
    passageLabel?: string;
    grade?: number;
    credits?: string;
  }>;
  results: Array<{
    module: string;
    code: string;
    exam: number;
    td: number;
    tp: number;
    average: number;
    status: "Normale" | "Rattrapage";
  }>;
  attendanceRate: number;
  attendance: { present: number; absent: number; late: number; justified: number };
  attendanceHistory: Array<{ module: string; code: string; type: string; date: string; status: "Present" | "Retard" | "Absent" }>;
};

type StudentDetailsSectionProps = {
  selectedStudent: StudentDetails;
  setSelectedStudentId: (id: string | null) => void;
};

function StudentDetailsSection({ selectedStudent, setSelectedStudentId }: StudentDetailsSectionProps) {
  return (
    <>
      <header className="section-header">
        <div className="details-title">
          <button className="icon-btn" onClick={() => setSelectedStudentId(null)}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1>{selectedStudent.name}</h1>
            <p>{selectedStudent.matricule}</p>
          </div>
        </div>
        <span className="tag actif">{selectedStudent.status}</span>
      </header>

      <section className="details-grid">
        <article className="card-box">
          <h3>Dossier Personnel</h3>
          <ul className="personal-list">
            <li><Users size={14} /> Ne(e) le {selectedStudent.birthDate}</li>
            <li><Mail size={14} /> {selectedStudent.email}</li>
            <li><Phone size={14} /> {selectedStudent.phone}</li>
            <li><MapPin size={14} /> {selectedStudent.city}</li>
          </ul>
          <dl className="meta-grid">
            <div className="meta-row">
              <dt>Formation</dt>
              <dd>{selectedStudent.formation}</dd>
            </div>
            <div className="meta-row">
              <dt>Departement</dt>
              <dd>{selectedStudent.department}</dd>
            </div>
            <div className="meta-row">
              <dt>Annee</dt>
              <dd>{selectedStudent.year} annee</dd>
            </div>
            <div className="meta-row">
              <dt>Inscription</dt>
              <dd>{selectedStudent.inscriptionDate}</dd>
            </div>
            <div className="meta-row">
              <dt>Moyenne generale</dt>
              <dd className={`meta-accent ${selectedStudent.average < 10 ? "is-low" : ""}`}>
                {selectedStudent.average.toFixed(2)}
              </dd>
            </div>
          </dl>
        </article>

        <article className="card-box">
          <h3>Progression du Cursus</h3>
          <ol className="timeline">
            {selectedStudent.cursus.map((item, idx) => (
              <li key={item.yearLabel} className={`${item.state} ${idx === selectedStudent.cursus.length - 1 ? "is-last" : ""}`}>
                <div className="node">{idx + 1}</div>
                <div className="timeline-body">
                  <div className="timeline-title">
                    <strong>
                      {item.yearLabel} {item.state === "active" && item.passageLabel ? <span>({item.passageLabel})</span> : null}
                    </strong>
                  </div>
                  {item.state !== "pending" && item.passageLabel && item.state !== "active" ? (
                    <div className="timeline-sub">
                      <span className="dot" />
                      <span>{item.passageLabel}</span>
                    </div>
                  ) : null}
                  {typeof item.grade === "number" && item.credits ? (
                    <div className="timeline-meta">
                      <span>{item.grade.toFixed(1)} / 20</span>
                      <span className="sep">•</span>
                      <span>{item.credits}</span>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </article>

        <article className="card-box">
          <h3>Notes &amp; Resultats</h3>
          {selectedStudent.results.map((result) => (
            <div className="note-card" key={result.code}>
              <div className="note-top">
                <div>
                  <strong>{result.module}</strong>
                  <small className="note-code">{result.code}</small>
                </div>
                <span className="note-check" aria-hidden="true" />
              </div>
              <div className="note-grades">
                <span>Exam: <b>{result.exam}</b></span>
                <span>TD: <b>{result.td}</b></span>
                <span>TP: <b>{result.tp}</b></span>
              </div>
              <div className="note-bottom">
                <span className="note-avg">Moy: {result.average.toFixed(2)}</span>
                <span className={`note-status ${result.status === "Normale" ? "ok" : "warn"}`}>{result.status}</span>
              </div>
            </div>
          ))}
        </article>
      </section>

      <section className="attendance-panel">
        <div className="attendance-head">
          <h3>Suivi des Presences</h3>
          <span>Taux: {selectedStudent.attendanceRate}%</span>
        </div>
        <div className="attendance-stats">
          <article className="stat-present"><small>Present</small><strong>{selectedStudent.attendance.present}</strong></article>
          <article className="stat-absent"><small>Absent</small><strong>{selectedStudent.attendance.absent}</strong></article>
          <article className="stat-late"><small>Retard</small><strong>{selectedStudent.attendance.late}</strong></article>
          <article className="stat-justified"><small>Justifie</small><strong>{selectedStudent.attendance.justified}</strong></article>
        </div>
        <div className="attendance-list">
          {selectedStudent.attendanceHistory.map((item) => (
            <div className="attendance-row" key={`${item.module}-${item.date}`}>
              <div>
                <strong>{item.module}</strong>
                <small>{item.code} - {item.type}</small>
              </div>
              <div className="attendance-meta">
                <small>{item.date}</small>
                <span className={`presence ${item.status.toLowerCase()}`}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default StudentDetailsSection;
