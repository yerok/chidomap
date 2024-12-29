/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { Feature, FeatureCollection, GeoJsonObject } from 'geojson';
import { Category } from '../types/types';
import { categoryStyles } from '../types/categoryStyles';
import FilterSidebar from './filterSidebar';
// import FilterSidebar from "./FilterSidebar";


const customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="text-align:center;">
            <i class="fas fa-bus" style="font-size: 24px; color: red;"></i>
        </div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
});



const getIcon = (category: Category): { className: string; iconName: string; color: string } => {

    if (category) {
        const { className, iconName, color } = categoryStyles[category] || {};
        return { className, iconName, color }
    } else return categoryStyles['Misc']
};



const createCustomIcon = (feature: Feature) => {

    if (feature.properties && feature.properties.category) {


        const icon = getIcon(feature.properties.category)

        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="text-align:center;">
                <i class="fas ${icon.className}" style="font-size: 24px; color: ${icon.color}"></i>
                </div>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42],
        });

        return customIcon

    }
}



const fetchGeoJSONData = async (): Promise<FeatureCollection> => {
    const response = await fetch('/src/data/mistral.json'); // Remplacez par le chemin de votre fichier
    if (!response.ok) {
        throw new Error('Failed to fetch GeoJSON data');
    }
    const data = await response.json();

    // Validation de base pour s'assurer que les données sont conformes
    if (data.type !== "FeatureCollection" || !Array.isArray(data.features)) {
        throw new Error('Invalid GeoJSON format');
    }

    return data;
};




