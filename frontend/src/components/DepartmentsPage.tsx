import { BadgeInfo, Building2, Layers, Mail, Phone, Users } from "lucide-react";

type Department = {
  id: string;
  name: string;
  description: string;
  headName: string;
  headEmail: string;
  headPhone: string;
  studentsCount: number;
  formationsCount: number;
};

type DepartmentsPageProps = {
  departmentsData: Department[];
};

function DepartmentsPage({ departmentsData }: DepartmentsPageProps) {
  return (
    <>
      <header className="section-header">
        <div>
          <h1>Departements</h1>
          <p>Gestion des departements et chefs de departement</p>
        </div>
      </header>

      <section className="dept-grid-page">
        {departmentsData.map((dept) => (
          <article className="dept-card" key={dept.id}>
            <div className="dept-top">
              <div className="dept-icon">
                <Building2 size={16} />
              </div>
              <div className="dept-title">
                <strong>{dept.name}</strong>
                <p>{dept.description}</p>
              </div>
            </div>

            <div className="dept-head-label">Chef de departement</div>
            <div className="dept-head">
              <div className="dept-head-avatar">
                <BadgeInfo size={16} />
              </div>
              <div className="dept-head-info">
                <strong>{dept.headName}</strong>
                <div className="dept-head-meta">
                  <span><Mail size={13} /> {dept.headEmail}</span>
                  <span><Phone size={13} /> {dept.headPhone}</span>
                </div>
              </div>
            </div>

            <div className="dept-stats">
              <span className="dept-stat">
                <Users size={14} />
                <b>{dept.studentsCount}</b> etudiants
              </span>
              <span className="dept-stat">
                <Layers size={14} />
                <b>{dept.formationsCount}</b> formations
              </span>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

export default DepartmentsPage;
