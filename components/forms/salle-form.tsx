'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import type { Salle } from '@/lib/types';

interface SalleFormProps {
  salle?: Salle;
  onSubmit: (data: Omit<Salle, 'id'>) => void;
  onCancel: () => void;
}

export function SalleForm({ salle, onSubmit, onCancel }: SalleFormProps) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: salle?.nom || '',
    capacite: salle?.capacite || 20,
    description: salle?.description || '',
    disponible: salle?.disponible ?? true,
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
        <Field>
          <FieldLabel htmlFor="nom">Nom de la salle</FieldLabel>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            placeholder="Salle A1"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="capacite">Capacite (nombre de places)</FieldLabel>
          <Input
            id="capacite"
            type="number"
            min={1}
            max={100}
            value={formData.capacite}
            onChange={(e) => setFormData({ ...formData, capacite: Number(e.target.value) })}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description de la salle (emplacement, equipements...)"
            rows={3}
          />
        </Field>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Spinner className="mr-2 size-4" />}
            {salle ? 'Mettre a jour' : 'Ajouter'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
