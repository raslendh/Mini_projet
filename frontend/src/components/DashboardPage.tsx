import { Building2, GraduationCap, Layers, Users } from "lucide-react";

type DashboardStudent = {
  id: string;
  name: string;
  department: string;
  year: string;
  status: string;
};

type DepartmentSummary = {
  name: string;
  head: string;
  score: number;
  progress: number;
};

type DashboardPageProps = {
  studentsCount: number;
  activeStudents: number;
  totalDepartments: number;
  graduates: number;
  students: DashboardStudent[];
  departmentsSummary: DepartmentSummary[];
  setActivePage: (page: "dashboard" | "students" | "departments" | "news" | "schedule") => void;
  setSelectedStudentId: (id: string | null) => void;
};

function DashboardPage({
  studentsCount,
  activeStudents,
  totalDepartments,
  graduates,
  students,
  departmentsSummary,
  setActivePage,
  setSelectedStudentId,
}: DashboardPageProps) {
  return (
    <>
      <header className="section-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue d&apos;ensemble du cursus universitaire</p>
        </div>
      </header>
      <section className="dashboard-kpis">
        <article className="kpi-card">
          <div className="kpi-top">
            <h3>Etudiants</h3>
            <span className="kpi-icon">
              <Users size={16} />
            </span>
          </div>
          <strong>{studentsCount}</strong>
          <span className="kpi-sub">{activeStudents} actifs</span>
        </article>
        <article className="kpi-card">
          <div className="kpi-top">
            <h3>Departements</h3>
            <span className="kpi-icon">
              <Building2 size={16} />
            </span>
          </div>
          <strong>{totalDepartments}</strong>
        </article>
        <article className="kpi-card">
          <div className="kpi-top">
            <h3>Modules</h3>
            <span className="kpi-icon">
              <Layers size={16} />
            </span>
          </div>
          <strong>14</strong>
        </article>
        <article className="kpi-card">
          <div className="kpi-top">
            <h3>Diplomes</h3>
            <span className="kpi-icon">
              <GraduationCap size={16} />
            </span>
          </div>
          <strong>{graduates}</strong>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-head">
            <h2>Etudiants recents</h2>
            <button className="link-btn" onClick={() => setActivePage("students")}>
              Voir tous →
            </button>
          </div>
          <ul className="recent-list">
            {students.slice(0, 5).map((student) => (
              <li key={student.id}>
                <div className="recent-left">
                  <div className="avatar">{student.name.charAt(0)}</div>
                  <div>
                    <strong>{student.name}</strong>
                    <small>{student.department}</small>
                  </div>
                </div>
                <div className="recent-right">
                  <small>{student.year} annee</small>
                  <span className={`tag ${student.status.toLowerCase()}`}>{student.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="panel-head">
            <h2>Departements</h2>
            <button
              className="link-btn"
              onClick={() => {
                setActivePage("departments");
                setSelectedStudentId(null);
              }}
            >
              Voir →
            </button>
          </div>
          <ul className="dept-list">
            {departmentsSummary.map((dept) => (
              <li
                key={dept.name}
                className="is-clickable"
                onClick={() => {
                  setActivePage("departments");
                  setSelectedStudentId(null);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActivePage("departments");
                    setSelectedStudentId(null);
                  }
                }}
              >
                <div className="dept-row">
                  <strong>{dept.name}</strong>
                  <span className="dept-score">{dept.score}</span>
                </div>
                <small>Chef: {dept.head}</small>
                <div className="progress">
                  <div style={{ width: `${dept.progress}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </>
  );
}

export default DashboardPage;
