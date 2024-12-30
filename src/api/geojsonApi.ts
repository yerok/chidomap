import axios from 'axios';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';


// URL de votre backend
const API_URL = 'http://127.0.0.1:3000/api';

// Récupérer les données GeoJSON
export const getGeojsonData = async () => {
  try {
    const response = await axios.get(`${API_URL}/geojson/get-geojson`);
    return response.data;
  } catch (error) {
    console.error('Error fetching GeoJSON data:', error);
    throw error;
  }
};

export const sendGeojsonData = async (geojsonData: FeatureCollection<Geometry, GeoJsonProperties>) => {


    console.log(geojsonData);
    
    try {
      const response = await axios.post('http://localhost:3000/api/geojson/upload-geojson', geojsonData);
      console.log('Données GeoJSON insérées:', response.data);
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données GeoJSON:', error);
    }
  };
  

export const upVote = async (id: string) => {
    try {
        
        const response = await fetch(`${API_URL}/features/${id}/upvote`, { method: "POST" });
        if (response.ok) {
            const data = await response.json();
            return data.properties.upvotes
        }
    } catch (error) {
        console.error("Erreur lors de l'upvote :", error);
    }
  };

  export const downVote = async (id: string) => {
    try {
        
        const response = await fetch(`${API_URL}/features/${id}/downvote`, { method: "POST" });
        if (response.ok) {
            const data = await response.json();
            return data.properties.downvotes
        }
    } catch (error) {
        console.error("Erreur lors du downvote :", error);
    }
  };
