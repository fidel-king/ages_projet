'use client';

import { useState } from 'react';
import { Plus, DoorOpen, Users, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { SalleForm } from '@/components/forms/salle-form';
import { useSalles, useGroupes } from '@/lib/hooks/use-store';
import type { Salle } from '@/lib/types';

export default function SallesPage() {
  const { salles, add, update, remove, refresh } = useSalles();
  const { groupes } = useGroupes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSalle, setEditingSalle] = useState<Salle | undefined>();

  const getGroupesCount = (salleId: string) => {
    return groupes.filter((g) => g.salleId === salleId).length;
  };

  const handleSubmit = (data: Omit<Salle, 'id'>) => {
    if (editingSalle) {
      update(editingSalle.id, data);
    } else {
      add(data);
    }
    setIsDialogOpen(false);
    setEditingSalle(undefined);
    refresh();
  };

  const handleEdit = (salle: Salle) => {
    setEditingSalle(salle);
    setIsDialogOpen(true);
  };

  const handleToggleDisponible = (salle: Salle) => {
    update(salle.id, { disponible: !salle.disponible });
    refresh();
  };

  const handleDelete = (salleId: string) => {
    remove(salleId);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Salles</h1>
          <p className="text-muted-foreground">
            Gestion des {salles.length} salles de formation
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingSalle(undefined);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Nouvelle salle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSalle ? 'Modifier la salle' : 'Ajouter une salle'}
              </DialogTitle>
              <DialogDescription>
                {editingSalle 
                  ? 'Modifiez les informations de la salle'
                  : 'Remplissez les informations de la nouvelle salle'
                }
              </DialogDescription>
            </DialogHeader>
            <SalleForm 
              salle={editingSalle}
              onSubmit={handleSubmit} 
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingSalle(undefined);
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {salles.map((salle) => (
          <Card key={salle.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${salle.disponible ? 'bg-primary/10' : 'bg-muted'}`}>
                  <DoorOpen className={`size-5 ${salle.disponible ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <CardTitle className="text-lg">{salle.nom}</CardTitle>
                  <CardDescription>{salle.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <span className="text-sm">Capacite: {salle.capacite} places</span>
                  </div>
                  <Badge variant="outline">
                    {getGroupesCount(salle.id)} groupe(s)
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Disponible</span>
                    <Switch
                      checked={salle.disponible}
                      onCheckedChange={() => handleToggleDisponible(salle)}
                    />
                  </div>
                  <Badge variant={salle.disponible ? 'default' : 'secondary'}>
                    {salle.disponible ? 'Oui' : 'Non'}
                  </Badge>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(salle)}>
                    <Edit className="mr-1 size-3" />
                    Modifier
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-1 size-3" />
                        Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                          Etes-vous sur de vouloir supprimer cette salle ?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(salle.id)}>
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
