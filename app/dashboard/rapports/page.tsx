"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { useAuditeurs, useFormateurs, useGroupes, usePresences, useSalles } from "@/lib/hooks/use-store";
import { FileDown, FileSpreadsheet, TrendingUp, TrendingDown, Users, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { JOURS_PASSAGE, NIVEAUX_ALPHABETISATION } from "@/lib/data/constants";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function RapportsPage() {
  const { data: auditeurs } = useAuditeurs();
  const { data: formateurs } = useFormateurs();
  const { data: groupes } = useGroupes();
  const { data: presences } = usePresences();
  const { data: salles } = useSalles();
  
  const [selectedGroupe, setSelectedGroupe] = useState<string>("all");
  const [selectedPeriode, setSelectedPeriode] = useState<string>("semaine");

  // Stats globales
  const stats = useMemo(() => {
    const totalAuditeurs = auditeurs.filter(a => a.statut === "actif").length;
    const totalPresences = presences.filter(p => p.statut === "present").length;
    const totalAbsences = presences.filter(p => p.statut === "absent").length;
    const totalRetards = presences.filter(p => p.statut === "retard").length;
    const totalRecords = presences.length || 1;
    
    return {
      totalAuditeurs,
      tauxPresence: Math.round((totalPresences / totalRecords) * 100),
      tauxAbsence: Math.round((totalAbsences / totalRecords) * 100),
      tauxRetard: Math.round((totalRetards / totalRecords) * 100),
      auditeursEnAlerte: auditeurs.filter(a => {
        const absences = presences.filter(p => p.auditeurId === a.id && p.statut === "absent").length;
        return absences >= 3;
      }).length
    };
  }, [auditeurs, presences]);

  // Stats par groupe
  const statsParGroupe = useMemo(() => {
    return groupes.map(groupe => {
      const auditeursGroupe = auditeurs.filter(a => a.groupeId === groupe.id);
      const presencesGroupe = presences.filter(p => 
        auditeursGroupe.some(a => a.id === p.auditeurId)
      );
      const presents = presencesGroupe.filter(p => p.statut === "present").length;
      const total = presencesGroupe.length || 1;
      
      return {
        nom: groupe.nom,
        niveau: groupe.niveau,
        effectif: auditeursGroupe.length,
        tauxPresence: Math.round((presents / total) * 100),
        presents,
        absents: presencesGroupe.filter(p => p.statut === "absent").length,
        retards: presencesGroupe.filter(p => p.statut === "retard").length
      };
    }).sort((a, b) => b.tauxPresence - a.tauxPresence);
  }, [groupes, auditeurs, presences]);

  // Stats par jour
  const statsParJour = useMemo(() => {
    return JOURS_PASSAGE.map(jour => {
      const presencesJour = presences.filter(p => p.jour === jour);
      const presents = presencesJour.filter(p => p.statut === "present").length;
      const total = presencesJour.length || 1;
      
      return {
        jour: jour.substring(0, 3),
        jourComplet: jour,
        presents,
        absents: presencesJour.filter(p => p.statut === "absent").length,
        retards: presencesJour.filter(p => p.statut === "retard").length,
        taux: Math.round((presents / total) * 100)
      };
    });
  }, [presences]);

  // Stats par niveau
  const statsParNiveau = useMemo(() => {
    return NIVEAUX_ALPHABETISATION.map(niveau => {
      const groupesNiveau = groupes.filter(g => g.niveau === niveau);
      const auditeursNiveau = auditeurs.filter(a => 
        groupesNiveau.some(g => g.id === a.groupeId)
      );
      const presencesNiveau = presences.filter(p =>
        auditeursNiveau.some(a => a.id === p.auditeurId)
      );
      const presents = presencesNiveau.filter(p => p.statut === "present").length;
      const total = presencesNiveau.length || 1;
      
      return {
        name: niveau,
        value: auditeursNiveau.length,
        taux: Math.round((presents / total) * 100)
      };
    });
  }, [groupes, auditeurs, presences]);

  // Auditeurs avec alertes (3+ absences)
  const auditeursEnAlerte = useMemo(() => {
    return auditeurs
      .map(auditeur => {
        const presencesAuditeur = presences.filter(p => p.auditeurId === auditeur.id);
        const absences = presencesAuditeur.filter(p => p.statut === "absent").length;
        const groupe = groupes.find(g => g.id === auditeur.groupeId);
        return {
          ...auditeur,
          absences,
          groupe: groupe?.nom || "-"
        };
      })
      .filter(a => a.absences >= 3)
      .sort((a, b) => b.absences - a.absences);
  }, [auditeurs, presences, groupes]);

  // Export functions (simulation)
  const handleExportPDF = () => {
    alert("Export PDF en cours de preparation...\n\nFonctionnalite complete necessiterait une bibliotheque PDF comme jspdf ou react-pdf.");
  };

  const handleExportExcel = () => {
    // Simple CSV export
    const csvContent = [
      ["Groupe", "Niveau", "Effectif", "Taux Presence", "Presents", "Absents", "Retards"],
      ...statsParGroupe.map(g => [g.nom, g.niveau, g.effectif, `${g.tauxPresence}%`, g.presents, g.absents, g.retards])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `rapport_presences_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rapports</h1>
          <p className="text-muted-foreground">
            Statistiques et analyses des presences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Stats principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux de Presence</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.tauxPresence}%</div>
            <Progress value={stats.tauxPresence} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux d&apos;Absence</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.tauxAbsence}%</div>
            <Progress value={stats.tauxAbsence} className="mt-2 [&>div]:bg-destructive" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux de Retard</CardTitle>
            <Calendar className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.tauxRetard}%</div>
            <Progress value={stats.tauxRetard} className="mt-2 [&>div]:bg-accent" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertes Absences</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.auditeursEnAlerte}</div>
            <p className="text-xs text-muted-foreground mt-1">
              auditeurs avec 3+ absences
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="groupes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="groupes">Par Groupe</TabsTrigger>
          <TabsTrigger value="jours">Par Jour</TabsTrigger>
          <TabsTrigger value="niveaux">Par Niveau</TabsTrigger>
          <TabsTrigger value="alertes">Alertes</TabsTrigger>
        </TabsList>

        <TabsContent value="groupes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance par Groupe</CardTitle>
              <CardDescription>Taux de presence par groupe de formation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsParGroupe} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} unit="%" />
                    <YAxis type="category" dataKey="nom" width={90} />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, "Taux"]}
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    />
                    <Bar dataKey="tauxPresence" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {statsParGroupe.slice(0, 6).map((groupe, index) => (
              <Card key={groupe.nom}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{groupe.nom}</CardTitle>
                    <Badge variant={groupe.tauxPresence >= 80 ? "default" : groupe.tauxPresence >= 60 ? "secondary" : "destructive"}>
                      {groupe.tauxPresence}%
                    </Badge>
                  </div>
                  <CardDescription>{groupe.niveau} - {groupe.effectif} auditeurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      {groupe.presents} presents
                    </span>
                    <span className="flex items-center gap-1 text-destructive">
                      {groupe.absents} absents
                    </span>
                    <span className="flex items-center gap-1 text-accent">
                      {groupe.retards} retards
                    </span>
                  </div>
                  <Progress value={groupe.tauxPresence} className="mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendances par Jour</CardTitle>
              <CardDescription>Evolution des presences au cours de la semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={statsParJour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="jour" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                    <Legend />
                    <Line type="monotone" dataKey="presents" name="Presents" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                    <Line type="monotone" dataKey="absents" name="Absents" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                    <Line type="monotone" dataKey="retards" name="Retards" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-5">
            {statsParJour.map((jour) => (
              <Card key={jour.jour}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-center text-base">{jour.jourComplet}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-primary">{jour.taux}%</div>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <div>{jour.presents} presents</div>
                    <div>{jour.absents} absents</div>
                    <div>{jour.retards} retards</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="niveaux" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Repartition par Niveau</CardTitle>
                <CardDescription>Nombre d&apos;auditeurs par niveau</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statsParNiveau}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statsParNiveau.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taux de Presence par Niveau</CardTitle>
                <CardDescription>Performance de chaque niveau</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statsParNiveau}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} unit="%" />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, "Taux"]}
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                      />
                      <Bar dataKey="taux" fill="hsl(var(--chart-1))">
                        {statsParNiveau.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alertes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Auditeurs en Alerte
              </CardTitle>
              <CardDescription>
                Auditeurs ayant cumule 3 absences ou plus (necessite convocation)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {auditeursEnAlerte.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p>Aucun auditeur en situation d&apos;alerte</p>
                  <p className="text-sm">Tous les auditeurs ont moins de 3 absences</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditeursEnAlerte.map((auditeur) => (
                    <div
                      key={auditeur.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-destructive/5"
                    >
                      <div>
                        <p className="font-medium">{auditeur.nom} {auditeur.prenom}</p>
                        <p className="text-sm text-muted-foreground">
                          {auditeur.groupe} - Matricule: {auditeur.matricule}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive" className="text-lg px-3 py-1">
                          {auditeur.absences} absences
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Convocation requise
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
