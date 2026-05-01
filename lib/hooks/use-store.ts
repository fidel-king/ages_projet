// Hooks personnalisés pour accéder au store

'use client';

import { useState, useEffect, useCallback } from 'react';
import * as store from '@/lib/store';
import type { 
  User, Auditeur, Formateur, Groupe, Salle, Presence 
} from '@/lib/types';

// Hook pour l'initialisation du store
export function useInitStore() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const wasInitialized = store.initializeStore();
    setInitialized(wasInitialized);
    setLoading(false);
  }, []);

  return { initialized, loading };
}

// Hook pour l'authentification
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = store.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const loggedUser = store.login(email, password);
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const logout = useCallback(() => {
    store.logout();
    setUser(null);
  }, []);

  return { user, loading, login, logout, isAuthenticated: !!user };
}

// Hook pour les auditeurs
export function useAuditeurs() {
  const [auditeurs, setAuditeurs] = useState<Auditeur[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setAuditeurs(store.getAuditeurs());
  }, []);

  useEffect(() => {
    refresh();
    setLoading(false);
  }, [refresh]);

  const add = useCallback((data: Omit<Auditeur, 'id' | 'matricule' | 'dateInscription'>) => {
    const newAuditeur = store.addAuditeur(data);
    refresh();
    return newAuditeur;
  }, [refresh]);

  const update = useCallback((id: string, data: Partial<Auditeur>) => {
    const updated = store.updateAuditeur(id, data);
    refresh();
    return updated;
  }, [refresh]);

  const remove = useCallback((id: string) => {
    const success = store.deleteAuditeur(id);
    refresh();
    return success;
  }, [refresh]);

  const getById = useCallback((id: string) => {
    return store.getAuditeurById(id);
  }, []);

  const getByGroupe = useCallback((groupeId: string) => {
    return store.getAuditeursByGroupe(groupeId);
  }, []);

  return { auditeurs, loading, refresh, add, update, remove, getById, getByGroupe };
}

// Hook pour les formateurs
export function useFormateurs() {
  const [formateurs, setFormateurs] = useState<Formateur[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setFormateurs(store.getFormateurs());
  }, []);

  useEffect(() => {
    refresh();
    setLoading(false);
  }, [refresh]);

  const add = useCallback((data: Omit<Formateur, 'id' | 'matricule' | 'createdAt'>) => {
    const newFormateur = store.addFormateur(data);
    refresh();
    return newFormateur;
  }, [refresh]);

  const update = useCallback((id: string, data: Partial<Formateur>) => {
    const updated = store.updateFormateur(id, data);
    refresh();
    return updated;
  }, [refresh]);

  const remove = useCallback((id: string) => {
    const success = store.deleteFormateur(id);
    refresh();
    return success;
  }, [refresh]);

  const getById = useCallback((id: string) => {
    return store.getFormateurById(id);
  }, []);

  return { formateurs, loading, refresh, add, update, remove, getById };
}

// Hook pour les groupes
export function useGroupes() {
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setGroupes(store.getGroupes());
  }, []);

  useEffect(() => {
    refresh();
    setLoading(false);
  }, [refresh]);

  const add = useCallback((data: Omit<Groupe, 'id' | 'matricule'>) => {
    const newGroupe = store.addGroupe(data);
    refresh();
    return newGroupe;
  }, [refresh]);

  const update = useCallback((id: string, data: Partial<Groupe>) => {
    const updated = store.updateGroupe(id, data);
    refresh();
    return updated;
  }, [refresh]);

  const remove = useCallback((id: string) => {
    const success = store.deleteGroupe(id);
    refresh();
    return success;
  }, [refresh]);

  const getById = useCallback((id: string) => {
    return store.getGroupeById(id);
  }, []);

  const getByJour = useCallback((jour: string) => {
    return store.getGroupesByJour(jour);
  }, []);

  const getByFormateur = useCallback((formateurId: string) => {
    return store.getGroupesByFormateur(formateurId);
  }, []);

  return { groupes, loading, refresh, add, update, remove, getById, getByJour, getByFormateur };
}

// Hook pour les salles
export function useSalles() {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setSalles(store.getSalles());
  }, []);

  useEffect(() => {
    refresh();
    setLoading(false);
  }, [refresh]);

  const add = useCallback((data: Omit<Salle, 'id'>) => {
    const newSalle = store.addSalle(data);
    refresh();
    return newSalle;
  }, [refresh]);

  const update = useCallback((id: string, data: Partial<Salle>) => {
    const updated = store.updateSalle(id, data);
    refresh();
    return updated;
  }, [refresh]);

  const remove = useCallback((id: string) => {
    const success = store.deleteSalle(id);
    refresh();
    return success;
  }, [refresh]);

  const getById = useCallback((id: string) => {
    return store.getSalleById(id);
  }, []);

  return { salles, loading, refresh, add, update, remove, getById };
}

// Hook pour les présences
export function usePresences() {
  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setPresences(store.getPresences());
  }, []);

  useEffect(() => {
    refresh();
    setLoading(false);
  }, [refresh]);

  const add = useCallback((data: Omit<Presence, 'id' | 'createdAt'>) => {
    const newPresence = store.addPresence(data);
    refresh();
    return newPresence;
  }, [refresh]);

  const saveBatch = useCallback((presencesList: Omit<Presence, 'id' | 'createdAt'>[]) => {
    store.savePresencesBatch(presencesList);
    refresh();
  }, [refresh]);

  const getByDate = useCallback((date: string) => {
    return store.getPresencesByDate(date);
  }, []);

  const getByGroupe = useCallback((groupeId: string) => {
    return store.getPresencesByGroupe(groupeId);
  }, []);

  const getByAuditeur = useCallback((auditeurId: string) => {
    return store.getPresencesByAuditeur(auditeurId);
  }, []);

  const getByDateAndGroupe = useCallback((date: string, groupeId: string) => {
    return store.getPresencesByDateAndGroupe(date, groupeId);
  }, []);

  return { presences, loading, refresh, add, saveBatch, getByDate, getByGroupe, getByAuditeur, getByDateAndGroupe };
}

// Hook pour les statistiques
export function useStatistiques() {
  const [stats, setStats] = useState(store.getStatistiques());
  const [presencesParJour, setPresencesParJour] = useState(store.getPresencesParJour());
  const [statsParGroupe, setStatsParGroupe] = useState(store.getStatsParGroupe());

  const refresh = useCallback(() => {
    setStats(store.getStatistiques());
    setPresencesParJour(store.getPresencesParJour());
    setStatsParGroupe(store.getStatsParGroupe());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, presencesParJour, statsParGroupe, refresh };
}

// Hook pour les alertes
export function useAlertes() {
  const [alertes, setAlertes] = useState(store.getAlertes());
  const [nonLues, setNonLues] = useState(store.getAlertesNonLues());

  const refresh = useCallback(() => {
    setAlertes(store.getAlertes());
    setNonLues(store.getAlertesNonLues());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const markAsRead = useCallback((id: string) => {
    store.markAlerteAsRead(id);
    refresh();
  }, [refresh]);

  return { alertes, nonLues, refresh, markAsRead };
}
