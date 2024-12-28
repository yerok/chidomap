import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { FeatureCollection, GeoJsonObject } from 'geojson';
// import { AwesomeMarkers } from 'leaflet';

// interface GeoJSONFeature {
//     type: string;
//     properties: {
//         name?: string;
//         popupContent?: string;
//     };
//     geometry: {
//         type: string;
//         coordinates: number[];
//     };
// }

// interface GeoJSONData {
//     type: string;
//     features: GeoJSONFeature[];
// }

// const customIcon = L.AwesomeMarkers.icon({
//     icon: 'coffee', // Nom de l'icône Font Awesome
//     markerColor: 'red', // Couleur du marqueur (red, blue, green, etc.)
//     prefix: 'fa', // Préfixe pour Font Awesome (fa pour Font Awesome)
//     iconColor: 'white', // Couleur de l'icône
//   });

const customIcon = L.divIcon({
className: 'custom-div-icon',
html: `<div style="text-align:center;">
            <i class="fas fa-coffee" style="font-size: 24px; color: red;"></i>
        </div>`,
iconSize: [30, 42],
iconAnchor: [15, 42],
});
  

// const icons: { [key: string]: L.Icon } = {
//     restaurant: L.icon({ iconUrl: '/path/to/restaurant-icon.svg', iconSize: [32, 32] }),
//     park: L.icon({ iconUrl: '/path/to/park-icon.svg', iconSize: [32, 32] }),
//     // Ajouter plus d'icônes ici
//   };
  
// const getIcon = (category: string) => icons[category] || icons.default;

const fetchGeoJSONData = async (): Promise<FeatureCollection> => {
    const response = await fetch('/src/data/clone_de_carte_chido_mayotte_officiel.geojson'); // Remplacez par le chemin de votre fichier
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
    const [geojsonData, setGeojsonData] = useState<null | FeatureCollection>(null)

    const mapRef = useRef(null);

    // Définir les limites de Mayotte
    const mayotteBounds = L.latLngBounds(
        L.latLng(-13.008, 45.018), // Sud-Ouest
        L.latLng(-12.636, 45.320)  // Nord-Est
    );

    useEffect(() => {

        const initializeMap = async () => {

            try {
                // Initialiser la carte Leaflet
                // const map = L.map('map').setView([-12.8, 45.15], 10);

                // Ajouter une couche de tuiles de fond (OpenStreetMap par exemple)
                // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                // }).addTo(map);

                // Récupérer les données GeoJSON
                const data = await fetchGeoJSONData();
                // setGeojsonData(data); // Stocker les données GeoJSON dans l'état

                // console.log(data);
                const map = mapRef.current;

                if (map) {

                    const geoJsonLayer = L.geoJSON(data, {
                        pointToLayer: (feature, latlng) => {
                          return L.marker(latlng, { icon: customIcon });
                        },
                        onEachFeature: (feature, layer) => {
                          if (feature.properties && feature.properties.name) {
                            layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
                          }
                        },
                      });

                      geoJsonLayer.addTo(map);
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
                console.error('Error fetching GeoJSON:', error);

            }
        };

        initializeMap();
    })


    return (
        <MapContainer
            ref={mapRef}
            center={[-12.843, 45.166]} // Centre approximatif de Mayotte
            zoom={11}                  // Zoom initial
            minZoom={11} // Niveau de zoom minimal
            maxBounds={mayotteBounds}  // Limiter les déplacements au périmètre de Mayotte
            style={{ width: '1000px', height: '1000px' }} // Ajuste ces valeurs selon tes besoins
            maxBoundsViscosity={1.0}   // Empêcher complètement de sortir des limites
        >
            {/* Ajouter la couche de tuiles */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {geojsonData && (
                <GeoJSON
                    data={geojsonData as GeoJsonObject}
                    // onEachFeature={(feature, layer) => {
                    //     if (feature.properties && feature.properties.popupContent) {
                    //         layer.bindPopup(feature.properties.popupContent);
                    //     }
                    // }}
                />
            )}
            {/* Afficher les marqueurs */}
            {/* {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]}>
            <Popup>{marker.name}</Popup>
          </Marker> */}
             {/* ))} */}
        </MapContainer>
    );
};







export default MapComponent;