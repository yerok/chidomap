/**
 * Parcourt un objet JSON et remplace toutes les sortes d'apostrophes par l'apostrophe standard '
 * @param jsonObject - L'objet JSON à parcourir.
 * @returns Le nouvel objet JSON avec les apostrophes remplacées.
 */
export function normalizeApostrophes(jsonObject: any): any {
    /**
     * Remplace les différentes variantes d'apostrophes par l'apostrophe standard.
     * @param str - La chaîne de caractères à traiter.
     * @returns La chaîne avec les apostrophes remplacées.
     */
    const replaceApostrophes = (str: string): string => {
      return str.replace(/[`‘’‛´]/g, "'");
    };
  
    /**
     * Fonction récursive pour parcourir et transformer les objets et tableaux JSON.
     * @param obj - La valeur à parcourir (objet, tableau ou primitive).
     * @returns La valeur transformée.
     */
    const traverse = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(traverse); // Si c'est un tableau, traite chaque élément.
      } else if (obj !== null && typeof obj === "object") {
        const newObj: Record<string, any> = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = traverse(obj[key]); // Traite chaque propriété.
          }
        }
        return newObj;
      } else if (typeof obj === "string") {
        return replaceApostrophes(obj); // Traite les chaînes.
      }
      return obj; // Retourne les autres types de valeurs sans modification.
    };
  
    return traverse(jsonObject);
  }

  
/**
 * Compte les occurrences des différentes valeurs d'un champ dans un fichier JSON.
 * @param jsonObject - L'objet JSON à parcourir.
 * @param field - Le champ dont les valeurs doivent être comptées.
 * @returns Un objet contenant les valeurs uniques du champ et leurs occurrences.
 */
export function countFieldOccurrences(jsonObject: any, field: string): Record<string, number> {
    const occurrences: Record<string, number> = {};
  
    /**
     * Fonction récursive pour parcourir l'objet JSON.
     * @param obj - La valeur actuelle (objet, tableau ou autre).
     */
    const traverse = (obj: any): void => {
      if (Array.isArray(obj)) {
        obj.forEach(traverse); // Parcourt chaque élément du tableau.
      } else if (obj !== null && typeof obj === "object") {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (key === field && typeof obj[key] === "string") {
              const value = obj[key];
              occurrences[value] = (occurrences[value] || 0) + 1; // Incrémente le compteur pour cette valeur.
            }
            traverse(obj[key]); // Parcourt récursivement les sous-propriétés.
          }
        }
      }
    };
  
    traverse(jsonObject);
    return occurrences;
  }
  
