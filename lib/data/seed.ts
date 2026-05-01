// Données initiales pour l'application

import type { User, Formateur, Salle, Groupe, Auditeur } from '@/lib/types';
import { JOURS_PASSAGE, NIVEAUX_ALPHABETISATION, DEPARTEMENTS_SAG } from './constants';

// Fonction pour générer un ID unique
const generateId = () => Math.random().toString(36).substring(2, 11);

// Noms guinéens pour les données de test
const PRENOMS_HOMMES = [
  'Mamadou', 'Ibrahima', 'Abdoulaye', 'Alpha', 'Ousmane', 'Boubacar', 'Sékou',
  'Mohamed', 'Amadou', 'Souleymane', 'Fode', 'Lansana', 'Kabinet', 'Thierno',
  'Diallo', 'Camara', 'Bah', 'Barry', 'Sylla', 'Keita', 'Conde', 'Toure'
];

const PRENOMS_FEMMES = [
  'Fatoumata', 'Mariama', 'Aissatou', 'Kadiatou', 'Hawa', 'Aminata', 'Djénabou',
  'Fanta', 'Oumou', 'Binta', 'Safiatou', 'Nene', 'Maimouna', 'Hadja',
  'Ramatoulaye', 'Saran', 'Djeneba', 'Adama'
];

const NOMS_FAMILLE = [
  'Diallo', 'Bah', 'Barry', 'Sow', 'Camara', 'Sylla', 'Keita', 'Conde',
  'Toure', 'Bangoura', 'Soumah', 'Kaba', 'Sacko', 'Traore', 'Cisse',
  'Fofana', 'Sangare', 'Kouyate', 'Souare', 'Balde'
];

