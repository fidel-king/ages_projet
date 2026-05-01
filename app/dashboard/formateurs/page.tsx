'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormateurForm } from '@/components/forms/formateur-form';
import { useFormateurs, useGroupes } from '@/lib/hooks/use-store';
import type { Formateur } from '@/lib/types';

export default function FormateursPage() {
  const router = useRouter();
  const { formateurs, add, refresh } = useFormateurs();
  const { groupes } = useGroupes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getGroupesCount = (formateurId: string) => {
    return groupes.filter((g) => g.formateurId === formateurId).length;
  };

  const handleSubmit = (data: Omit<Formateur, 'id' | 'matricule' | 'createdAt'>) => {
    add(data);
    setIsDialogOpen(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Formateurs</h1>
          <p className="text-muted-foreground">
            Gestion des {formateurs.length} formateurs
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Nouveau formateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un formateur</DialogTitle>
              <DialogDescription>
                Remplissez les informations du nouveau formateur
              </DialogDescription>
            </DialogHeader>
            <FormateurForm onSubmit={handleSubmit} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {formateurs.map((formateur) => (
          <Card 
            key={formateur.id} 
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => router.push(`/dashboard/formateurs/${formateur.id}`)}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="size-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {formateur.prenom[0]}{formateur.nom[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg">
                  {formateur.prenom} {formateur.nom}
                </CardTitle>
                <CardDescription>{formateur.matricule}</CardDescription>
              </div>
              <Badge variant={formateur.actif ? 'default' : 'secondary'}>
                {formateur.actif ? 'Actif' : 'Inactif'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">{formateur.specialite}</p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Phone className="size-3 text-muted-foreground" />
                    {formateur.contact}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="size-3 text-muted-foreground" />
                  {formateur.email}
                </div>
                <div className="pt-2">
                  <Badge variant="outline">
                    {getGroupesCount(formateur.id)} groupe(s) assigne(s)
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
