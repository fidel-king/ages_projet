// Store localStorage pour l'application

import type { 
  User, Auditeur, Formateur, Groupe, Salle, 
  Presence, SessionPresence, Alerte, AppState 
} from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/data/constants';
import { seedData, generateTestPresences } from '@/lib/data/seed';

// Vérifier si on est côté client
const isClient = typeof window !== 'undefined';

// Fonctions de base pour localStorage
function getItem<T>(key: string, defaultValue: T): T {
  if (!isClient) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isClient) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
  }
}

// Initialiser les données si nécessaire
export function initializeStore(): boolean {
  if (!isClient) return false;
  
  const isInitialized = localStorage.getItem(STORAGE_KEYS.initialized);
  
  if (!isInitialized) {
    // Sauvegarder les données initiales
    setItem(STORAGE_KEYS.users, seedData.users);
    setItem(STORAGE_KEYS.formateurs, seedData.formateurs);
    setItem(STORAGE_KEYS.salles, seedData.salles);
    setItem(STORAGE_KEYS.groupes, seedData.groupes);
    setItem(STORAGE_KEYS.auditeurs, seedData.auditeurs);
    setItem(STORAGE_KEYS.presences, generateTestPresences());
    setItem(STORAGE_KEYS.sessions, []);
    setItem(STORAGE_KEYS.alertes, []);
    
    localStorage.setItem(STORAGE_KEYS.initialized, 'true');
    return true;
  }
  
  return false;
}

// Reset des données
export function resetStore(): void {
  if (!isClient) return;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  initializeStore();
}

// === USERS ===
export function getUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.users, []);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email === email);
}

export function getCurrentUser(): User | null {
  return getItem<User | null>(STORAGE_KEYS.currentUser, null);
}

export function setCurrentUser(user: User | null): void {
  setItem(STORAGE_KEYS.currentUser, user);
}

export function login(email: string, password: string): User | null {
  const user = getUserByEmail(email);
  if (user && user.password === password && user.actif) {
    setCurrentUser(user);
    return user;
  }
  return null;
}

export function logout(): void {
  setCurrentUser(null);
}

// === AUDITEURS ===
export function getAuditeurs(): Auditeur[] {
  return getItem<Auditeur[]>(STORAGE_KEYS.auditeurs, []);
}

export function getAuditeurById(id: string): Auditeur | undefined {
  return getAuditeurs().find(a => a.id === id);
}

export function getAuditeursByGroupe(groupeId: string): Auditeur[] {
  return getAuditeurs().filter(a => a.groupeId === groupeId);
}

export function addAuditeur(auditeur: Omit<Auditeur, 'id' | 'matricule' | 'dateInscription'>): Auditeur {
  const auditeurs = getAuditeurs();
  const newAuditeur: Auditeur = {
    ...auditeur,
    id: `aud-${Date.now()}`,
    matricule: `A-${String(auditeurs.length + 1).padStart(4, '0')}`,
    dateInscription: new Date().toISOString().split('T')[0],
  };
  setItem(STORAGE_KEYS.auditeurs, [...auditeurs, newAuditeur]);
  return newAuditeur;
}

export function updateAuditeur(id: string, data: Partial<Auditeur>): Auditeur | null {
  const auditeurs = getAuditeurs();
  const index = auditeurs.findIndex(a => a.id === id);
  if (index === -1) return null;
  
  auditeurs[index] = { ...auditeurs[index], ...data };
  setItem(STORAGE_KEYS.auditeurs, auditeurs);
  return auditeurs[index];
}

export function deleteAuditeur(id: string): boolean {
  const auditeurs = getAuditeurs();
  const filtered = auditeurs.filter(a => a.id !== id);
  if (filtered.length === auditeurs.length) return false;
  
  setItem(STORAGE_KEYS.auditeurs, filtered);
  return true;
}

// === FORMATEURS ===
export function getFormateurs(): Formateur[] {
  return getItem<Formateur[]>(STORAGE_KEYS.formateurs, []);
}

export function getFormateurById(id: string): Formateur | undefined {
  return getFormateurs().find(f => f.id === id);
}

