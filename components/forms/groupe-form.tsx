'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { useFormateurs, useSalles } from '@/lib/hooks/use-store';
import { JOURS_PASSAGE, NIVEAUX_ALPHABETISATION, HORAIRES } from '@/lib/data/constants';
import type { Groupe, JourPassage } from '@/lib/types';

interface GroupeFormProps {
  groupe?: Groupe;
  onSubmit: (data: Omit<Groupe, 'id' | 'matricule'>) => void;
  onCancel: () => void;
}

export function GroupeForm({ groupe, onSubmit, onCancel }: GroupeFormProps) {
  const { formateurs } = useFormateurs();
  const { salles } = useSalles();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: groupe?.nom || '',
    formateurId: groupe?.formateurId || '',
    salleId: groupe?.salleId || '',
    jourPassage: groupe?.jourPassage || ('Lundi' as JourPassage),
    heureDebut: groupe?.heureDebut || '08:00',
    heureFin: groupe?.heureFin || '10:00',
    niveau: groupe?.niveau || NIVEAUX_ALPHABETISATION[0],
    capaciteMax: groupe?.capaciteMax || 16,
    actif: groupe?.actif ?? true,
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
          <FieldLabel htmlFor="nom">Nom du groupe</FieldLabel>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            placeholder="Groupe 1"
            required
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="formateur">Formateur</FieldLabel>
            <Select
              value={formData.formateurId}
              onValueChange={(value) => setFormData({ ...formData, formateurId: value })}
            >
              <SelectTrigger id="formateur">
                <SelectValue placeholder="Selectionner un formateur" />
              </SelectTrigger>
              <SelectContent>
                {formateurs.filter(f => f.actif).map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.prenom} {f.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="salle">Salle</FieldLabel>
            <Select
              value={formData.salleId}
              onValueChange={(value) => setFormData({ ...formData, salleId: value })}
            >
              <SelectTrigger id="salle">
                <SelectValue placeholder="Selectionner une salle" />
              </SelectTrigger>
              <SelectContent>
                {salles.filter(s => s.disponible).map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nom} (Capacite: {s.capacite})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="jour">Jour de passage</FieldLabel>
            <Select
              value={formData.jourPassage}
              onValueChange={(value: JourPassage) => setFormData({ ...formData, jourPassage: value })}
            >
              <SelectTrigger id="jour">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOURS_PASSAGE.map((jour) => (
                  <SelectItem key={jour} value={jour}>
                    {jour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="heureDebut">Heure de debut</FieldLabel>
            <Select
              value={formData.heureDebut}
              onValueChange={(value) => setFormData({ ...formData, heureDebut: value })}
            >
              <SelectTrigger id="heureDebut">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HORAIRES.debut.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="heureFin">Heure de fin</FieldLabel>
            <Select
              value={formData.heureFin}
              onValueChange={(value) => setFormData({ ...formData, heureFin: value })}
            >
              <SelectTrigger id="heureFin">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HORAIRES.fin.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
          <Field>
            <FieldLabel htmlFor="capacite">Capacite maximale</FieldLabel>
            <Input
              id="capacite"
              type="number"
              min={1}
              max={30}
              value={formData.capaciteMax}
              onChange={(e) => setFormData({ ...formData, capaciteMax: Number(e.target.value) })}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Spinner className="mr-2 size-4" />}
            {groupe ? 'Mettre a jour' : 'Creer'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