// Utilisateurs par défaut
export const defaultUsers: User[] = [
  {
    id: 'user-admin-001',
    nom: 'Diallo',
    prenom: 'Amadou',
    email: 'admin@ages.gn',
    role: 'admin',
    password: 'admin123',
    actif: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-sup-001',
    nom: 'Barry',
    prenom: 'Mamadou',
    email: 'superviseur@ages.gn',
    role: 'superviseur',
    password: 'sup123',
    actif: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-dir-001',
    nom: 'Camara',
    prenom: 'Ibrahima',
    email: 'direction@ages.gn',
    role: 'direction',
    password: 'dir123',
    actif: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

// Salles (10)
export const defaultSalles: Salle[] = Array.from({ length: 10 }, (_, i) => ({
  id: `salle-${String(i + 1).padStart(3, '0')}`,
  nom: `Salle A${i + 1}`,
  capacite: 20,
  description: `Salle de formation ${i + 1} - Bâtiment A`,
  disponible: true,
}));

// Formateurs (10)
export const defaultFormateurs: Formateur[] = [
  { id: 'form-001', matricule: 'F-001', nom: 'Keita', prenom: 'Sékou', specialite: 'Alphabétisation de base', contact: '620000001', email: 'formateur1@ages.gn', actif: true, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'form-002', matricule: 'F-002', nom: 'Conde', prenom: 'Alpha', specialite: 'Calcul et numération', contact: '620000002', email: 'formateur2@ages.gn', actif: true, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'form-003', matricule: 'F-003', nom: 'Sylla', prenom: 'Boubacar', specialite: 'Lecture et écriture', contact: '620000003', email: 'formateur3@ages.gn', actif: true, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'form-004', matricule: 'F-004', nom: 'Toure', prenom: 'Fode', specialite: 'Communication orale', contact: '620000004', email: 'formateur4@ages.gn', actif: true, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'form-005', matricule: 'F-005', nom: 'Bah', prenom: 'Thierno', specialite: 'Alphabétisation fonctionnelle', contact: '620000005', email: 'formateur5@ages.gn', actif: true, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'form-006', matricule: 'F-006', nom: 'Sow', prenom: 'Lansana', specialite: 'Alphabétisation de base', contact: '620000006', email: 'formateur6@ages.gn', actif: true, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'form-007', matricule: 'F-007', nom: 'Bangoura', prenom: 'Kabinet', specialite: 'Calcul pratique', contact: '620000007', email: 'formateur7@ages.gn', actif: true, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'form-008', matricule: 'F-008', nom: 'Soumah', prenom: 'Mohamed', specialite: 'Lecture avancée', contact: '620000008', email: 'formateur8@ages.gn', actif: true, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'form-009', matricule: 'F-009', nom: 'Fofana', prenom: 'Ousmane', specialite: 'Perfectionnement', contact: '620000009', email: 'formateur9@ages.gn', actif: true, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'form-010', matricule: 'F-010', nom: 'Cisse', prenom: 'Amadou', specialite: 'Alphabétisation de base', contact: '620000010', email: 'formateur10@ages.gn', actif: true, createdAt: '2026-01-01T00:00:00.000Z' },
];

// Ajouter les formateurs comme utilisateurs
export const formateurUsers: User[] = defaultFormateurs.map((f) => ({
  id: `user-${f.id}`,
  nom: f.nom,
  prenom: f.prenom,
  email: f.email,
  role: 'formateur' as const,
  password: 'form123',
  actif: f.actif,
  createdAt: f.createdAt,
}));

// Groupes (25)
export const defaultGroupes: Groupe[] = [];
let groupeIndex = 0;

for (let jour = 0; jour < 6; jour++) {
  const nombreGroupesJour = jour < 5 ? 4 : 5; // 4 groupes par jour sauf samedi (5)
  
  for (let g = 0; g < nombreGroupesJour && groupeIndex < 25; g++) {
    const heureDebut = 8 + (g * 2);
    const heureFin = heureDebut + 2;
    
    defaultGroupes.push({
      id: `groupe-${String(groupeIndex + 1).padStart(3, '0')}`,
      matricule: `G-${String(groupeIndex + 1).padStart(3, '0')}`,
      nom: `Groupe ${groupeIndex + 1}`,
      formateurId: defaultFormateurs[groupeIndex % 10].id,
      salleId: defaultSalles[groupeIndex % 10].id,
      jourPassage: JOURS_PASSAGE[jour],
      heureDebut: `${String(heureDebut).padStart(2, '0')}:00`,
      heureFin: `${String(heureFin).padStart(2, '0')}:00`,
      niveau: NIVEAUX_ALPHABETISATION[groupeIndex % 4],
      capaciteMax: 16,
      actif: true,
    });
    
    groupeIndex++;
  }
}

// Auditeurs (400 - 16 par groupe)
export const defaultAuditeurs: Auditeur[] = [];

defaultGroupes.forEach((groupe, groupeIdx) => {
  for (let i = 0; i < 16; i++) {
    const isFemme = Math.random() > 0.6; // 40% femmes
    const sexe = isFemme ? 'F' : 'M';
    const prenoms = isFemme ? PRENOMS_FEMMES : PRENOMS_HOMMES;
    const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
    const nom = NOMS_FAMILLE[Math.floor(Math.random() * NOMS_FAMILLE.length)];
    const dept = DEPARTEMENTS_SAG[Math.floor(Math.random() * DEPARTEMENTS_SAG.length)];
    const auditeurNum = groupeIdx * 16 + i + 1;
    
    defaultAuditeurs.push({
      id: `aud-${String(auditeurNum).padStart(4, '0')}`,
      matricule: `A-${String(auditeurNum).padStart(4, '0')}`,
      nom,
      prenom,
      sexe,
      groupeId: groupe.id,
      niveau: groupe.niveau,
      contact: `62${String(1000000 + auditeurNum).slice(-7)}`,
      departement: dept.nom,
      codeDepartement: dept.code,
      dateInscription: '2026-01-15',
      actif: true,
    });
  }
});

// Données complètes pour l'initialisation
export const seedData = {
  users: [...defaultUsers, ...formateurUsers],
  formateurs: defaultFormateurs,
  salles: defaultSalles,
  groupes: defaultGroupes,
  auditeurs: defaultAuditeurs,
  presences: [],
  sessions: [],
  alertes: [],
};

// Fonction pour générer des présences de test (derniers 7 jours)
export function generateTestPresences() {
  const presences: any[] = [];
  const today = new Date();
  
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split('T')[0];
    const jourSemaine = date.getDay(); // 0 = Dimanche
    
    // Trouver les groupes qui ont cours ce jour
    const jourNom = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][jourSemaine];
    const groupesDuJour = defaultGroupes.filter(g => g.jourPassage === jourNom);
    
    groupesDuJour.forEach(groupe => {
      const auditeursGroupe = defaultAuditeurs.filter(a => a.groupeId === groupe.id);
      
      auditeursGroupe.forEach(auditeur => {
        // 85% présent, 10% absent, 5% retard
        const rand = Math.random();
        let statut: 'present' | 'absent' | 'retard' = 'present';
        if (rand > 0.95) statut = 'retard';
        else if (rand > 0.85) statut = 'absent';
        
        presences.push({
          id: generateId(),
          date: dateStr,
          auditeurId: auditeur.id,
          groupeId: groupe.id,
          statut,
          saisieParId: groupe.formateurId,
          createdAt: new Date().toISOString(),
        });
      });
    });
  }
  
  return presences;
}