export function addFormateur(formateur: Omit<Formateur, 'id' | 'matricule' | 'createdAt'>): Formateur {
  const formateurs = getFormateurs();
  const newFormateur: Formateur = {
    ...formateur,
    id: `form-${Date.now()}`,
    matricule: `F-${String(formateurs.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
  };
  setItem(STORAGE_KEYS.formateurs, [...formateurs, newFormateur]);
  return newFormateur;
}

export function updateFormateur(id: string, data: Partial<Formateur>): Formateur | null {
  const formateurs = getFormateurs();
  const index = formateurs.findIndex(f => f.id === id);
  if (index === -1) return null;
  
  formateurs[index] = { ...formateurs[index], ...data };
  setItem(STORAGE_KEYS.formateurs, formateurs);
  return formateurs[index];
}

export function deleteFormateur(id: string): boolean {
  const formateurs = getFormateurs();
  const filtered = formateurs.filter(f => f.id !== id);
  if (filtered.length === formateurs.length) return false;
  
  setItem(STORAGE_KEYS.formateurs, filtered);
  return true;
}

// === GROUPES ===
export function getGroupes(): Groupe[] {
  return getItem<Groupe[]>(STORAGE_KEYS.groupes, []);
}

export function getGroupeById(id: string): Groupe | undefined {
  return getGroupes().find(g => g.id === id);
}

export function getGroupesByJour(jour: string): Groupe[] {
  return getGroupes().filter(g => g.jourPassage === jour);
}

export function getGroupesByFormateur(formateurId: string): Groupe[] {
  return getGroupes().filter(g => g.formateurId === formateurId);
}

export function addGroupe(groupe: Omit<Groupe, 'id' | 'matricule'>): Groupe {
  const groupes = getGroupes();
  const newGroupe: Groupe = {
    ...groupe,
    id: `groupe-${Date.now()}`,
    matricule: `G-${String(groupes.length + 1).padStart(3, '0')}`,
  };
  setItem(STORAGE_KEYS.groupes, [...groupes, newGroupe]);
  return newGroupe;
}

export function updateGroupe(id: string, data: Partial<Groupe>): Groupe | null {
  const groupes = getGroupes();
  const index = groupes.findIndex(g => g.id === id);
  if (index === -1) return null;
  
  groupes[index] = { ...groupes[index], ...data };
  setItem(STORAGE_KEYS.groupes, groupes);
  return groupes[index];
}

export function deleteGroupe(id: string): boolean {
  const groupes = getGroupes();
  const filtered = groupes.filter(g => g.id !== id);
  if (filtered.length === groupes.length) return false;
  
  setItem(STORAGE_KEYS.groupes, filtered);
  return true;
}

// === SALLES ===
export function getSalles(): Salle[] {
  return getItem<Salle[]>(STORAGE_KEYS.salles, []);
}

export function getSalleById(id: string): Salle | undefined {
  return getSalles().find(s => s.id === id);
}

export function addSalle(salle: Omit<Salle, 'id'>): Salle {
  const salles = getSalles();
  const newSalle: Salle = {
    ...salle,
    id: `salle-${Date.now()}`,
  };
  setItem(STORAGE_KEYS.salles, [...salles, newSalle]);
  return newSalle;
}

export function updateSalle(id: string, data: Partial<Salle>): Salle | null {
  const salles = getSalles();
  const index = salles.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  salles[index] = { ...salles[index], ...data };
  setItem(STORAGE_KEYS.salles, salles);
  return salles[index];
}

export function deleteSalle(id: string): boolean {
  const salles = getSalles();
  const filtered = salles.filter(s => s.id !== id);
  if (filtered.length === salles.length) return false;
  
  setItem(STORAGE_KEYS.salles, filtered);
  return true;
}

// === PRESENCES ===
export function getPresences(): Presence[] {
  return getItem<Presence[]>(STORAGE_KEYS.presences, []);
}

export function getPresencesByDate(date: string): Presence[] {
  return getPresences().filter(p => p.date === date);
}

export function getPresencesByGroupe(groupeId: string): Presence[] {
  return getPresences().filter(p => p.groupeId === groupeId);
}

export function getPresencesByAuditeur(auditeurId: string): Presence[] {
  return getPresences().filter(p => p.auditeurId === auditeurId);
}

export function getPresencesByDateAndGroupe(date: string, groupeId: string): Presence[] {
  return getPresences().filter(p => p.date === date && p.groupeId === groupeId);
}

export function addPresence(presence: Omit<Presence, 'id' | 'createdAt'>): Presence {
  const presences = getPresences();
  
  // Vérifier si une présence existe déjà pour ce jour/auditeur
  const existing = presences.findIndex(
    p => p.date === presence.date && p.auditeurId === presence.auditeurId
  );
  
  if (existing !== -1) {
    // Mettre à jour la présence existante
    presences[existing] = {
      ...presences[existing],
      ...presence,
      createdAt: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.presences, presences);
    return presences[existing];
  }
  
  const newPresence: Presence = {
    ...presence,
    id: `pres-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    createdAt: new Date().toISOString(),
  };
  setItem(STORAGE_KEYS.presences, [...presences, newPresence]);
  return newPresence;
}

export function updatePresence(id: string, data: Partial<Presence>): Presence | null {
  const presences = getPresences();
  const index = presences.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  presences[index] = { ...presences[index], ...data };
  setItem(STORAGE_KEYS.presences, presences);
  return presences[index];
}

export function savePresencesBatch(presences: Omit<Presence, 'id' | 'createdAt'>[]): void {
  presences.forEach(p => addPresence(p));
}

