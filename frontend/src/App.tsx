import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  ClipboardList,
  Eye,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string;
  matricule: string;
  department: "Informatique" | "Physique" | "Mathematiques";
  year: string;
  average: number;
  status: "Actif" | "Diplome" | "Soutenance";
  phone: string;
  city: string;
  birthDate: string;
  formation: string;
  inscriptionDate: string;
  attendanceRate: number;
  attendance: { present: number; absent: number; late: number; justified: number };
  attendanceHistory: Array<{ module: string; code: string; type: string; date: string; status: "Present" | "Retard" | "Absent" }>;
};

const studentsData: Student[] = [
  {
    id: "etu-2022-001",
    name: "Amina Benali",
    email: "a.benali@univ.dz",
    matricule: "ETU-2022-001",
    department: "Informatique",
    year: "3eme",
    average: 14.5,
    status: "Actif",
    phone: "0555 12 34 56",
    city: "Cite 500 logts, Alger",
    birthDate: "12/03/2003",
    formation: "Ingenieur en Informatique",
    inscriptionDate: "15/09/2022",
    attendanceRate: 75,
    attendance: { present: 3, absent: 0, late: 1, justified: 0 },
    attendanceHistory: [
      { module: "Genie Logiciel", code: "INF 301", type: "Cours", date: "15/04/2026", status: "Present" },
      { module: "Genie Logiciel", code: "INF 301", type: "TD", date: "17/04/2026", status: "Present" },
      { module: "Intelligence Artificielle", code: "INF 302", type: "Cours", date: "18/04/2026", status: "Retard" },
    ],
  },
  {
    id: "etu-2024-032",
    name: "Youssef Kaddour",
    email: "y.kaddour@univ.dz",
    matricule: "ETU-2024-032",
    department: "Physique",
    year: "1ere",
    average: 12.8,
    status: "Actif",
    phone: "0551 22 66 10",
    city: "Oran",
    birthDate: "07/11/2005",
    formation: "Licence Physique",
    inscriptionDate: "10/09/2024",
    attendanceRate: 88,
    attendance: { present: 8, absent: 1, late: 0, justified: 0 },
    attendanceHistory: [
      { module: "Mecanique Quantique", code: "PHY 101", type: "Cours", date: "16/04/2026", status: "Present" },
      { module: "Electromagnetisme", code: "PHY 110", type: "TD", date: "18/04/2026", status: "Present" },
    ],
  },
  {
    id: "etu-2019-115",
    name: "Sarah Medjaoui",
    email: "s.medjaoui@univ.dz",
    matricule: "ETU-2019-115",
    department: "Mathematiques",
    year: "5eme",
    average: 16.2,
    status: "Diplome",
    phone: "0664 14 22 77",
    city: "Constantine",
    birthDate: "19/05/2001",
    formation: "Master Mathematiques",
    inscriptionDate: "20/09/2019",
    attendanceRate: 92,
    attendance: { present: 12, absent: 0, late: 0, justified: 1 },
    attendanceHistory: [
      { module: "Analyse Avancee", code: "MAT 501", type: "Cours", date: "10/04/2026", status: "Present" },
      { module: "Topologie", code: "MAT 510", type: "Cours", date: "14/04/2026", status: "Present" },
    ],
  },
  {
    id: "etu-2023-078",
    name: "Karim Bouchiba",
    email: "k.bouchiba@univ.dz",
    matricule: "ETU-2023-078",
    department: "Informatique",
    year: "2eme",
    average: 13.1,
    status: "Actif",
    phone: "0558 62 11 90",
    city: "Blida",
    birthDate: "04/02/2004",
    formation: "Ingenieur en Informatique",
    inscriptionDate: "14/09/2023",
    attendanceRate: 81,
    attendance: { present: 7, absent: 1, late: 1, justified: 0 },
    attendanceHistory: [
      { module: "Programmation Web", code: "INF 220", type: "Cours", date: "12/04/2026", status: "Present" },
      { module: "BDD", code: "INF 230", type: "TP", date: "19/04/2026", status: "Retard" },
    ],
  },
  {
    id: "etu-2021-945",
    name: "Fatima Zahra",
    email: "f.zahra@univ.dz",
    matricule: "ETU-2021-945",
    department: "Physique",
    year: "4eme",
    average: 15.0,
    status: "Actif",
    phone: "0698 77 12 90",
    city: "Setif",
    birthDate: "23/08/2002",
    formation: "Master Physique",
    inscriptionDate: "11/09/2021",
    attendanceRate: 83,
    attendance: { present: 9, absent: 1, late: 0, justified: 0 },
    attendanceHistory: [
      { module: "Thermodynamique", code: "PHY 402", type: "Cours", date: "11/04/2026", status: "Present" },
      { module: "Optique", code: "PHY 403", type: "TD", date: "20/04/2026", status: "Absent" },
    ],
  },
  {
    id: "etu-2021-839",
    name: "Mohamed Amine",
    email: "m.amine@univ.dz",
    matricule: "ETU-2021-839",
    department: "Informatique",
    year: "4eme",
    average: 11.8,
    status: "Actif",
    phone: "0567 43 18 55",
    city: "Alger",
    birthDate: "03/01/2002",
    formation: "Ingenieur en Informatique",
    inscriptionDate: "13/09/2021",
    attendanceRate: 67,
    attendance: { present: 6, absent: 2, late: 1, justified: 0 },
    attendanceHistory: [
      { module: "Reseaux", code: "INF 401", type: "Cours", date: "11/04/2026", status: "Present" },
      { module: "Cloud", code: "INF 402", type: "TP", date: "22/04/2026", status: "Absent" },
    ],
  },
  {
    id: "etu-2020-156",
    name: "Lina Bensalem",
    email: "l.bensalem@univ.dz",
    matricule: "ETU-2020-156",
    department: "Mathematiques",
    year: "5eme",
    average: 14.9,
    status: "Soutenance",
    phone: "0556 30 99 41",
    city: "Annaba",
    birthDate: "29/12/2001",
    formation: "Master Mathematiques",
    inscriptionDate: "18/09/2020",
    attendanceRate: 90,
    attendance: { present: 11, absent: 0, late: 0, justified: 1 },
    attendanceHistory: [
      { module: "Statistiques", code: "MAT 402", type: "Cours", date: "09/04/2026", status: "Present" },
      { module: "Recherche Operationnelle", code: "MAT 405", type: "TD", date: "21/04/2026", status: "Present" },
    ],
  },
  {
    id: "etu-2024-012",
    name: "Omar Hadj",
    email: "o.hadj@univ.dz",
    matricule: "ETU-2024-012",
    department: "Physique",
    year: "1ere",
    average: 10.5,
    status: "Actif",
    phone: "0541 11 76 33",
    city: "Tlemcen",
    birthDate: "16/06/2005",
    formation: "Licence Physique",
    inscriptionDate: "09/09/2024",
    attendanceRate: 58,
    attendance: { present: 4, absent: 3, late: 1, justified: 0 },
    attendanceHistory: [
      { module: "Mecanique", code: "PHY 120", type: "Cours", date: "15/04/2026", status: "Absent" },
      { module: "Electricite", code: "PHY 130", type: "TD", date: "23/04/2026", status: "Present" },
    ],
  },
];

