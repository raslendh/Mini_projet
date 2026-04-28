import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  ClipboardList,
  X,
  Eye,
  GraduationCap,
  GraduationCap as DiplomaIcon,
  Layers,
  BadgeInfo,
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

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

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
];

function App() {
  const [activePage, setActivePage] = useState<"dashboard" | "students" | "departments">("students");
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
        setStudents(list.length ? list : initialStudents);
      } catch {
        setStudents(initialStudents);
        setStudentsError("Impossible de charger depuis l'API. Donnees demo affichees.");
      } finally {
        setStudentsLoading(false);
      }
    }

    loadStudents();
  }, []);

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

  return (
    <div className="app">
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
          <a
            className={`nav-item ${activePage === "students" ? "active" : ""}`}
            onClick={() => setActivePage("students")}
          >
            <Users size={16} />Etudiants
          </a>
          <a
            className={`nav-item ${activePage === "departments" ? "active" : ""}`}
            onClick={() => setActivePage("departments")}
          >
            <Building2 size={16} />Departements
          </a>
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
                <div className="kpi-top">
                  <h3>Etudiants</h3>
                  <span className="kpi-icon">
                    <Users size={16} />
                  </span>
                </div>
                <strong>{students.length}</strong>
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
                    <DiplomaIcon size={16} />
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
        ) : activePage === "departments" ? (
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
        ) : !selectedStudent ? (
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
                      <td className={`grade ${student.average < 10 ? "is-low" : ""}`}>
                        {student.average.toFixed(1)}
                      </td>
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
                    <li
                      key={item.yearLabel}
                      className={`${item.state} ${idx === selectedStudent.cursus.length - 1 ? "is-last" : ""}`}
                    >
                      <div className="node">{idx + 1}</div>
                      <div className="timeline-body">
                        <div className="timeline-title">
                          <strong>
                            {item.yearLabel}{" "}
                            {item.state === "active" && item.passageLabel ? <span>({item.passageLabel})</span> : null}
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
        )}

        {isCreateOpen ? (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal">
              <div className="modal-head">
                <div>
                  <h2>Nouvel etudiant</h2>
                  <p>Ajouter un etudiant dans la liste</p>
                </div>
                <button className="icon-btn" onClick={() => setIsCreateOpen(false)} aria-label="Fermer">
                  <X size={16} />
                </button>
              </div>

              {createError ? <div className="form-error">{createError}</div> : null}

              <div className="form-grid">
                <label>
                  <span>Nom</span>
                  <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                </label>
                <label>
                  <span>Email</span>
                  <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                </label>
                <label>
                  <span>Matricule</span>
                  <input value="Auto" disabled />
                </label>
                <label>
                  <span>Departement</span>
                  <select
                    value={form.department}
                    onChange={(e) => setForm((p) => ({ ...p, department: e.target.value as Student["department"] }))}
                  >
                    <option>Informatique</option>
                    <option>Physique</option>
                    <option>Mathematiques</option>
                  </select>
                </label>
                <label>
                  <span>Annee</span>
                  <select value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}>
                    <option value="1ere">1ere</option>
                    <option value="2eme">2eme</option>
                    <option value="3eme">3eme</option>
                    <option value="4eme">4eme</option>
                    <option value="5eme">5eme</option>
                  </select>
                </label>
                <label>
                  <span>Moyenne</span>
                  <input value={form.average} onChange={(e) => setForm((p) => ({ ...p, average: e.target.value }))} />
                </label>
                <label>
                  <span>Statut</span>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as Student["status"] }))}
                  >
                    <option>Actif</option>
                    <option>Diplome</option>
                    <option>Soutenance</option>
                  </select>
                </label>
                <label>
                  <span>Telephone</span>
                  <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                </label>
                <label>
                  <span>Ville / Adresse</span>
                  <input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
                </label>
                <label>
                  <span>Date de naissance</span>
                  <input value={form.birthDate} onChange={(e) => setForm((p) => ({ ...p, birthDate: e.target.value }))} />
                </label>
                <label>
                  <span>Formation</span>
                  <select
                    value={form.formation}
                    onChange={(e) => setForm((p) => ({ ...p, formation: e.target.value }))}
                  >
                    <option value="" disabled>
                      Choisir une formation...
                    </option>
                    {formationOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Date inscription</span>
                  <input value={new Date().toLocaleDateString("fr-FR")} disabled />
                </label>
              </div>

              <div className="modal-actions">
                <button className="ghost-btn" onClick={() => setIsCreateOpen(false)}>Annuler</button>
                <button className="primary-btn" onClick={createStudent}>Ajouter</button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default App;