// === ALERTES ===
export function getAlertes(): Alerte[] {
  return getItem<Alerte[]>(STORAGE_KEYS.alertes, []);
}

export function getAlertesNonLues(): Alerte[] {
  return getAlertes().filter(a => !a.vue);
}

export function addAlerte(alerte: Omit<Alerte, 'id' | 'createdAt'>): Alerte {
  const alertes = getAlertes();
  const newAlerte: Alerte = {
    ...alerte,
    id: `alert-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  setItem(STORAGE_KEYS.alertes, [...alertes, newAlerte]);
  return newAlerte;
}

export function markAlerteAsRead(id: string): void {
  const alertes = getAlertes();
  const index = alertes.findIndex(a => a.id === id);
  if (index !== -1) {
    alertes[index].vue = true;
    setItem(STORAGE_KEYS.alertes, alertes);
  }
}

// === STATISTIQUES ===
export function getStatistiques() {
  const auditeurs = getAuditeurs().filter(a => a.actif);
  const presences = getPresences();
  const today = new Date().toISOString().split('T')[0];
  const presencesToday = presences.filter(p => p.date === today);
  
  const presentsToday = presencesToday.filter(p => p.statut === 'present').length;
  const absentsToday = presencesToday.filter(p => p.statut === 'absent').length;
  const retardsToday = presencesToday.filter(p => p.statut === 'retard').length;
  
  // Calcul du taux de présence global (sur toutes les présences)
  const totalPresences = presences.length;
  const totalPresents = presences.filter(p => p.statut === 'present' || p.statut === 'retard').length;
  const tauxGlobal = totalPresences > 0 ? Math.round((totalPresents / totalPresences) * 100) : 0;
  
  // Calcul du taux de la semaine
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  const presencesSemaine = presences.filter(p => p.date >= weekAgoStr);
  const presentsSemaine = presencesSemaine.filter(p => p.statut === 'present' || p.statut === 'retard').length;
  const tauxSemaine = presencesSemaine.length > 0 ? Math.round((presentsSemaine / presencesSemaine.length) * 100) : 0;
  
  return {
    totalAuditeurs: auditeurs.length,
    presentsAujourdhui: presentsToday,
    absentsAujourdhui: absentsToday,
    retardsAujourdhui: retardsToday,
    tauxPresenceGlobal: tauxGlobal,
    tauxPresenceSemaine: tauxSemaine,
  };
}

// Calcul des présences par jour pour les graphiques
export function getPresencesParJour(jours: number = 7) {
  const presences = getPresences();
  const data: { date: string; presents: number; absents: number; retards: number }[] = [];
  
  for (let i = jours - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const jourNom = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(date);
    
    const presencesJour = presences.filter(p => p.date === dateStr);
    
    data.push({
      date: jourNom,
      presents: presencesJour.filter(p => p.statut === 'present').length,
      absents: presencesJour.filter(p => p.statut === 'absent').length,
      retards: presencesJour.filter(p => p.statut === 'retard').length,
    });
  }
  
  return data;
}

// Statistiques par groupe
export function getStatsParGroupe() {
  const groupes = getGroupes();
  const presences = getPresences();
  
  return groupes.map(groupe => {
    const presencesGroupe = presences.filter(p => p.groupeId === groupe.id);
    const total = presencesGroupe.length;
    const presents = presencesGroupe.filter(p => p.statut === 'present' || p.statut === 'retard').length;
    const taux = total > 0 ? Math.round((presents / total) * 100) : 0;
    
    return {
      id: groupe.id,
      nom: groupe.nom,
      total,
      presents,
      taux,
    };
  });
}

// Export des données pour sauvegarde
export function exportData(): AppState {
  return {
    users: getUsers(),
    auditeurs: getAuditeurs(),
    formateurs: getFormateurs(),
    groupes: getGroupes(),
    salles: getSalles(),
    presences: getPresences(),
    sessions: getItem<SessionPresence[]>(STORAGE_KEYS.sessions, []),
    alertes: getAlertes(),
    currentUser: getCurrentUser(),
  };
}

// Import des données depuis une sauvegarde
export function importData(data: Partial<AppState>): void {
  if (data.users) setItem(STORAGE_KEYS.users, data.users);
  if (data.auditeurs) setItem(STORAGE_KEYS.auditeurs, data.auditeurs);
  if (data.formateurs) setItem(STORAGE_KEYS.formateurs, data.formateurs);
  if (data.groupes) setItem(STORAGE_KEYS.groupes, data.groupes);
  if (data.salles) setItem(STORAGE_KEYS.salles, data.salles);
  if (data.presences) setItem(STORAGE_KEYS.presences, data.presences);
  if (data.sessions) setItem(STORAGE_KEYS.sessions, data.sessions);
  if (data.alertes) setItem(STORAGE_KEYS.alertes, data.alertes);
}
