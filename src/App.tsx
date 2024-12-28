/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import MapComponent from './components/MapComponent';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { useQuery } from '@tanstack/react-query';
// import { fetchMarkers } from './api/fetchMarkers';
import axios from 'axios';


const App = () => {
  
  // interface Filters {
  //   type: string;
  //   radius: number;
  // }
  
  interface Marker {
    id: number;
    name: string;
    lat: number;
    lng: number;
  }

  const markers: Marker[] = []

  // const fetchMarkers = async (filters: Filters): Promise<Marker[]> => {
  //   const response = await axios.get('/api/markers', { params: filters });
  //   return response.data;
  // };
  
  // const filters = useSelector((state: RootState) => state.filters);
  // const { data: markers, isLoading } = useQuery(['markers', filters], () => fetchMarkers(filters));

  // if (isLoading) return <p>Loading...</p>;


  
  return (

  <>
  {/* <MapComponent markers={markers || []} />; */}
  <MapComponent/>;
  </>
  )

};

export default App
