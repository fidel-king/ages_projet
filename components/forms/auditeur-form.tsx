'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { useGroupes } from '@/lib/hooks/use-store';
import { NIVEAUX_ALPHABETISATION, DEPARTEMENTS_SAG } from '@/lib/data/constants';
import type { Auditeur, Sexe } from '@/lib/types';

interface AuditeurFormProps {
  auditeur?: Auditeur;
  onSubmit: (data: Omit<Auditeur, 'id' | 'matricule' | 'dateInscription'>) => void;
  onCancel: () => void;
}

export function AuditeurForm({ auditeur, onSubmit, onCancel }: AuditeurFormProps) {
  const { groupes } = useGroupes();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: auditeur?.nom || '',
    prenom: auditeur?.prenom || '',
    sexe: auditeur?.sexe || ('M' as Sexe),
    groupeId: auditeur?.groupeId || '',
    niveau: auditeur?.niveau || NIVEAUX_ALPHABETISATION[0],
    contact: auditeur?.contact || '',
    departement: auditeur?.departement || DEPARTEMENTS_SAG[0].nom,
    codeDepartement: auditeur?.codeDepartement || DEPARTEMENTS_SAG[0].code,
    actif: auditeur?.actif ?? true,
  });

  const handleDepartementChange = (value: string) => {
    const dept = DEPARTEMENTS_SAG.find((d) => d.nom === value);
    setFormData({
      ...formData,
      departement: value,
      codeDepartement: dept?.code || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="prenom">Prenom</FieldLabel>
          <Input
            id="prenom"
            value={formData.prenom}
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="nom">Nom</FieldLabel>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="sexe">Sexe</FieldLabel>
          <Select
            value={formData.sexe}
            onValueChange={(value: Sexe) => setFormData({ ...formData, sexe: value })}
          >
            <SelectTrigger id="sexe">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Homme</SelectItem>
              <SelectItem value="F">Femme</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="contact">Contact</FieldLabel>
          <Input
            id="contact"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            placeholder="620000000"
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="groupe">Groupe</FieldLabel>
          <Select
            value={formData.groupeId}
            onValueChange={(value) => setFormData({ ...formData, groupeId: value })}
          >
            <SelectTrigger id="groupe">
              <SelectValue placeholder="Selectionner un groupe" />
            </SelectTrigger>
            <SelectContent>
              {groupes.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.nom} ({g.jourPassage})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="niveau">Niveau</FieldLabel>
          <Select
            value={formData.niveau}
            onValueChange={(value) => setFormData({ ...formData, niveau: value })}
          >
            <SelectTrigger id="niveau">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NIVEAUX_ALPHABETISATION.map((niveau) => (
                <SelectItem key={niveau} value={niveau}>
                  {niveau}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="departement">Departement</FieldLabel>
        <Select value={formData.departement} onValueChange={handleDepartementChange}>
          <SelectTrigger id="departement">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DEPARTEMENTS_SAG.map((dept) => (
              <SelectItem key={dept.code} value={dept.nom}>
                {dept.nom} ({dept.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Spinner className="mr-2 size-4" />}
          {auditeur ? 'Mettre a jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
