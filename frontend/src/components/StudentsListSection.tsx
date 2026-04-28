import { Eye, Plus, Search } from "lucide-react";

type StudentListItem = {
  id: string;
  name: string;
  email: string;
  matricule: string;
  department: string;
  year: string;
  average: number;
  status: string;
};

type StudentsListSectionProps = {
  filteredStudents: StudentListItem[];
  query: string;
  setQuery: (value: string) => void;
  activeFilter: "Tous" | "Informatique" | "Physique" | "Mathematiques";
  setActiveFilter: (value: "Tous" | "Informatique" | "Physique" | "Mathematiques") => void;
  openCreate: () => void;
  setSelectedStudentId: (id: string) => void;
};

function StudentsListSection({
  filteredStudents,
  query,
  setQuery,
  activeFilter,
  setActiveFilter,
  openCreate,
  setSelectedStudentId,
}: StudentsListSectionProps) {
  return (
    <>
      <header className="section-header">
        <div>
          <h1>Etudiants</h1>
          <p>{filteredStudents.length} etudiants inscrits</p>
        </div>
        <button className="primary-btn" onClick={openCreate}>
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
                <td className={`grade ${student.average < 10 ? "is-low" : ""}`}>{student.average.toFixed(1)}</td>
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
  );
}

export default StudentsListSection;
