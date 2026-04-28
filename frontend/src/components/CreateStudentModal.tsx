import { X } from "lucide-react";

type StudentDepartment = "Informatique" | "Physique" | "Mathematiques" | "Chimie" | "Genie Civil" | "Electronique";
type StudentStatus = "Actif" | "Diplome" | "Soutenance";

type StudentForm = {
  name: string;
  email: string;
  department: StudentDepartment;
  year: string;
  average: string;
  status: StudentStatus;
  phone: string;
  city: string;
  birthDate: string;
  formation: string;
};

type CreateStudentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  createError: string | null;
  form: StudentForm;
  setForm: (updater: (prev: StudentForm) => StudentForm) => void;
  formationOptions: string[];
  createStudent: () => void;
};

function CreateStudentModal({
  isOpen,
  onClose,
  createError,
  form,
  setForm,
  formationOptions,
  createStudent,
}: CreateStudentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-head">
          <div>
            <h2>Nouvel etudiant</h2>
            <p>Ajouter un etudiant dans la liste</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Fermer">
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
            <select value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value as StudentDepartment }))}>
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
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as StudentStatus }))}>
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
            <select value={form.formation} onChange={(e) => setForm((p) => ({ ...p, formation: e.target.value }))}>
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
          <button className="ghost-btn" onClick={onClose}>Annuler</button>
          <button className="primary-btn" onClick={createStudent}>Ajouter</button>
        </div>
      </div>
    </div>
  );
}

export default CreateStudentModal;
