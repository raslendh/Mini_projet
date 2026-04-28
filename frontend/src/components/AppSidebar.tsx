import {
  BookOpen,
  Building2,
  ClipboardList,
  GraduationCap,
  LogOut,
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
  currentUserEmail: string;
  currentUserRole: string;
  onLogout: () => void;
};

function AppSidebar({
  activePage,
  setActivePage,
  setSelectedStudentId,
  setIsCreateOpen,
  currentUserEmail,
  currentUserRole,
  onLogout,
}: AppSidebarProps) {
  const safeRole = currentUserRole?.trim() || "User";
  const safeEmail = currentUserEmail?.trim() || "unknown@unicursus.tn";

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

      <div className="sidebar-account">
        <div className="sidebar-account-meta">
          <div className="sidebar-account-avatar">{safeRole.charAt(0)}</div>
          <div>
            <strong>{safeRole}</strong>
            <p>{safeEmail}</p>
          </div>
        </div>
        <button className="ghost-btn sidebar-logout" onClick={onLogout}>
          <LogOut size={15} />
          Deconnexion
        </button>
      </div>
    </aside>
  );
}

export default AppSidebar;
