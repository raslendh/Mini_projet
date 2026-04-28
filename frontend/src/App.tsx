import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Users,
} from "lucide-react";
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

function mergeStudentsWithDemo(apiStudents: Student[]): Student[] {
  const byId = new Map<string, Student>();
  for (const student of apiStudents) {
    byId.set(student.id, student);
  }
  for (const demoStudent of initialStudents) {
    // Keep API data when same id exists, add missing demo entries.
    if (!byId.has(demoStudent.id)) {
      byId.set(demoStudent.id, demoStudent);
    }
  }
  return Array.from(byId.values());
}

const initialStudents: Student[] = [
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
    cursus: [
      { yearLabel: "1ere annee", state: "done", passageLabel: "Passage en 2eme annee", grade: 13.8, credits: "60/60 credits" },
      { yearLabel: "2eme annee", state: "done", passageLabel: "Passage en 3eme annee", grade: 14.5, credits: "60/60 credits" },
      { yearLabel: "3eme annee", state: "active", passageLabel: "en cours" },
      { yearLabel: "4eme annee", state: "pending" },
      { yearLabel: "5eme annee", state: "pending" },
    ],
    results: [
      { module: "Genie Logiciel", code: "INF301", exam: 15, td: 16, tp: 0, average: 15.4, status: "Normale" },
      { module: "Intelligence Artificielle", code: "INF302", exam: 14, td: 13, tp: 15, average: 14.0, status: "Normale" },
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
    cursus: [
      { yearLabel: "1ere annee", state: "active", passageLabel: "en cours" },
      { yearLabel: "2eme annee", state: "pending" },
      { yearLabel: "3eme annee", state: "pending" },
      { yearLabel: "4eme annee", state: "pending" },
      { yearLabel: "5eme annee", state: "pending" },
    ],
    results: [
      { module: "Mecanique Quantique", code: "PHY101", exam: 13, td: 12, tp: 0, average: 12.6, status: "Normale" },
      { module: "Electromagnetisme", code: "PHY110", exam: 12, td: 14, tp: 0, average: 13.2, status: "Normale" },
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
    cursus: [
      { yearLabel: "1ere annee", state: "done", passageLabel: "Passage en 2eme annee", grade: 14.1, credits: "60/60 credits" },
      { yearLabel: "2eme annee", state: "done", passageLabel: "Passage en 3eme annee", grade: 14.8, credits: "60/60 credits" },
      { yearLabel: "3eme annee", state: "done", passageLabel: "Passage en 4eme annee", grade: 15.2, credits: "60/60 credits" },
      { yearLabel: "4eme annee", state: "done", passageLabel: "Passage en 5eme annee", grade: 15.9, credits: "60/60 credits" },
      { yearLabel: "5eme annee", state: "active", passageLabel: "en cours" },
    ],
    results: [
      { module: "Analyse Avancee", code: "MAT501", exam: 16, td: 15, tp: 0, average: 15.6, status: "Normale" },
      { module: "Topologie", code: "MAT510", exam: 15, td: 16, tp: 0, average: 15.4, status: "Normale" },
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
    cursus: [
      { yearLabel: "1ere annee", state: "done", passageLabel: "Passage en 2eme annee", grade: 12.9, credits: "60/60 credits" },
      { yearLabel: "2eme annee", state: "active", passageLabel: "en cours" },
      { yearLabel: "3eme annee", state: "pending" },
      { yearLabel: "4eme annee", state: "pending" },
      { yearLabel: "5eme annee", state: "pending" },
    ],
    results: [
      { module: "Programmation Web", code: "INF220", exam: 12, td: 14, tp: 15, average: 13.4, status: "Normale" },
      { module: "BDD", code: "INF230", exam: 10, td: 11, tp: 12, average: 11.2, status: "Rattrapage" },
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
    cursus: [
      { yearLabel: "1ere annee", state: "done", passageLabel: "Passage en 2eme annee", grade: 13.6, credits: "60/60 credits" },
      { yearLabel: "2eme annee", state: "done", passageLabel: "Passage en 3eme annee", grade: 14.2, credits: "60/60 credits" },
      { yearLabel: "3eme annee", state: "done", passageLabel: "Passage en 4eme annee", grade: 14.7, credits: "60/60 credits" },
      { yearLabel: "4eme annee", state: "active", passageLabel: "en cours" },
      { yearLabel: "5eme annee", state: "pending" },
    ],
    results: [
      { module: "Thermodynamique", code: "PHY402", exam: 15, td: 14, tp: 0, average: 14.6, status: "Normale" },
      { module: "Optique", code: "PHY403", exam: 10, td: 9, tp: 0, average: 9.6, status: "Rattrapage" },
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
    cursus: [
      { yearLabel: "1ere annee", state: "done", passageLabel: "Passage en 2eme annee", grade: 11.7, credits: "60/60 credits" },
      { yearLabel: "2eme annee", state: "done", passageLabel: "Passage en 3eme annee", grade: 12.1, credits: "60/60 credits" },
      { yearLabel: "3eme annee", state: "done", passageLabel: "Passage en 4eme annee", grade: 12.4, credits: "60/60 credits" },
      { yearLabel: "4eme annee", state: "active", passageLabel: "en cours" },
      { yearLabel: "5eme annee", state: "pending" },
    ],
    results: [
      { module: "Reseaux", code: "INF401", exam: 12, td: 10, tp: 0, average: 11.0, status: "Normale" },
      { module: "Cloud", code: "INF402", exam: 9, td: 8, tp: 10, average: 9.2, status: "Rattrapage" },
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
    cursus: [
      { yearLabel: "1ere annee", state: "done", passageLabel: "Passage en 2eme annee", grade: 13.9, credits: "60/60 credits" },
      { yearLabel: "2eme annee", state: "done", passageLabel: "Passage en 3eme annee", grade: 14.3, credits: "60/60 credits" },
      { yearLabel: "3eme annee", state: "done", passageLabel: "Passage en 4eme annee", grade: 14.7, credits: "60/60 credits" },
      { yearLabel: "4eme annee", state: "done", passageLabel: "Passage en 5eme annee", grade: 15.1, credits: "60/60 credits" },
      { yearLabel: "5eme annee", state: "active", passageLabel: "en cours" },
    ],
    results: [
      { module: "Statistiques", code: "MAT402", exam: 15, td: 16, tp: 0, average: 15.4, status: "Normale" },
      { module: "Recherche Operationnelle", code: "MAT405", exam: 14, td: 15, tp: 0, average: 14.6, status: "Normale" },
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
    cursus: [
      { yearLabel: "1ere annee", state: "active", passageLabel: "en cours" },
      { yearLabel: "2eme annee", state: "pending" },
      { yearLabel: "3eme annee", state: "pending" },
      { yearLabel: "4eme annee", state: "pending" },
      { yearLabel: "5eme annee", state: "pending" },
    ],
    results: [
      { module: "Mecanique", code: "PHY120", exam: 8, td: 9, tp: 0, average: 8.4, status: "Rattrapage" },
      { module: "Electricite", code: "PHY130", exam: 12, td: 10, tp: 0, average: 11.2, status: "Normale" },
    ],
  },
  {
    id: "etu-2022-407",
    name: "Nour El Houda",
    email: "n.houda@univ.dz",
    matricule: "ETU-2022-407",
    department: "Chimie",
    year: "3eme",
    average: 13.7,
    status: "Actif",
    phone: "0552 77 18 04",
    city: "Bejaia",
    birthDate: "05/10/2003",
    formation: "Licence Chimie",
    inscriptionDate: "12/09/2022",
    attendanceRate: 84,
    attendance: { present: 8, absent: 1, late: 0, justified: 0 },
    attendanceHistory: [
      { module: "Chimie Organique", code: "CHI 301", type: "Cours", date: "18/04/2026", status: "Present" },
      { module: "Analyse Chimique", code: "CHI 315", type: "TP", date: "21/04/2026", status: "Present" },
    ],
    cursus: [
      { yearLabel: "1ere annee", state: "done", passageLabel: "Passage en 2eme annee", grade: 12.9, credits: "60/60 credits" },
      { yearLabel: "2eme annee", state: "done", passageLabel: "Passage en 3eme annee", grade: 13.5, credits: "60/60 credits" },
      { yearLabel: "3eme annee", state: "active", passageLabel: "en cours" },
      { yearLabel: "4eme annee", state: "pending" },
      { yearLabel: "5eme annee", state: "pending" },
    ],
    results: [
      { module: "Chimie Organique", code: "CHI301", exam: 14, td: 13, tp: 0, average: 13.6, status: "Normale" },
      { module: "Analyse Chimique", code: "CHI315", exam: 13, td: 14, tp: 15, average: 13.8, status: "Normale" },
    ],
  },
  {
    id: "etu-2020-278",
    name: "Riad Merabet",
    email: "r.merabet@univ.dz",
    matricule: "ETU-2020-278",
    department: "Genie Civil",
    year: "5eme",
    average: 15.3,
    status: "Soutenance",
    phone: "0668 40 77 21",
    city: "Batna",
    birthDate: "14/02/2001",
    formation: "Master Genie Civil",
    inscriptionDate: "16/09/2020",
    attendanceRate: 89,
    attendance: { present: 10, absent: 0, late: 1, justified: 0 },
    attendanceHistory: [
      { module: "Beton Arme", code: "GCV 520", type: "Cours", date: "17/04/2026", status: "Present" },
      { module: "Hydraulique", code: "GCV 525", type: "TD", date: "22/04/2026", status: "Retard" },
    ],
    cursus: [
      { yearLabel: "1ere annee", state: "done", passageLabel: "Passage en 2eme annee", grade: 13.8, credits: "60/60 credits" },
      { yearLabel: "2eme annee", state: "done", passageLabel: "Passage en 3eme annee", grade: 14.1, credits: "60/60 credits" },
      { yearLabel: "3eme annee", state: "done", passageLabel: "Passage en 4eme annee", grade: 14.7, credits: "60/60 credits" },
      { yearLabel: "4eme annee", state: "done", passageLabel: "Passage en 5eme annee", grade: 15.0, credits: "60/60 credits" },
      { yearLabel: "5eme annee", state: "active", passageLabel: "en cours" },
    ],
    results: [
      { module: "Beton Arme", code: "GCV520", exam: 16, td: 15, tp: 0, average: 15.6, status: "Normale" },
      { module: "Hydraulique", code: "GCV525", exam: 14, td: 15, tp: 0, average: 14.4, status: "Normale" },
    ],
  },
  {
    id: "etu-2023-166",
    name: "Imane Zerrouki",
    email: "i.zerrouki@univ.dz",
    matricule: "ETU-2023-166",
    department: "Electronique",
    year: "2eme",
    average: 12.4,
    status: "Actif",
    phone: "0771 53 29 60",
    city: "Mostaganem",
    birthDate: "09/09/2004",
    formation: "Licence Electronique",
    inscriptionDate: "15/09/2023",
    attendanceRate: 79,
    attendance: { present: 7, absent: 1, late: 1, justified: 0 },
    attendanceHistory: [
      { module: "Circuits Electriques", code: "ELE 210", type: "Cours", date: "19/04/2026", status: "Present" },
      { module: "Electronique Numerique", code: "ELE 220", type: "TP", date: "23/04/2026", status: "Absent" },
    ],
    cursus: [
      { yearLabel: "1ere annee", state: "done", passageLabel: "Passage en 2eme annee", grade: 12.2, credits: "60/60 credits" },
      { yearLabel: "2eme annee", state: "active", passageLabel: "en cours" },
      { yearLabel: "3eme annee", state: "pending" },
      { yearLabel: "4eme annee", state: "pending" },
      { yearLabel: "5eme annee", state: "pending" },
    ],
    results: [
      { module: "Circuits Electriques", code: "ELE210", exam: 13, td: 12, tp: 0, average: 12.6, status: "Normale" },
      { module: "Electronique Numerique", code: "ELE220", exam: 10, td: 11, tp: 12, average: 10.8, status: "Rattrapage" },
    ],
  },
];

function App() {
  const [activePage, setActivePage] = useState<"dashboard" | "students" | "departments" | "news" | "schedule">("students");
  const [students, setStudents] = useState<Student[]>([]);
  const [_studentsLoading, setStudentsLoading] = useState(true);
  const [_studentsError, setStudentsError] = useState<string | null>(null);
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
        const list = (res.data as any[]).map((s) => {
          const inscriptionDate =
            typeof s.inscription_date === "string" && s.inscription_date.length >= 10
              ? s.inscription_date.split("-").reverse().join("/")
              : "-";

          const student: Student = {
            id: String(s.id),
            name: s.name,
            email: s.email,
            matricule: s.matricule,
            department: s.department,
            year: s.year,
            average: Number(s.average ?? 0),
            status: s.status,
            phone: s.phone || "-",
            city: s.city || "-",
            birthDate: s.birth_date || "-",
            formation: s.formation || "-",
            inscriptionDate,
            attendanceRate: 0,
            attendance: { present: 0, absent: 0, late: 0, justified: 0 },
            attendanceHistory: [],
            cursus: [
              { yearLabel: "1ere annee", state: "pending" },
              { yearLabel: "2eme annee", state: "pending" },
              { yearLabel: "3eme annee", state: "pending" },
              { yearLabel: "4eme annee", state: "pending" },
              { yearLabel: "5eme annee", state: "pending" },
            ],
            results: [],
          };
          return student;
        });
        setStudents(list.length ? mergeStudentsWithDemo(list) : initialStudents);
      } catch {
        setStudents(initialStudents);
        setStudentsError("Impossible de charger depuis l'API. Donnees demo affichees.");
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
        const list = (res.data as any[]).map((n) => {
          const createdAt =
            typeof n.created_at === "string" && n.created_at.length > 0
              ? new Date(n.created_at).toLocaleString("fr-FR")
              : "";
          const item: NewsItem = {
            id: String(n.id),
            title: n.title,
            content: n.content,
            createdAt,
          };
          return item;
        });
        setNews(list);
      } catch {
        setNews([]);
        setNewsError("Impossible de charger les actualites. Verifie que le backend tourne.");
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
          typeof item.csvContent === "string" &&
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

  const totalDepartments = new Set(students.map((student) => student.department)).size;
  const activeStudents = students.filter((student) => student.status === "Actif").length;
  const graduates = students.filter((student) => student.status === "Diplome").length;

  const departmentsSummary = useMemo(
    () => [
      { name: "Informatique", head: "Pr. Belkacemi Ahmed", score: 320, progress: 86 },
      { name: "Physique", head: "Pr. Hamid Nouraddine", score: 185, progress: 54 },
      { name: "Mathematiques", head: "Pr. Larbi Mourad", score: 210, progress: 62 },
      { name: "Chimie", head: "Pr. Boufafi Sarra", score: 145, progress: 42 },
    ],
    [],
  );

  const departmentsData: Department[] = useMemo(
    () => [
      {
        id: "dept-info",
        name: "Informatique",
        description: "Genie logiciel, reseaux, IA et systemes d'information",
        headName: "Pr. Belkacemi Ahmed",
        headEmail: "belkacemi@univ.dz",
        headPhone: "0556 00 11 22",
        studentsCount: 320,
        formationsCount: 6,
      },
      {
        id: "dept-phys",
        name: "Physique",
        description: "Physique fondamentale, physique des materiaux, energies",
        headName: "Pr. Hamidi Noureddine",
        headEmail: "hamidi@univ.dz",
        headPhone: "0666 33 44 55",
        studentsCount: 185,
        formationsCount: 4,
      },
      {
        id: "dept-math",
        name: "Mathematiques",
        description: "Mathematiques appliquees, statistiques, recherche operationnelle",
        headName: "Pr. Larbi Mourad",
        headEmail: "larbi@univ.dz",
        headPhone: "0777 66 77 88",
        studentsCount: 210,
        formationsCount: 5,
      },
      {
        id: "dept-chim",
        name: "Chimie",
        description: "Chimie organique, chimie industrielle, biochimie",
        headName: "Pr. Boudiaf Samia",
        headEmail: "boudiaf@univ.dz",
        headPhone: "0555 09 00 11",
        studentsCount: 145,
        formationsCount: 3,
      },
      {
        id: "dept-civil",
        name: "Genie Civil",
        description: "Structures, hydraulique, geotechnique",
        headName: "Pr. Messaoudi Kamel",
        headEmail: "messaoudi@univ.dz",
        headPhone: "0666 22 33 44",
        studentsCount: 198,
        formationsCount: 4,
      },
      {
        id: "dept-elec",
        name: "Electronique",
        description: "Systemes embarques, telecommunications, automatique",
        headName: "Pr. Bouzid Fatima",
        headEmail: "bouzid@univ.dz",
        headPhone: "0777 55 66 77",
        studentsCount: 167,
        formationsCount: 4,
      },
    ],
    [],
  );

  const formationOptions = useMemo(() => {
    const base = [
      "Cycle Ingenieur",
      "Licence",
      "Master",
    ];
    const byDept: Record<Student["department"], string[]> = {
      Informatique: [
        "Ingenieur en Informatique",
        "Genie Logiciel",
        "Systemes d'information",
        "Intelligence Artificielle",
      ],
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
      const n = res.data as any;
      const createdAt =
        typeof n.created_at === "string" && n.created_at.length > 0
          ? new Date(n.created_at).toLocaleString("fr-FR")
          : new Date().toLocaleString("fr-FR");
      const item: NewsItem = { id: String(n.id), title: n.title, content: n.content, createdAt };
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
      const s = res.data as any;
      const inscriptionDate =
        typeof s.inscription_date === "string" && s.inscription_date.length >= 10
          ? s.inscription_date.split("-").reverse().join("/")
          : new Date().toLocaleDateString("fr-FR");

      const newStudent: Student = {
        id: String(s.id),
        name: s.name,
        email: s.email,
        matricule: s.matricule,
        department: s.department,
        year: s.year,
        average: Number(s.average ?? avg),
        status: s.status,
        phone: s.phone || "-",
        city: s.city || "-",
        birthDate: s.birth_date || "-",
        formation: s.formation || "-",
        inscriptionDate,
        attendanceRate: 0,
        attendance: { present: 0, absent: 0, late: 0, justified: 0 },
        attendanceHistory: [],
        cursus: [
          { yearLabel: "1ere annee", state: form.year === "1ere" ? "active" : "pending", passageLabel: "en cours" },
          { yearLabel: "2eme annee", state: "pending" },
          { yearLabel: "3eme annee", state: "pending" },
          { yearLabel: "4eme annee", state: "pending" },
          { yearLabel: "5eme annee", state: "pending" },
        ],
        results: [],
      };

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
          <StudentsListSection
            filteredStudents={filteredStudents}
            query={query}
            setQuery={setQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            openCreate={openCreate}
            setSelectedStudentId={setSelectedStudentId}
          />
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
