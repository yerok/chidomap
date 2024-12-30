import L from "leaflet";

const categories = [
    "Citernes d’eau",
    "Vétérinaire",
    "Point d’Eau",
    "Électricité par endroits",
    "Réseau mobile Orange",
    "Réseau mobile SFR",
    "Réseau mobile Bouygues",
    "Internet Wifi",
    "Soins",
    "DAB",
    "Commerces / Approvisionnement",
    "Carburant",
    "Village pas ravitaillé",
    "Transports",
    "Informations",
];


export const filterControl = (map : L.Map, handleFilterChange: { (category: string): void; (arg0: string): void; }, setAllCategories: () => void, setNoCategories: () => void) => {

    const control = L.Control.extend({
    onAdd: (map: L.Map) => {
        const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");

        // Style du conteneur principal
        container.style.top = "10px";
        container.style.left = "10px";
        container.style.zIndex = "1000";
        container.style.backgroundColor = "#fff";
        container.style.borderRadius = "8px";
        container.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.1)";
        container.style.padding = "10px";
        container.style.cursor = "pointer";

        // Bouton pour rétracter ou déployer le menu
        const toggleButton = L.DomUtil.create("button", "toggle-button", container);
        toggleButton.innerHTML = "Filtrer ▼";
        toggleButton.style.width = "100%";
        toggleButton.style.padding = "10px";
        toggleButton.style.border = "none";
        toggleButton.style.backgroundColor = "#3cb371";
        toggleButton.style.color = "#fff";
        toggleButton.style.fontSize = "14px";
        toggleButton.style.cursor = "pointer";
        toggleButton.style.borderRadius = "8px 8px 0 0";

        // Conteneur du menu de filtres, rétracté par défaut
        const filterMenu = L.DomUtil.create("div", "filter-menu", container);
        filterMenu.style.display = "none";
        filterMenu.style.padding = "10px";
        filterMenu.style.maxHeight = "800px";
        filterMenu.style.overflowY = "auto";
        filterMenu.style.borderRadius = "0 0 8px 8px";

        // Contenu du menu avec les catégories (checkboxes)
        filterMenu.innerHTML = `
          <div style="font-size: 14px; color: #333; margin-bottom: 10px;">
            <strong>Filtrer par catégorie</strong>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${categories
                .map(
                    (category) => `
              <label class="filter-checkbox-label" style="display: flex; align-items: center; gap: 5px;">
                <input type="checkbox" class="filter-checkbox" data-category="${category}" checked style="width: 18px; height: 18px; cursor: pointer;">
                <span style="font-size: 14px; color: #333;">${category}</span>
              </label>`
                )
                .join("")}
          </div>
          <div style="margin-top: 10px;">
            <button id="selectAll" style="width: 100%; padding: 8px; background-color: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer;">Tout cocher</button>
            <button id="deselectAll" style="width: 100%; padding: 8px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 5px;">Tout décocher</button>
          </div>
        `;

        container.appendChild(filterMenu);

        // Gère l'événement pour le bouton de toggle
        L.DomEvent.on(toggleButton, "click", () => {
            if (filterMenu.style.display === "none") {
                filterMenu.style.display = "block";
                toggleButton.innerHTML = "Filtrer ▲";
            } else {
                filterMenu.style.display = "none";
                toggleButton.innerHTML = "Filtrer ▼";
            }
        });

        // Gérer les événements de changement de checkbox
        const checkboxes = filterMenu.querySelectorAll(".filter-checkbox");
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", (e) => {
                const category = (e.target as HTMLInputElement).dataset.category;
                if (category) {
                    handleFilterChange(category);
                }
            });
        });

        // Gérer l'événement de "tout cocher"
        const selectAllButton = filterMenu.querySelector("#selectAll");
        selectAllButton?.addEventListener("click", () => {
            checkboxes.forEach((checkbox) => {
                (checkbox as HTMLInputElement).checked = true;
            });
            setAllCategories()
        });

        // Gérer l'événement de "tout décocher"
        const deselectAllButton = filterMenu.querySelector("#deselectAll");
        deselectAllButton?.addEventListener("click", () => {
            checkboxes.forEach((checkbox) => {
                (checkbox as HTMLInputElement).checked = false;
            });
            setNoCategories()
        });

        return container;
    }})

    return control
}
