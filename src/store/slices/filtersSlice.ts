import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    type: 'all', // Filtrer par type d'élément (restaurants, stations, etc.)
    radius: 5000, // Rayon en mètres
  },
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
    setRadius: (state, action) => {
      state.radius = action.payload;
    },
  },
});

export const { setType, setRadius } = filtersSlice.actions;
export default filtersSlice.reducer;