import { Category, CategoryStyle } from "./types";

export const categoryStyles: Record<Category, CategoryStyle> = {
      "Citernes d'eau": {
        // className: "fa-faucet-drip",
        className: "fa-faucet-drip",
        iconName: "faucet-drip",
        color: "#3498db", // Bleu
      },
      "Vétérinaire": {
        className: "fa-paw",
        iconName: "paw",
        color: "#2ecc71", // Vert
      },
      "Point d'eau": {
        className: "fa-droplet",
        iconName: "droplet",
        color: "#5dade2", // Bleu clair
      },
      "Électricité par endroits": {
        className: "fa-bolt",
        iconName: "bolt",
        color: "#f1c40f", // Jaune
      },
      "Réseau mobile Orange": {
        className: "fa-signal",
        iconName: "signal",
        color: "#ffa500", // Orange
      },
      "Réseau mobile SFR": {
        className: "fa-signal",
        iconName: "signal",
        color: "#e74c3c", // Rouge
      },
      "Réseau mobile Bouygues": {
        className: "fa-signal",
        iconName: "signal",
        color: "#3498db", // Bleu
      },
      "Internet Wifi": {
        className: "fa-wifi",
        iconName: "wifi",
        color: "#8e44ad", // Violet
      },
      "Soins": {
        className: "fa-briefcase-medical",
        iconName: "briefcase-medical",
        color: "#e74c3c", // Rouge
      },
      "DAB": {
        className: "fa-credit-card",
        iconName: "credit-card",
        color: "#2980b9", // Bleu foncé
      },
      "Commerces / Approvisionnement": {
        className: "fa-store",
        iconName: "store",
        color: "#27ae60", // Vert
      },
      "Carburant": {
        className: "fa-gas-pump",
        iconName: "gas-pump",
        color: "#d35400", // Orange foncé
      },
      "Village pas ravitaillé": {
        className: "fa-exclamation-triangle",
        iconName: "exclamation-triangle",
        color: "#c0392b", // Rouge sombre
      },
      "Transports": {
        className: "fa-bus",
        iconName: "bus",
        color: "#16a085", // Turquoise
      },
      "Informations": {
        className: "fa-info-circle",
        iconName: "info-circle",
        color: "#2980b9", // Bleu
      },
      "Misc": {
        className: "",
        iconName: "",
        color: "", // Bleu
      },
    };