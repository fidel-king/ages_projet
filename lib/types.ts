// Types pour le système de gestion des présences - Académie SAG

// Rôles utilisateur
export type UserRole = 'admin' | 'formateur' | 'superviseur' | 'direction';

// Statuts de présence
export type PresenceStatut = 'present' | 'absent' | 'retard';

// Jours de passage
export type JourPassage = 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';

// Sexe
export type Sexe = 'M' | 'F';

// Utilisateur (authentification)
export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  password: string;
  actif: boolean;
  createdAt: string;
}

// Auditeur
export interface Auditeur {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  sexe: Sexe;
  groupeId: string;
  niveau: string;
  contact: string;
  departement: string;
  codeDepartement: string;
  dateInscription: string;
  actif: boolean;
}

// Formateur
export interface Formateur {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  specialite: string;
  contact: string;
  email: string;
  actif: boolean;
  createdAt: string;
}

// Groupe
export interface Groupe {
  id: string;
  matricule: string;
  nom: string;
  formateurId: string;
  salleId: string;
  jourPassage: JourPassage;
  heureDebut: string;
  heureFin: string;
  niveau: string;
  capaciteMax: number;
  actif: boolean;
}

// Salle
export interface Salle {
  id: string;
  nom: string;
  capacite: number;
  description: string;
  disponible: boolean;
}

// Présence
export interface Presence {
  id: string;
  date: string;
  auditeurId: string;
  groupeId: string;
  statut: PresenceStatut;
  commentaire?: string;
  saisieParId: string;
  createdAt: string;
}

// Session de présence (pour saisie groupée)
export interface SessionPresence {
  id: string;
  date: string;
  groupeId: string;
  formateurId: string;
  validee: boolean;
  createdAt: string;
}

// Statistiques
export interface StatsPresence {
  totalAuditeurs: number;
  presentsAujourdhui: number;
  absentsAujourdhui: number;
  retardsAujourdhui: number;
  tauxPresenceGlobal: number;
  tauxPresenceSemaine: number;
}

// Alerte
export interface Alerte {
  id: string;
  type: 'absence_repetee' | 'taux_bas' | 'autre';
  auditeurId?: string;
  groupeId?: string;
  message: string;
  niveau: 'info' | 'warning' | 'danger';
  vue: boolean;
  createdAt: string;
}

// Types pour le store
export interface AppState {
  users: User[];
  auditeurs: Auditeur[];
  formateurs: Formateur[];
  groupes: Groupe[];
  salles: Salle[];
  presences: Presence[];
  sessions: SessionPresence[];
  alertes: Alerte[];
  currentUser: User | null;
}

// Types pour les formulaires
export interface AuditeurFormData {
  nom: string;
  prenom: string;
  sexe: Sexe;
  groupeId: string;
  niveau: string;
  contact: string;
  departement: string;
  codeDepartement: string;
}

export interface FormateurFormData {
  nom: string;
  prenom: string;
  specialite: string;
  contact: string;
  email: string;
}

export interface GroupeFormData {
  nom: string;
  formateurId: string;
  salleId: string;
  jourPassage: JourPassage;
  heureDebut: string;
  heureFin: string;
  niveau: string;
  capaciteMax: number;
}

export interface SalleFormData {
  nom: string;
  capacite: number;
  description: string;
}

// Types pour les filtres
export interface AuditeurFilters {
  search: string;
  groupeId: string;
  sexe: string;
  departement: string;
  actif: string;
}

export interface PresenceFilters {
  date: string;
  groupeId: string;
  statut: string;
}

// Types pour les rapports
export interface RapportPresence {
  periode: 'jour' | 'semaine' | 'mois' | 'annee';
  dateDebut: string;
  dateFin: string;
  groupeId?: string;
  formateurId?: string;
  data: {
    date: string;
    presents: number;
    absents: number;
    retards: number;
    tauxPresence: number;
  }[];
}
