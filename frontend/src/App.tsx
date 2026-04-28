import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AppSidebar from "./components/AppSidebar";
import CreateStudentModal from "./components/CreateStudentModal";
import DashboardPage from "./components/DashboardPage";
import DepartmentsPage from "./components/DepartmentsPage";
import NewsPage from "./components/NewsPage";
import SchedulePage from "./components/SchedulePage";
import StudentDetailsSection from "./components/StudentDetailsSection";
import StudentsListSection from "./components/StudentsListSection";

type Student = {
  id: string;
  name: string;
  email: string;
  matricule: string;
  department: "Informatique" | "Physique" | "Mathematiques" | "Chimie" | "Genie Civil" | "Electronique";
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
};

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

type NewsItem = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

type SchedulePublication = {
  id: string;
  fileName: string;
  fileContent: string;
  fileType: "csv" | "pdf";
  target: "etudiant" | "professeur";
  publishedAt: string;
};

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
const directedNewsStorageKey = "unicursus-directed-news";
const schedulesStorageKey = "unicursus-published-schedules";
const cursusYears = ["1ere annee", "2eme annee", "3eme annee", "4eme annee", "5eme annee"] as const;
const departmentCatalog: Record<Student["department"], Omit<Department, "studentsCount">> = {
  Informatique: {
    id: "dept-informatique",
    name: "Informatique",
    description: "Genie logiciel, reseaux, IA et systemes d'information",
    headName: "Pr. Belkacemi Ahmed",
    headEmail: "belkacemi@univ.dz",
    headPhone: "0556 00 11 22",
    formationsCount: 6,
  },
  Physique: {
    id: "dept-physique",
    name: "Physique",
    description: "Physique fondamentale, physique des materiaux, energies",
    headName: "Pr. Hamidi Noureddine",
    headEmail: "hamidi@univ.dz",
    headPhone: "0666 33 44 55",
    formationsCount: 4,
  },
  Mathematiques: {
    id: "dept-mathematiques",
    name: "Mathematiques",
    description: "Mathematiques appliquees, statistiques, recherche operationnelle",
    headName: "Pr. Larbi Mourad",
    headEmail: "larbi@univ.dz",
    headPhone: "0777 66 77 88",
    formationsCount: 5,
  },
  Chimie: {
    id: "dept-chimie",
    name: "Chimie",
    description: "Chimie organique, chimie industrielle, biochimie",
    headName: "Pr. Boudiaf Samia",
    headEmail: "boudiaf@univ.dz",
    headPhone: "0555 09 00 11",
    formationsCount: 3,
  },
  "Genie Civil": {
    id: "dept-genie-civil",
    name: "Genie Civil",
    description: "Structures, hydraulique, geotechnique",
    headName: "Pr. Messaoudi Kamel",
    headEmail: "messaoudi@univ.dz",
    headPhone: "0666 22 33 44",
    formationsCount: 4,
  },
  Electronique: {
    id: "dept-electronique",
    name: "Electronique",
    description: "Systemes embarques, telecommunications, automatique",
    headName: "Pr. Bouzid Fatima",
    headEmail: "bouzid@univ.dz",
    headPhone: "0777 55 66 77",
    formationsCount: 4,
  },
};

function formatDate(dateValue: string | null | undefined) {
  if (!dateValue) return "-";
  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? dateValue : parsed.toLocaleDateString("fr-FR");
}

function formatDateTime(dateValue: string | null | undefined) {
  if (!dateValue) return "";
  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? dateValue : parsed.toLocaleString("fr-FR");
}

function getYearIndex(year: string) {
  const match = year.match(/\d+/);
  if (!match) return 0;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed - 1, 0), cursusYears.length - 1) : 0;
}

function buildCursus(year: string, status: Student["status"]) {
  const activeIndex = getYearIndex(year);
  return cursusYears.map((yearLabel, index) => {
    if (index < activeIndex) {
      return {
        yearLabel,
        state: "done" as const,
        passageLabel: `Passage en ${cursusYears[Math.min(index + 1, cursusYears.length - 1)]}`,
      };
    }
    if (index === activeIndex) {
      return {
        yearLabel,
        state: status === "Diplome" ? ("done" as const) : ("active" as const),
        passageLabel: status === "Diplome" ? "Validee" : "en cours",
      };
    }
    return { yearLabel, state: "pending" as const };
  });
}