function App() {
  const [activePage, setActivePage] = useState<"dashboard" | "students">("students");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"Tous" | Student["department"]>("Tous");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const filteredStudents = useMemo(() => {
    return studentsData.filter((student) => {
      const matchesFilter = activeFilter === "Tous" ? true : student.department === activeFilter;
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : student.name.toLowerCase().includes(normalizedQuery) ||
            student.email.toLowerCase().includes(normalizedQuery) ||
            student.matricule.toLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  const selectedStudent = useMemo(
    () => studentsData.find((student) => student.id === selectedStudentId) ?? null,
    [selectedStudentId],
  );

  const totalDepartments = new Set(studentsData.map((student) => student.department)).size;
  const activeStudents = studentsData.filter((student) => student.status === "Actif").length;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <GraduationCap size={20} />
          <div>
            <strong>UniCursus</strong>
            <p>Gestion Universitaire</p>
          </div>
        </div>
        <nav>
          <a
            className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setActivePage("dashboard");
              setSelectedStudentId(null);
            }}
          >
            <BookOpen size={16} />Tableau de bord
          </a>
          <a
            className={`nav-item ${activePage === "students" ? "active" : ""}`}
            onClick={() => setActivePage("students")}
          >
            <Users size={16} />Etudiants
          </a>
          <a className="nav-item"><Building2 size={16} />Departements</a>
          <a className="nav-item"><BookOpen size={16} />Formations</a>
          <a className="nav-item"><ClipboardList size={16} />Modules</a>
          <a className="nav-item"><UserCheck size={16} />Presences</a>
          <a className="nav-item"><ShieldCheck size={16} />Validations</a>
        </nav>
      </aside>

      <main className="content">
        {activePage === "dashboard" ? (
          <>
            <header className="section-header">
              <div>
                <h1>Tableau de bord</h1>
                <p>Vue d&apos;ensemble du cursus universitaire</p>
              </div>
            </header>
            <section className="dashboard-kpis">
              <article className="kpi-card">
                <h3>Etudiants</h3>
                <strong>{studentsData.length}</strong>
                <span>{activeStudents} actifs</span>
              </article>
              <article className="kpi-card">
                <h3>Departements</h3>
                <strong>{totalDepartments}</strong>
              </article>
              <article className="kpi-card">
                <h3>Modules</h3>
                <strong>14</strong>
              </article>
              <article className="kpi-card">
                <h3>Diplomes</h3>
                <strong>{studentsData.filter((student) => student.status === "Diplome").length}</strong>
              </article>
            </section>
          </>
        ) : !selectedStudent ? (
          <>
            <header className="section-header">
              <div>
                <h1>Etudiants</h1>
                <p>{filteredStudents.length} etudiants inscrits</p>
              </div>
              <button className="primary-btn">
                <Plus size={16} />
                Nouveau
              </button>
            </header>

            <section className="students-panel">
              <div className="toolbar">
                <label className="search-box">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
                <div className="filters">
                  {(["Tous", "Informatique", "Physique", "Mathematiques"] as const).map((filter) => (
                    <button
                      key={filter}
                      className={activeFilter === filter ? "is-active" : ""}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Etudiant</th>
                    <th>Matricule</th>
                    <th>Departement</th>
                    <th>Annee</th>
                    <th>Moyenne</th>
                    <th>Statut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-cell">
                          <div className="avatar">{student.name.charAt(0)}</div>
                          <div>
                            <strong>{student.name}</strong>
                            <small>{student.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{student.matricule}</td>
                      <td>{student.department}</td>
                      <td>{student.year}</td>
                      <td className="grade">{student.average.toFixed(1)}</td>
                      <td><span className={`tag ${student.status.toLowerCase()}`}>{student.status}</span></td>
                      <td>
                        <button className="icon-btn" onClick={() => setSelectedStudentId(student.id)}>
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        ) : (
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
                <div className="meta-grid">
                  <span>Formation <b>{selectedStudent.formation}</b></span>
                  <span>Departement <b>{selectedStudent.department}</b></span>
                  <span>Annee <b>{selectedStudent.year} annee</b></span>
                  <span>Inscription <b>{selectedStudent.inscriptionDate}</b></span>
                  <span>Moyenne generale <b>{selectedStudent.average.toFixed(2)}</b></span>
                </div>
              </article>

              <article className="card-box">
                <h3>Progression du Cursus</h3>
                <ol className="timeline">
                  <li className="done">1ere annee</li>
                  <li className="done">2eme annee</li>
                  <li className="active">3eme annee</li>
                  <li>4eme annee</li>
                  <li>5eme annee</li>
                </ol>
              </article>

              <article className="card-box">
                <h3>Notes &amp; Resultats</h3>
                <div className="note-card">
                  <strong>Genie Logiciel</strong>
                  <small>Examen: 15 | TD: 16</small>
                  <b>Rey: 15.40</b>
                </div>
                <div className="note-card">
                  <strong>Intelligence Artificielle</strong>
                  <small>Examen: 14 | TD: 15</small>
                  <b>Rey: 14.00</b>
                </div>
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
        )}
      </main>
    </div>
  );
}

export default App;
