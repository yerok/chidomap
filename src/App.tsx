/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import MapComponent from './components/MapComponent';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { useQuery } from '@tanstack/react-query';
// import { fetchMarkers } from './api/fetchMarkers';
import axios from 'axios';
import NewMapComponent from './components/NewMapComponent';


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

  
  return (

  <>
  <NewMapComponent/>;
  {/* <MapComponent/>; */}
  </>
  )

};

export default App