function mapStudentFromApi(s: Record<string, unknown>): Student {
  const department = String(s.department ?? "Informatique") as Student["department"];
  const status = String(s.status ?? "Actif") as Student["status"];
  const year = String(s.year ?? "1ere");
  return {
    id: String(s.id),
    name: String(s.name ?? ""),
    email: String(s.email ?? ""),
    matricule: String(s.matricule ?? ""),
    department,
    year,
    average: Number(s.average ?? 0),
    status,
    phone: String(s.phone || "-"),
    city: String(s.city || "-"),
    birthDate: formatDate(typeof s.birth_date === "string" ? s.birth_date : String(s.birth_date ?? "")),
    formation: String(s.formation || "-"),
    inscriptionDate: formatDate(typeof s.inscription_date === "string" ? s.inscription_date : String(s.inscription_date ?? "")),
    attendanceRate: 0,
    attendance: { present: 0, absent: 0, late: 0, justified: 0 },
    attendanceHistory: [],
    cursus: buildCursus(year, status),
    results: [],
  };
}

function App() {
  const [activePage, setActivePage] = useState<"dashboard" | "students" | "departments" | "news" | "schedule">("students");
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"Tous" | Student["department"]>("Tous");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "Informatique" as Student["department"],
    year: "1ere",
    average: "12.0",
    status: "Actif" as Student["status"],
    phone: "",
    city: "",
    birthDate: "",
    formation: "",
  });
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isCreateNewsOpen, setIsCreateNewsOpen] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState({ title: "", content: "" });
  const [directedNews, setDirectedNews] = useState<NewsItem[]>([]);
  const [directedNewsInput, setDirectedNewsInput] = useState("");
  const [directedNewsError, setDirectedNewsError] = useState<string | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<SchedulePublication["target"]>("etudiant");
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [schedulePublications, setSchedulePublications] = useState<SchedulePublication[]>([]);

  useEffect(() => {
    async function loadStudents() {
      try {
        setStudentsError(null);
        setStudentsLoading(true);
        const res = await axios.get(`${apiBaseUrl}/api/students/`);
        const list = (res.data as Record<string, unknown>[]).map(mapStudentFromApi);
        setStudents(list);
      } catch {
        setStudents([]);
        setStudentsError("Impossible de charger les etudiants depuis la base de donnees.");
      } finally {
        setStudentsLoading(false);
      }
    }

    loadStudents();
  }, []);

  useEffect(() => {
    async function loadNews() {
      try {
        setNewsError(null);
        const res = await axios.get(`${apiBaseUrl}/api/news/`);
        const list = (res.data as Record<string, unknown>[]).map((n) => ({
          id: String(n.id),
          title: String(n.title ?? ""),
          content: String(n.content ?? ""),
          createdAt: formatDateTime(typeof n.created_at === "string" ? n.created_at : String(n.created_at ?? "")),
        }));
        setNews(list);
      } catch {
        setNews([]);
        setNewsError("Impossible de charger les actualites depuis la base de donnees.");
      }
    }

    loadNews();
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(directedNewsStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as NewsItem[];
      if (!Array.isArray(parsed)) return;
      const cleaned = parsed.filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.title === "string" &&
          typeof item.content === "string" &&
          typeof item.createdAt === "string",
      );
      setDirectedNews(cleaned);
    } catch {
      setDirectedNews([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(directedNewsStorageKey, JSON.stringify(directedNews));
  }, [directedNews]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(schedulesStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SchedulePublication[];
      if (!Array.isArray(parsed)) return;
      const cleaned = parsed.filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.fileName === "string" &&
          typeof item.fileContent === "string" &&
          (item.fileType === "csv" || item.fileType === "pdf") &&
          (item.target === "etudiant" || item.target === "professeur") &&
          typeof item.publishedAt === "string",
      );
      setSchedulePublications(cleaned);
    } catch {
      setSchedulePublications([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(schedulesStorageKey, JSON.stringify(schedulePublications));
  }, [schedulePublications]);

  const availableDepartments = useMemo(
    () => Array.from(new Set(students.map((student) => student.department))),
    [students],
  );

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
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
  }, [activeFilter, query, students]);

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId) ?? null,
    [selectedStudentId, students],
  );

  const totalDepartments = availableDepartments.length;
  const activeStudents = students.filter((student) => student.status === "Actif").length;
  const graduates = students.filter((student) => student.status === "Diplome").length;

  const departmentsData: Department[] = useMemo(() => {
    const counts = students.reduce<Record<string, number>>((acc, student) => {
      acc[student.department] = (acc[student.department] ?? 0) + 1;
      return acc;
    }, {});

    return (Object.keys(departmentCatalog) as Student["department"][]).map((departmentName) => {
      const item = departmentCatalog[departmentName];
      return {
        ...item,
        studentsCount: counts[departmentName] ?? 0,
      };
    });
  }, [students]);

  const departmentsSummary = useMemo(
    () =>
      departmentsData.map((department) => ({
        name: department.name,
        head: department.headName,
        score: department.studentsCount,
        progress: students.length === 0 ? 0 : Math.round((department.studentsCount / students.length) * 100),
      })),
    [departmentsData, students.length],
  );

  const formationOptions = useMemo(() => {
    const base = ["Cycle Ingenieur", "Licence", "Master"];
    const byDept: Record<Student["department"], string[]> = {
      Informatique: ["Ingenieur en Informatique", "Genie Logiciel", "Systemes d'information", "Intelligence Artificielle"],
      Physique: ["Licence Physique", "Master Physique", "Physique Appliquee"],
      Mathematiques: ["Licence Mathematiques", "Master Mathematiques", "Statistiques"],
      Chimie: ["Licence Chimie", "Master Chimie"],
      "Genie Civil": ["Licence Genie Civil", "Master Genie Civil"],
      Electronique: ["Licence Electronique", "Master Electronique"],
    };
    const deptSpecific = byDept[form.department] ?? [];
    return [...deptSpecific, ...base];
  }, [form.department]);

  function openCreate() {
    setCreateError(null);
    setForm({
      name: "",
      email: "",
      department: "Informatique",
      year: "1ere",
      average: "12.0",
      status: "Actif",
      phone: "",
      city: "",
      birthDate: "",
      formation: "",
    });
    setIsCreateOpen(true);
  }

  function openCreateNews() {
    setNewsError(null);
    setNewsForm({ title: "", content: "" });
    setIsCreateNewsOpen(true);
  }

  async function createNewsItem() {
    const title = newsForm.title.trim();
    const content = newsForm.content.trim();
    if (!title || !content) {
      setNewsError("Titre et contenu sont obligatoires.");
      return;
    }
    try {
      const res = await axios.post(`${apiBaseUrl}/api/news/`, { title, content });
      const n = res.data as Record<string, unknown>;
      const item: NewsItem = {
        id: String(n.id),
        title: String(n.title ?? ""),
        content: String(n.content ?? ""),
        createdAt: formatDateTime(typeof n.created_at === "string" ? n.created_at : String(n.created_at ?? "")),
      };
      setNews((prev) => [item, ...prev]);
      setIsCreateNewsOpen(false);
    } catch {
      setNewsError("Erreur lors de l'ajout. Verifie que le backend tourne.");
    }
  }

  async function createStudent() {
    setCreateError(null);
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email) {
      setCreateError("Nom et email sont obligatoires.");
      return;
    }
    const avg = Number(form.average);
    if (!Number.isFinite(avg) || avg < 0 || avg > 20) {
      setCreateError("La moyenne doit etre un nombre entre 0 et 20.");
      return;
    }

    try {
      const payload = {
        name,
        email,
        department: form.department,
        year: form.year,
        average: avg,
        status: form.status,
        phone: form.phone.trim(),
        city: form.city.trim(),
        birth_date: form.birthDate.trim(),
        formation: form.formation.trim(),
      };
      const res = await axios.post(`${apiBaseUrl}/api/students/`, payload);
      const newStudent = mapStudentFromApi(res.data as Record<string, unknown>);
      setStudents((prev) => [newStudent, ...prev]);
      setIsCreateOpen(false);
    } catch {
      setCreateError("Erreur lors de l'ajout en base. Verifie que le backend tourne.");
    }
  }

  function publishDirectedNews() {
    setDirectedNewsError(null);
    const content = directedNewsInput.trim();
    if (!content) {
      setDirectedNewsError("Le contenu de l'actualite dirigee est obligatoire.");
      return;
    }

    const newDirectedItem: NewsItem = {
      id: `dir-${Date.now()}`,
      title: "Actualite dirigee",
      content,
      createdAt: new Date().toLocaleString("fr-FR"),
    };
    setDirectedNews((prev) => [newDirectedItem, ...prev]);
    setDirectedNewsInput("");
  }

  async function readUploadedFile(file: File): Promise<string> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(typeof reader.result === "string" ? reader.result : "");
      };
      reader.onerror = () => {
        reject(new Error("Lecture impossible"));
      };
      reader.readAsText(file, "utf-8");
    });
  }

  async function publishScheduleFile() {
    setScheduleError(null);
    if (!scheduleFile) {
      setScheduleError("Selectionne un fichier CSV ou PDF a publier.");
      return;
    }

    const lowerName = scheduleFile.name.toLowerCase();
    const isCsvName = lowerName.endsWith(".csv");
    const isPdfName = lowerName.endsWith(".pdf");
    if (!isCsvName && !isPdfName) {
      setScheduleError("Le fichier doit etre au format .csv ou .pdf.");
      return;
    }

    try {
      const fileContent = (await readUploadedFile(scheduleFile)).trim();
      if (!fileContent) {
        setScheduleError("Le fichier est vide.");
        return;
      }

      const publication: SchedulePublication = {
        id: `schedule-${Date.now()}`,
        fileName: scheduleFile.name,
        fileContent,
        fileType: isPdfName ? "pdf" : "csv",
        target: scheduleTarget,
        publishedAt: new Date().toLocaleString("fr-FR"),
      };

      setSchedulePublications((prev) => [publication, ...prev]);
      setScheduleFile(null);
      const fileInput = document.getElementById("schedule-csv-input") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
    } catch {
      setScheduleError("Impossible de lire le fichier.");
    }
  }

  return (
    <div className="app">
      <AppSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        setSelectedStudentId={setSelectedStudentId}
        setIsCreateOpen={setIsCreateOpen}
      />

      <main className="content">
        {activePage === "dashboard" ? (
          <DashboardPage
            studentsCount={students.length}
            activeStudents={activeStudents}
            totalDepartments={totalDepartments}
            graduates={graduates}
            students={students}
            departmentsSummary={departmentsSummary}
            setActivePage={setActivePage}
            setSelectedStudentId={setSelectedStudentId}
          />
        ) : activePage === "departments" ? (
          <DepartmentsPage departmentsData={departmentsData} />
        ) : activePage === "news" ? (
          <NewsPage
            news={news}
            newsError={newsError}
            directedNewsError={directedNewsError}
            scheduleError={scheduleError}
            directedNewsInput={directedNewsInput}
            setDirectedNewsInput={setDirectedNewsInput}
            publishDirectedNews={publishDirectedNews}
            openCreateNews={openCreateNews}
            isCreateNewsOpen={isCreateNewsOpen}
            setIsCreateNewsOpen={setIsCreateNewsOpen}
            newsForm={newsForm}
            setNewsForm={setNewsForm}
            createNewsItem={createNewsItem}
          />
        ) : activePage === "schedule" ? (
          <SchedulePage
            scheduleError={scheduleError}
            scheduleTarget={scheduleTarget}
            setScheduleTarget={setScheduleTarget}
            setScheduleFile={setScheduleFile}
            scheduleFile={scheduleFile}
            publishScheduleFile={publishScheduleFile}
            schedulePublications={schedulePublications}
          />
        ) : !selectedStudent ? (
          <>
            {studentsError ? <div className="form-error">{studentsError}</div> : null}
            <StudentsListSection
              filteredStudents={filteredStudents}
              query={query}
              setQuery={setQuery}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              availableDepartments={availableDepartments}
              openCreate={openCreate}
              setSelectedStudentId={setSelectedStudentId}
              loading={studentsLoading}
            />
          </>
        ) : (
          <StudentDetailsSection selectedStudent={selectedStudent} setSelectedStudentId={setSelectedStudentId} />
        )}

        <CreateStudentModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          createError={createError}
          form={form}
          setForm={setForm}
          formationOptions={formationOptions}
          createStudent={createStudent}
        />
      </main>
    </div>
  );
}

export default App;
