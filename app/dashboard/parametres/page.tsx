"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSettings, useCurrentUser, useStore } from "@/lib/hooks/use-store";
import { Settings, Database, Bell, Shield, Trash2, Download, Upload, RefreshCw, Save, Check } from "lucide-react";
import { toast } from "sonner";

export default function ParametresPage() {
  const { data: settings, update: updateSettings } = useSettings();
  const { data: currentUser } = useCurrentUser();
  const store = useStore();
  
  const [isSaving, setIsSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateSettings(localSettings);
      toast.success("Parametres sauvegardes avec succes");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetData = () => {
    store.resetAllData();
    toast.success("Toutes les donnees ont ete reinitialisees");
    window.location.reload();
  };

  const handleExportData = () => {
    const data = store.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ages_backup_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Donnees exportees avec succes");
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        store.importData(data);
        toast.success("Donnees importees avec succes");
        window.location.reload();
      } catch (error) {
        toast.error("Erreur lors de l'import des donnees");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Parametres</h1>
          <p className="text-muted-foreground">
            Configuration du systeme AGES
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Sauvegarder
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="securite">
            <Shield className="mr-2 h-4 w-4" />
            Securite
          </TabsTrigger>
          <TabsTrigger value="donnees">
            <Database className="mr-2 h-4 w-4" />
            Donnees
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l&apos;Academie</CardTitle>
              <CardDescription>
                Parametres generaux de l&apos;Academie d&apos;Alphabetisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="academyName">Nom de l&apos;Academie</Label>
                  <Input
                    id="academyName"
                    value={localSettings.academyName}
                    onChange={(e) => setLocalSettings({ ...localSettings, academyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearStart">Annee Academique</Label>
                  <div className="flex gap-2">
                    <Input
                      id="yearStart"
                      type="number"
                      value={localSettings.academicYear.start}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        academicYear: { ...localSettings.academicYear, start: parseInt(e.target.value) }
                      })}
                    />
                    <span className="flex items-center">-</span>
                    <Input
                      type="number"
                      value={localSettings.academicYear.end}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        academicYear: { ...localSettings.academicYear, end: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maxAbsences">Seuil d&apos;alerte (absences)</Label>
                  <Input
                    id="maxAbsences"
                    type="number"
                    min={1}
                    max={10}
                    value={localSettings.maxAbsencesBeforeAlert}
                    onChange={(e) => setLocalSettings({ ...localSettings, maxAbsencesBeforeAlert: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nombre d&apos;absences avant declenchement d&apos;une alerte
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau Horaire</Label>
                  <Select
                    value={localSettings.timezone}
                    onValueChange={(value) => setLocalSettings({ ...localSettings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Libreville">Afrique/Libreville (UTC+1)</SelectItem>
                      <SelectItem value="Africa/Lagos">Afrique/Lagos (UTC+1)</SelectItem>
                      <SelectItem value="Europe/Paris">Europe/Paris (UTC+1/+2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Affichage</CardTitle>
              <CardDescription>Personnalisation de l&apos;interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mode Sombre</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer le theme sombre pour l&apos;interface
                  </p>
                </div>
                <Switch
                  checked={localSettings.darkMode}
                  onCheckedChange={(checked) => setLocalSettings({ ...localSettings, darkMode: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer les animations de l&apos;interface
                  </p>
                </div>
                <Switch
                  checked={localSettings.animations}
                  onCheckedChange={(checked) => setLocalSettings({ ...localSettings, animations: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferences de Notification</CardTitle>
              <CardDescription>
                Configurez les alertes et notifications du systeme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Alertes d&apos;absence</Label>
                  <p className="text-sm text-muted-foreground">
                    Notification quand un auditeur atteint le seuil d&apos;absences
                  </p>
                </div>
                <Switch
                  checked={localSettings.notifications.absenceAlerts}
                  onCheckedChange={(checked) => setLocalSettings({
                    ...localSettings,
                    notifications: { ...localSettings.notifications, absenceAlerts: checked }
                  })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Rappels de saisie</Label>
                  <p className="text-sm text-muted-foreground">
                    Rappel quotidien pour saisir les presences
                  </p>
                </div>
                <Switch
                  checked={localSettings.notifications.dailyReminder}
                  onCheckedChange={(checked) => setLocalSettings({
                    ...localSettings,
                    notifications: { ...localSettings.notifications, dailyReminder: checked }
                  })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Rapports hebdomadaires</Label>
                  <p className="text-sm text-muted-foreground">
                    Envoi automatique des rapports chaque semaine
                  </p>
                </div>
                <Switch
                  checked={localSettings.notifications.weeklyReport}
                  onCheckedChange={(checked) => setLocalSettings({
                    ...localSettings,
                    notifications: { ...localSettings.notifications, weeklyReport: checked }
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="securite" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compte Utilisateur</CardTitle>
              <CardDescription>
                Informations sur votre compte actuel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Nom d&apos;utilisateur</Label>
                  <p className="font-medium">{currentUser?.nom} {currentUser?.prenom}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{currentUser?.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Role</Label>
                  <Badge variant="secondary" className="mt-1">
                    {currentUser?.role}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Statut</Label>
                  <Badge variant="default" className="mt-1">
                    <Check className="mr-1 h-3 w-3" />
                    Actif
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Securite du Compte</CardTitle>
              <CardDescription>
                Options de securite et d&apos;authentification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Session Persistante</Label>
                  <p className="text-sm text-muted-foreground">
                    Rester connecte entre les sessions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <Button variant="outline">
                Modifier le mot de passe
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donnees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sauvegarde et Restauration</CardTitle>
              <CardDescription>
                Exportez ou importez les donnees du systeme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="outline" onClick={handleExportData} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter les donnees (JSON)
                </Button>
                <div className="flex-1">
                  <input
                    type="file"
                    id="import-file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("import-file")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Importer des donnees
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Les donnees exportees incluent : auditeurs, formateurs, groupes, salles, presences et parametres.
              </p>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Zone de Danger</CardTitle>
              <CardDescription>
                Actions irreversibles - Procedez avec prudence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Reinitialiser toutes les donnees
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Etes-vous sur ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action va supprimer toutes les donnees et les remplacer par les donnees de demonstration initiales.
                      Cette action est irreversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Reinitialiser
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <p className="text-sm text-muted-foreground">
                Cette action reinitialise le systeme avec les donnees de demonstration (400 auditeurs, 10 formateurs, 25 groupes).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques de Stockage</CardTitle>
              <CardDescription>
                Utilisation du stockage local
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">~50 KB</p>
                  <p className="text-sm text-muted-foreground">Donnees totales</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">localStorage</p>
                  <p className="text-sm text-muted-foreground">Type de stockage</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">5 MB</p>
                  <p className="text-sm text-muted-foreground">Limite navigateur</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-success">1%</p>
                  <p className="text-sm text-muted-foreground">Utilise</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
