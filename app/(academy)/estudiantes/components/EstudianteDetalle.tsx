"use client";

import { Estudiante } from "@/types/estudiante.interface";
import { MapPin, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SEXOS: Record<number, string> = {
  1: "Masculino",
  2: "Femenino",
};

const ETNIAS: Record<number, string> = {
  1: "Mestizo",
  2: "Indigena",
  3: "Afroecuatoriano",
  4: "Montubio",
  5: "Blanco",
  6: "Otro",
};

type Props = {
  estudiante: Estudiante | null;
  avatarUrl: string | null;
  onClose: () => void;
};

export default function EstudianteDetalle({
  estudiante,
  avatarUrl,
  onClose,
}: Props) {
  if (!estudiante) return null;

  const initials = `${estudiante.nombres.charAt(0)}${estudiante.paterno.charAt(0)}`.toUpperCase();

  return (
    <Dialog open={!!estudiante} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle del Estudiante</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-24 w-24">
            {avatarUrl && (
              <AvatarImage src={avatarUrl} alt={estudiante.nombres} />
            )}
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h3 className="text-xl font-semibold">
              {estudiante.nombres} {estudiante.paterno}
            </h3>
            {estudiante.materno && (
              <p className="text-sm text-muted-foreground">
                {estudiante.materno}
              </p>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Direccion</p>
              <p className="text-sm font-medium">{estudiante.direccion}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sexo</p>
              <Badge variant="secondary">
                {SEXOS[estudiante.sexo_id] || estudiante.sexo_id}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Etnia</p>
              <Badge variant="outline">
                {ETNIAS[estudiante.etnia_id] || estudiante.etnia_id}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
