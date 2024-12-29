export type Category =
  | "Citernes d’eau"
  | "Vétérinaire"
  | "Point d’Eau"
  | "Électricité par endroits"
  | "Réseau mobile Orange"
  | "Réseau mobile SFR"
  | "Réseau mobile Bouygues"
  | "Internet Wifi"
  | "Soins"
  | "DAB"
  | "Commerces / Approvisionnement"
  | "Carburant"
  | "Village pas ravitaillé"
  | "Transports"
  | "Misc"
  | "Informations";

export interface CategoryStyle {
  className: string;
  iconName: string;
  color: string;
}

