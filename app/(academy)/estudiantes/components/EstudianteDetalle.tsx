"use client";

import { Estudiante } from "@/types/estudiante.interface";
import { MapPin, User, Users, UserCircle } from "lucide-react";
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

const SEXO_COLORS: Record<number, string> = {
  1: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  2: "bg-pink-100 text-pink-700 hover:bg-pink-100",
};

const ETNIAS: Record<number, string> = {
  1: "Mestizo",
  2: "Sumo",
  3: "Mayagna",
  4: "Garifuna",
  5: "Otro",
};

const ETNIA_COLORS: Record<number, string> = {
  1: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  2: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  3: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  4: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  5: "bg-gray-100 text-gray-700 hover:bg-gray-100",
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
            <AvatarFallback className="bg-gray-200">
              <UserCircle className="h-14 w-14 text-gray-400" />
            </AvatarFallback>
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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
              <MapPin className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Direccion</p>
              <p className="text-sm font-medium">{estudiante.direccion}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sexo</p>
              <Badge className={SEXO_COLORS[estudiante.sexo_id] || "bg-gray-100 text-gray-700"}>
                {SEXOS[estudiante.sexo_id] || estudiante.sexo_id}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
              <Users className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Etnia</p>
              <Badge className={ETNIA_COLORS[estudiante.etnia_id] || "bg-gray-100 text-gray-700"}>
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