// const MapComponent = ({ markers }: { markers: { lat: number; lng: number; name: string }[] }) => {
const MapComponent = () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [map, setMap] = useState<L.Map | null>(null);
    const [geojsonData, setGeojsonData] = useState<null | FeatureCollection>(null)
    // const [activeCategory, setActiveCategory] = useState<string>('')
    const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
    // const [filteredCategories, setFilteredCategories] = useState<string[]>(Object.keys(categoryStyles));
    const [filters, setFilters] = useState<Set<string>>(new Set(categories));


    const mapRef = useRef<L.Map | null>(null);

    // Définir les limites de Mayotte
    const mayotteBounds = L.latLngBounds(
        L.latLng(-13.008, 45.018), // Sud-Ouest
        L.latLng(-12.636, 45.320)  // Nord-Est
    );

    // const handleFilterChange = (selectedCategories: string[]) => {
    //     setFilteredCategories(selectedCategories);

    //     if (map) {
    //         map.eachLayer((layer) => {
    //             if (layer instanceof L.Marker && layer.feature?.properties?.category) {
    //                 const category = layer.feature.properties.category;
    //                 if (selectedCategories.includes(category)) {
    //                     layer.addTo(map);
    //                 } else {
    //                     map.removeLayer(layer);
    //                 }
    //             }
    //         });
    //     }
    // };

    const handleFilterChange = (category: string, checked: boolean) => {
        setFilters((prevFilters) => {
            const updatedFilters = new Set(prevFilters);
            if (checked) {
                updatedFilters.add(category);
            } else {
                updatedFilters.delete(category);
            }
            return updatedFilters;
        });
    };


    // const geoJsonLayer = L.geoJSON(geoJsonData, {
    //     filter: filterFeatures,
    //     pointToLayer: (feature, latlng) => L.marker(latlng),
    //   }).addTo(map);

    // Fonction pour mettre à jour le filtre
    // const updateCategory = (map: L.Map, newCategory: string) => {
    const updateCategory = (newCategory: string) => {

        // console.log('cc');

        console.log(filteredCategories);

        const newFilteredCategories = filteredCategories
        newFilteredCategories.push(newCategory)

        setFilteredCategories(newFilteredCategories)
        console.log(filteredCategories);

        // activeCategory = newCategory;
        // setActiveCategory(newCategory)
        // geoJsonLayer.clearLayers();
        // geoJsonLayer.addData(geoJsonData);
        // map.clearLayers();
    };

    const filterControl = L.Control.extend({
        onAdd: (map: L.Map) => {
            const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");

            // Style du conteneur principal
            // container.style.position = "absolute";
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
            toggleButton.innerHTML = "Filtrer ▼"; // Le bouton pour rétracter ou déployer
            toggleButton.style.width = "100%";
            toggleButton.style.padding = "10px";
            toggleButton.style.border = "none";
            toggleButton.style.backgroundColor = "#3cb371"; // Vert pour le bouton
            toggleButton.style.color = "#fff";
            toggleButton.style.fontSize = "14px";
            toggleButton.style.cursor = "pointer";
            toggleButton.style.borderRadius = "8px 8px 0 0"; // Coins arrondis en haut

            // Conteneur du menu de filtres, rétracté par défaut
            const filterMenu = L.DomUtil.create("div", "filter-menu", container);
            filterMenu.style.display = "none"; // Réduit initialement
            filterMenu.style.padding = "10px";
            filterMenu.style.maxHeight = "800px";
            filterMenu.style.overflowY = "auto"; // Ajout du défilement si le contenu est trop long
            filterMenu.style.borderRadius = "0 0 8px 8px"; // Coins arrondis en bas

            // Contenu du menu avec les catégories (checkboxes)
            filterMenu.innerHTML = `
                <div style="font-size: 14px; color: #333; margin-bottom: 10px;">
                    <strong>Filtrer par catégorie</strong>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${categories
                    .map((category) => `
                            <label class="filter-checkbox-label" style="display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox" class="filter-checkbox" data-category="${category}" checked style="width: 18px; height: 18px; cursor: pointer;">
                                <span style="font-size: 14px; color: #333;">${category}</span>
                            </label>
                        `)
                    .join("")}
                </div>
                <div style="margin-top: 10px;">
                    <button id="selectAll" style="width: 100%; padding: 8px; background-color: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer;">Tout cocher</button>
                    <button id="deselectAll" style="width: 100%; padding: 8px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 5px;">Tout décocher</button>
                </div>
            `;

            // Ajoute le menu de filtres au conteneur principal
            container.appendChild(filterMenu);

            // Gère l'événement pour le bouton de toggle
            L.DomEvent.on(toggleButton, "click", () => {
                if (filterMenu.style.display === "none") {
                    filterMenu.style.display = "block";
                    toggleButton.innerHTML = "Filtrer ▲"; // Change le texte quand le menu est déployé
                } else {
                    filterMenu.style.display = "none";
                    toggleButton.innerHTML = "Filtrer ▼"; // Change le texte quand le menu est rétracté
                }
            });

            // Gérer les événements de changement de checkbox
            const checkboxes = filterMenu.querySelectorAll(".filter-checkbox");
            checkboxes.forEach((checkbox) => {
                checkbox.addEventListener("change", (e) => {
                    const category = (e.target as HTMLInputElement).dataset.category;
                    const isChecked = (e.target as HTMLInputElement).checked; // Vérifie si la checkbox est cochée ou non

                    if (category){

                        handleFilterChange(category, isChecked)

                        // const applyFilters = (features: any[]) => {
                        //     return features.filter((feature) => filters.has(feature.properties.category));
                        // };
                        
                        // const data = applyFilters(geojson)
                        // const filteredData = applyFilters(data); // `data` représente vos données géospatiales
                        
                        // Ensuite, vous appliquez les données filtrées à votre couche GeoJSON ou marqueurs
                        L.geoJSON(filteredData, {
                            pointToLayer: (feature, latlng) => {
                                const icon = createCustomIcon(feature); // Assurez-vous que `createCustomIcon` est bien défini
                                return L.marker(latlng, { icon: icon });
                            }
                        }).addTo(map);
                    }
                    // updateCategory(category); // Appliquer les changements aux filtres
                });
            });

            // Gérer l'événement de "tout cocher"
            const selectAllButton = filterMenu.querySelector("#selectAll");
            selectAllButton?.addEventListener("click", () => {
                checkboxes.forEach((checkbox) => {
                    (checkbox as HTMLInputElement).checked = true;
                });
                // updateCategory(); // Applique les filtres
            });

            // Gérer l'événement de "tout décocher"
            const deselectAllButton = filterMenu.querySelector("#deselectAll");
            deselectAllButton?.addEventListener("click", () => {
                checkboxes.forEach((checkbox) => {
                    (checkbox as HTMLInputElement).checked = false;
                });
                // updateCategory(); // Applique les filtres
                
            });

            // Retourne le conteneur
            return container;
        },
    });

    // Ajoute le contrôle à la carte après l'initialisation
    // map.addControl(new filterControl());

    // Ajouter le contrôle à la carte
    // map.addControl(new filterControl());

    // Ajoute le contrôle à la carte
    // map.addControl(new filterControl());

    useEffect(() => {

        // const popup =
        //     `<div>
        //         <h3>${feature.properties.name}</h3>
        //         <p>${feature.properties.description}</p>
        //     </div>
        // `

        const filterFeatures = (feature: Feature) => {

            if (feature.properties) {
                console.log('FILTRE');
                // console.log(filteredCategories.includes(feature.properties.category));

                return !filteredCategories.includes(feature.properties.category);
            } else return false
        };



        const initializeMap = async () => {

            try {

                // Récupérer les données GeoJSON
                const data = await fetchGeoJSONData();
                setGeojsonData(data)

                const map = mapRef.current;

                // Ajouter une couche de tuiles de fond (OpenStreetMap par exemple)

                if (map) {

                    // console.log('cc');


                    // map.eachLayer((layer) => {

                    //     console.log('sal');

                    //     if (layer instanceof L.Marker && layer.feature?.properties?.category) {
                    //       const category = layer.feature.properties.category;

                    //       console.log(category);

                    //       if (filteredCategories.includes(category)) {
                    //         layer.addTo(map);
                    //       } else {
                    //         map.removeLayer(layer);
                    //       }
                    //     }
                    //   });

                    map.addControl(new filterControl({ position: "topright" }));

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);

                    const geoJsonLayer = L.geoJSON(data, {
                        filter: filterFeatures,
                        pointToLayer: (feature, latlng) => {


                            const icon = createCustomIcon(feature)
                            // console.log(icon);


                            if (icon) return L.marker(latlng, { icon: icon })
                            else {
                                return L.marker(latlng)
                            }

                        },


                        onEachFeature: (feature, layer) => {
                            if (feature.properties && feature.properties.name) {
                                // layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
                                layer.bindPopup(`<div>
                                    <h3>${feature.properties.name}</h3>
                                    <p>${feature.properties.description}</p>
                                </div>
                                `);
                            }
                        },
                    });

                    try {

                        // console.log(geoJsonLayer);

                        geoJsonLayer.addTo(map);

                    } catch (error) {
                        console.log(error);

                    }
                }

                // const readableData = data

                // console.log(geoJsonLayer);


                // setGeojsonData(geoJsonLayer); // Stocker les données GeoJSON dans l'état

                // data.features.forEach((elem) => {

                //     if (elem.properties)
                //     if (elem.properties.name && elem.properties.description) {
                // console.log(elem.properties.name);
                // console.log(elem.properties.description);
                // console.log(elem);
                // elem.properties.icon = customIcon
                // }




                // })
                // console.log('data.features');
                // console.log(data.features);



                // Ajouter la couche GeoJSON à la carte
                // L.geoJSON(geojsonData as GeoJSON.GeoJsonObject, {
                //     onEachFeature: (feature, layer) => {
                //         if (feature.properties && feature.properties.popupContent) {
                //             layer.bindPopup(feature.properties.popupContent);
                //         }
                //     }
                // }).addTo(map);
            } catch (error) {
                // console.error('Error initializing the map:', error);
                console.log(L);

                console.error('Error fetching GeoJSON:', error);

            }
        };

        initializeMap();
    }, [filterControl, filteredCategories])


    return (
        // <>
        <div>
            <div style={{ display: "flex" }}>
                {/* <FilterSidebar onFilterChange={handleFilterChange} />
            <div id="map" style={{ width: "100%", height: "100vh" }} /> */}
                <MapContainer
                    ref={mapRef}
                    center={[-12.843, 45.166]} // Centre approximatif de Mayotte
                    zoom={11} // Zoom initial
                    minZoom={11} // Niveau de zoom minimal
                    maxBounds={mayotteBounds} // Limiter les déplacements au périmètre de Mayotte
                    style={{
                        width: '1000px', height: '1000px'

                    }} // Ajuste ces valeurs selon tes besoins
                    maxBoundsViscosity={1.0} // Empêcher complètement de sortir des limites
                >
                    {/* Ajouter la couche de tuiles */}
                    {/* <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    /> */}
                    {/* {geojsonData && (
        <GeoJSON
            data={geojsonData as GeoJsonObject}
            // onEachFeature={(feature, layer) => {
            //     if (feature.properties && feature.properties.popupContent) {
            //         layer.bindPopup(feature.properties.popupContent);
            //     }
            // }}
        />
    )} */}
                    {/* Afficher les marqueurs */}
                    {/* {markers.map((marker, index) => (
  <Marker key={index} position={[marker.lat, marker.lng]}>
    <Popup>{marker.name}</Popup>
  </Marker> */}
                    {/* ))} */}
                </MapContainer>
            </div>
        </div>
        // {/* </> */}


    );
};







export default MapComponent;