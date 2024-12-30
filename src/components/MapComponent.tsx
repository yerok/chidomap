/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { Category } from '../types/types';
import { categoryStyles } from '../types/categoryStyles';
import { useDispatch, useSelector } from 'react-redux';
import { setAllCategories, setNoCategories, toggleCategoryFilter } from '../store/slices/filtersSlice';
import { RootState } from "../store"; // Chemin vers le store
import { downVote, getGeojsonData, sendGeojsonData, upVote } from '../api/geojsonApi';
import FeaturePopup from './PopUpComponent';
import { createRoot } from 'react-dom/client';
import { filterControl } from './filterControl'
import 'leaflet.markercluster';



const MapComponent = () => {

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
                html: `
                <div style="
                    position: relative;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%; /* Cercle */
                    background-color: white; /* Couleur de fond */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Ombre */
                    border: 2px solid white; /* Bordure blanche */
                ">
                    <i class="fas ${icon.className}" 
                       style="
                           font-size: 18px; 
                           color: ${icon.color}; /* Couleur de l'icône */
                       ">
                    </i>
                </div>`,
                iconSize: [40, 40], // Taille globale de l'icône
                iconAnchor: [20, 40], // Ancrage de l'icône (pointe en bas)
            });

            return customIcon;
        };
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

    const baseMaps = {
        "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }),
        "Satellite": L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.fr/">OpenStreetMap France</a> contributors',
        }),
        "Topographic": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a> contributors',
        }),
        "Dark Mode": L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> contributors',
        }),
    };


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [geojsonData, setGeojsonData] = useState<null | FeatureCollection>(null)
    const selectedCategories = useSelector((state: RootState) => state.filters.selectedCategories);

    const geojsonLayerRef = useRef<L.GeoJSON<GeoJsonProperties, Geometry> | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const filterRef = useRef<L.Control | null>(null);

    const dispatch = useDispatch();


    // Définir les limites de Mayotte
    const mayotteBounds = L.latLngBounds(
        L.latLng(-13.008, 45.018), // Sud-Ouest
        L.latLng(-12.636, 45.320)  // Nord-Est
    );


    const handleFilterChange = (category: string) => {
        dispatch(toggleCategoryFilter(category));
    };

    const handleSetAllCategories = () => {
        dispatch(setAllCategories());
    };


    const handleSetNoCategories = () => {
        dispatch(setNoCategories());
    };


    useEffect(() => {

        const fetchData = async () => {

            if (!geojsonData) {

                let data = await getGeojsonData()

                if (data.features.length == 0) {
                    data = await fetchGeoJSONData();
                    sendGeojsonData(data)
                }
                setGeojsonData(data) // Déclenchera un nouveau rendu
            }
        };
        fetchData()
    }, [])




    useEffect(() => {

        const map = mapRef.current;

        if (!geojsonData || !map) return;

        const filterFeatures = (feature: Feature) => {

            if (feature.properties) {
                return !selectedCategories.includes(feature.properties.category);
            } else return false
        };

        const initializeMap = async () => {

            if (!filterRef.current) {

                const filterFunc = filterControl(map, handleFilterChange, handleSetAllCategories, handleSetNoCategories)
                const filter = new filterFunc
                filterRef.current = filter

                map.addControl(filter);
                L.control.layers(baseMaps).addTo(map);
                console.log('create');

                // Par défaut OSM
                baseMaps['OpenStreetMap'].addTo(map)
            }
            try {

                if (geojsonLayerRef.current) {
                    geojsonLayerRef.current.remove();
                }

                // const markers = L.markerClusterGroup()
                const markers = L.markerClusterGroup({
                    maxClusterRadius: 50, // Réduit le rayon pour que moins de marqueurs soient regroupés
                    iconCreateFunction: (cluster) => {
                        const count = cluster.getChildCount();
                        return L.divIcon({
                            html: `<div style="background-color: rgba(51, 136, 255, 0.8); border-radius: 50%; padding: 5px 10px; color: white;">${count}</div>`,
                            className: 'custom-cluster-icon',
                            iconSize: L.point(40, 40),
                        });
                    },
                });

                const geoJsonLayer = L.geoJSON(geojsonData, {
                    filter: filterFeatures,
                    pointToLayer: (feature, latlng) => {


                        const icon = createCustomIcon(feature);

                        const marker = icon
                            ? L.marker(latlng, { icon })
                            : L.marker(latlng);

                        markers.addLayer(marker);
                        return marker
                    },
                    onEachFeature: (feature, layer) => {
                        if (feature.properties && feature.properties.name && layer) {

                            const updatePopup = () => {

                                const container = document.createElement('div'); // Conteneur pour le composant React
                                const root = createRoot(container!); // Assurez-vous que container n'est pas null

                                root.render(
                                    <FeaturePopup feature={feature} onUpvote={upVote} onDownvote={downVote} />,
                                );

                                // Attacher la popup à la layer
                                layer.bindPopup(container);
                            }


                            updatePopup()
                        }
                    }
                }
                )

                try {

                    console.log('markers');
                    console.log(markers);

                    geoJsonLayer.addTo(map);
                    geojsonLayerRef.current = geoJsonLayer;
                    // map.addLayer(markers)
                    // markers.addTo(map)
                } catch (error) {
                    console.log(error);

                }

            } catch (error) {
                console.error('Error initializing the map:', error);
            }
        };
        initializeMap();

    }, [geojsonData, selectedCategories])


    return (
        <div>
            <div style={{ display: "flex" }}>
                <MapContainer
                    ref={mapRef}
                    center={[-12.843, 45.166]} // Centre approximatif de Mayotte
                    zoom={11} // Zoom initial
                    minZoom={11} // Niveau de zoom minimal
                    maxBounds={mayotteBounds} // Limiter les déplacements au périmètre de Mayotte
                    style={{
                        width: '1000px', height: '1000px'
                    }}
                    maxBoundsViscosity={1.0} // Empêcher complètement de sortir des limites
                >
                    {/* Ajouter la couche de tuiles */}
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                </MapContainer>
            </div>
        </div>
    );
};







export default MapComponent;