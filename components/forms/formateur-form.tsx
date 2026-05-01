'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import type { Formateur } from '@/lib/types';

interface FormateurFormProps {
  formateur?: Formateur;
  onSubmit: (data: Omit<Formateur, 'id' | 'matricule' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function FormateurForm({ formateur, onSubmit, onCancel }: FormateurFormProps) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: formateur?.nom || '',
    prenom: formateur?.prenom || '',
    specialite: formateur?.specialite || '',
    contact: formateur?.contact || '',
    email: formateur?.email || '',
    actif: formateur?.actif ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
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

        <Field>
          <FieldLabel htmlFor="specialite">Specialite</FieldLabel>
          <Input
            id="specialite"
            value={formData.specialite}
            onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
            placeholder="Alphabetisation de base"
            required
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="contact">Telephone</FieldLabel>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="620000000"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="formateur@ages.gn"
              required
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Spinner className="mr-2 size-4" />}
            {formateur ? 'Mettre a jour' : 'Ajouter'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
