import {
  BookOpen,
  Building2,
  ClipboardList,
  GraduationCap,
  Newspaper,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

type ActivePage = "dashboard" | "students" | "departments" | "news" | "schedule";

type AppSidebarProps = {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  setSelectedStudentId: (id: string | null) => void;
  setIsCreateOpen: (open: boolean) => void;
};

function AppSidebar({ activePage, setActivePage, setSelectedStudentId, setIsCreateOpen }: AppSidebarProps) {
  return (
    <aside className="sidebar">
      <div
        className="brand brand-clickable"
        role="button"
        tabIndex={0}
        onClick={() => {
          setActivePage("dashboard");
          setSelectedStudentId(null);
          setIsCreateOpen(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setActivePage("dashboard");
            setSelectedStudentId(null);
            setIsCreateOpen(false);
          }
        }}
      >
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
        <a className={`nav-item ${activePage === "students" ? "active" : ""}`} onClick={() => setActivePage("students")}>
          <Users size={16} />Etudiants
        </a>
        <a className={`nav-item ${activePage === "departments" ? "active" : ""}`} onClick={() => setActivePage("departments")}>
          <Building2 size={16} />Departements
        </a>
        <a
          className={`nav-item ${activePage === "news" ? "active" : ""}`}
          onClick={() => {
            setActivePage("news");
            setSelectedStudentId(null);
          }}
        >
          <Newspaper size={16} />Actualites
        </a>
        <a
          className={`nav-item ${activePage === "schedule" ? "active" : ""}`}
          onClick={() => {
            setActivePage("schedule");
            setSelectedStudentId(null);
          }}
        >
          <ClipboardList size={16} />Emploi du temps
        </a>
        <a className="nav-item"><BookOpen size={16} />Formations</a>
        <a className="nav-item"><ClipboardList size={16} />Modules</a>
        <a className="nav-item"><UserCheck size={16} />Presences</a>
        <a className="nav-item"><ShieldCheck size={16} />Validations</a>
      </nav>
    </aside>
  );
}

export default AppSidebar;
