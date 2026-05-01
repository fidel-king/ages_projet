'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, User, Phone, Building, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { AuditeurForm } from '@/components/forms/auditeur-form';
import { useAuditeurs, useGroupes, usePresences } from '@/lib/hooks/use-store';
import type { Auditeur, Presence } from '@/lib/types';

export default function AuditeurDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getById, update, remove, refresh } = useAuditeurs();
  const { groupes } = useGroupes();
  const { getByAuditeur } = usePresences();
  
  const [auditeur, setAuditeur] = useState<Auditeur | undefined>();
  const [presences, setPresences] = useState<Presence[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const found = getById(id);
    setAuditeur(found);
    if (found) {
      setPresences(getByAuditeur(found.id));
    }
  }, [params.id, getById, getByAuditeur]);

  if (!auditeur) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Auditeur non trouve</p>
      </div>
    );
  }

  const groupe = groupes.find((g) => g.id === auditeur.groupeId);
  
  const stats = {
    total: presences.length,
    presents: presences.filter((p) => p.statut === 'present').length,
    absents: presences.filter((p) => p.statut === 'absent').length,
    retards: presences.filter((p) => p.statut === 'retard').length,
  };
  
  const tauxPresence = stats.total > 0 
    ? Math.round(((stats.presents + stats.retards) / stats.total) * 100) 
    : 0;

  const handleUpdate = (data: Omit<Auditeur, 'id' | 'matricule' | 'dateInscription'>) => {
    update(auditeur.id, data);
    refresh();
    setAuditeur({ ...auditeur, ...data });
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    remove(auditeur.id);
    router.push('/dashboard/auditeurs');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {auditeur.prenom} {auditeur.nom}
          </h1>
          <p className="text-muted-foreground">{auditeur.matricule}</p>
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
                  Etes-vous sur de vouloir supprimer cet auditeur ? Cette action est irreversible.
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
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom complet</p>
                <p className="font-medium">{auditeur.prenom} {auditeur.nom}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sexe</p>
                <Badge variant="outline">
                  {auditeur.sexe === 'M' ? 'Homme' : 'Femme'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="size-3" />
                  {auditeur.contact || 'Non renseigne'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <Badge variant={auditeur.actif ? 'default' : 'secondary'}>
                  {auditeur.actif ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Departement</p>
                <p className="font-medium flex items-center gap-1">
                  <Building className="size-3" />
                  {auditeur.departement}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date d&apos;inscription</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="size-3" />
                  {new Date(auditeur.dateInscription).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Groupe et formation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Groupe</p>
                <p className="font-medium">{groupe?.nom || 'Non assigne'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jour de passage</p>
                <Badge variant="outline">{groupe?.jourPassage || '-'}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Horaire</p>
                <p className="font-medium">
                  {groupe ? `${groupe.heureDebut} - ${groupe.heureFin}` : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Niveau</p>
                <Badge>{auditeur.niveau}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques de presence</CardTitle>
          <CardDescription>
            Historique des presences de l&apos;auditeur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Seances totales</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.presents}</p>
              <p className="text-sm text-muted-foreground">Presences</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{stats.absents}</p>
              <p className="text-sm text-muted-foreground">Absences</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-primary">{tauxPresence}%</p>
              <p className="text-sm text-muted-foreground">Taux de presence</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;auditeur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l&apos;auditeur
            </DialogDescription>
          </DialogHeader>
          <AuditeurForm
            auditeur={auditeur}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
