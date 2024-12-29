import axios from 'axios';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';


// URL de votre backend
const API_URL = 'http://127.0.0.1:3000/api';

// Récupérer les données GeoJSON
export const getGeojsonData = async () => {
  try {
    const response = await axios.get(`${API_URL}/geojson`);
    return response.data;
  } catch (error) {
    console.error('Error fetching GeoJSON data:', error);
    throw error;
  }
};

export const sendGeojsonData = async (geojsonData: FeatureCollection<Geometry, GeoJsonProperties>) => {


    console.log(geojsonData);
    
    try {
      const response = await axios.post('http://localhost:3000/api/upload-geojson', geojsonData);
      console.log('Données GeoJSON insérées:', response.data);
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données GeoJSON:', error);
    }
  };
  

// Ajouter un commentaire
export const addComment = async (featureId: string, comment: string) => {
  try {
    const response = await axios.post(`${API_URL}/comments`, {
      featureId,
      comment,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Upvote or downvote
export const voteOnFeature = async (featureId: string, voteType: string) => {
  try {
    const response = await axios.post(`${API_URL}/vote`, {
      featureId,
      voteType, // 'upvote' or 'downvote'
    });
    return response.data;
  } catch (error) {
    console.error('Error voting on feature:', error);
    throw error;
  }
};

