// Constantes pour l'application

import type { JourPassage, PresenceStatut, UserRole } from '@/lib/types';

// Jours de passage disponibles
export const JOURS_PASSAGE: JourPassage[] = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
];

// Statuts de présence
export const STATUTS_PRESENCE: { value: PresenceStatut; label: string; color: string }[] = [
  { value: 'present', label: 'Présent', color: 'bg-green-500' },
  { value: 'absent', label: 'Absent', color: 'bg-red-500' },
  { value: 'retard', label: 'Retard', color: 'bg-yellow-500' },
];

// Rôles utilisateur
export const ROLES_UTILISATEUR: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrateur' },
  { value: 'formateur', label: 'Formateur' },
  { value: 'superviseur', label: 'Superviseur' },
  { value: 'direction', label: 'Direction' },
];

// Niveaux d'alphabétisation
export const NIVEAUX_ALPHABETISATION = [
  'Débutant',
  'Intermédiaire',
  'Avancé',
  'Perfectionnement',
];

// Départements SAG
export const DEPARTEMENTS_SAG = [
  { code: 'PROD', nom: 'Production' },
  { code: 'MAINT', nom: 'Maintenance' },
  { code: 'LOG', nom: 'Logistique' },
  { code: 'QUAL', nom: 'Qualité' },
  { code: 'ADM', nom: 'Administration' },
  { code: 'SEC', nom: 'Sécurité' },
  { code: 'RH', nom: 'Ressources Humaines' },
  { code: 'FIN', nom: 'Finances' },
  { code: 'TECH', nom: 'Technique' },
  { code: 'ENV', nom: 'Environnement' },
];

// Horaires disponibles
export const HORAIRES = {
  debut: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
  fin: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
};

// Configuration de l'application
export const APP_CONFIG = {
  nom: 'AGES - Académie SAG',
  nomComplet: "Académie d'Alphabétisation des travailleurs de la SAG",
  version: '1.0.0',
  annee: 2026,
  capaciteMaxGroupe: 16,
  tauxPresenceAlerte: 70, // Pourcentage en dessous duquel une alerte est générée
  absencesConsecutivesAlerte: 3, // Nombre d'absences consécutives pour alerte
};

// Clés localStorage
export const STORAGE_KEYS = {
  users: 'ages_users',
  auditeurs: 'ages_auditeurs',
  formateurs: 'ages_formateurs',
  groupes: 'ages_groupes',
  salles: 'ages_salles',
  presences: 'ages_presences',
  sessions: 'ages_sessions',
  alertes: 'ages_alertes',
  currentUser: 'ages_current_user',
  initialized: 'ages_initialized',
};

// Navigation du menu
export const MENU_ITEMS = [
  {
    title: 'Tableau de bord',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    roles: ['admin', 'formateur', 'superviseur', 'direction'] as UserRole[],
  },
  {
    title: 'Auditeurs',
    href: '/dashboard/auditeurs',
    icon: 'Users',
    roles: ['admin', 'formateur', 'superviseur', 'direction'] as UserRole[],
  },
  {
    title: 'Formateurs',
    href: '/dashboard/formateurs',
    icon: 'GraduationCap',
    roles: ['admin', 'superviseur', 'direction'] as UserRole[],
  },
  {
    title: 'Groupes',
    href: '/dashboard/groupes',
    icon: 'UsersRound',
    roles: ['admin', 'formateur', 'superviseur', 'direction'] as UserRole[],
  },
  {
    title: 'Salles',
    href: '/dashboard/salles',
    icon: 'DoorOpen',
    roles: ['admin', 'superviseur'] as UserRole[],
  },
  {
    title: 'Présences',
    href: '/dashboard/presences',
    icon: 'ClipboardCheck',
    roles: ['admin', 'formateur', 'superviseur', 'direction'] as UserRole[],
  },
  {
    title: 'Planning',
    href: '/dashboard/planning',
    icon: 'Calendar',
    roles: ['admin', 'formateur', 'superviseur', 'direction'] as UserRole[],
  },
  {
    title: 'Rapports',
    href: '/dashboard/rapports',
    icon: 'FileBarChart',
    roles: ['admin', 'superviseur', 'direction'] as UserRole[],
  },
  {
    title: 'Paramètres',
    href: '/dashboard/parametres',
    icon: 'Settings',
    roles: ['admin'] as UserRole[],
  },
];
