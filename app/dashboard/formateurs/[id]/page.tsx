'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormateurForm } from '@/components/forms/formateur-form';
import { useFormateurs, useGroupes, useAuditeurs } from '@/lib/hooks/use-store';
import type { Formateur } from '@/lib/types';

export default function FormateurDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getById, update, remove, refresh } = useFormateurs();
  const { groupes } = useGroupes();
  const { auditeurs } = useAuditeurs();
  
  const [formateur, setFormateur] = useState<Formateur | undefined>();
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const found = getById(id);
    setFormateur(found);
  }, [params.id, getById]);

  if (!formateur) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Formateur non trouve</p>
      </div>
    );
  }

  const formateurGroupes = groupes.filter((g) => g.formateurId === formateur.id);
  const totalAuditeurs = formateurGroupes.reduce((acc, groupe) => {
    return acc + auditeurs.filter((a) => a.groupeId === groupe.id).length;
  }, 0);

  const handleUpdate = (data: Omit<Formateur, 'id' | 'matricule' | 'createdAt'>) => {
    update(formateur.id, data);
    refresh();
    setFormateur({ ...formateur, ...data });
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    remove(formateur.id);
    router.push('/dashboard/formateurs');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <Avatar className="size-12">
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {formateur.prenom[0]}{formateur.nom[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {formateur.prenom} {formateur.nom}
          </h1>
          <p className="text-muted-foreground">{formateur.matricule}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <Edit className="mr-2 size-4" />
            Modifier
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 size-4" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Etes-vous sur de vouloir supprimer ce formateur ? Cette action est irreversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Specialite</p>
                <p className="font-medium">{formateur.specialite}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <Badge variant={formateur.actif ? 'default' : 'secondary'}>
                  {formateur.actif ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telephone</p>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="size-3" />
                  {formateur.contact}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium flex items-center gap-1">
                  <Mail className="size-3" />
                  {formateur.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold">{formateurGroupes.length}</p>
                <p className="text-sm text-muted-foreground">Groupes</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold">{totalAuditeurs}</p>
                <p className="text-sm text-muted-foreground">Auditeurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Groupes assignes
          </CardTitle>
          <CardDescription>
            {formateurGroupes.length} groupe(s) sous la responsabilite de ce formateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formateurGroupes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun groupe assigne
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {formateurGroupes.map((groupe) => (
                <div
                  key={groupe.id}
                  className="rounded-lg border p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/dashboard/groupes/${groupe.id}`)}
                >
                  <p className="font-medium">{groupe.nom}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{groupe.jourPassage}</Badge>
                    <span>{groupe.heureDebut} - {groupe.heureFin}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le formateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations du formateur
            </DialogDescription>
          </DialogHeader>
          <FormateurForm
            formateur={formateur}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
