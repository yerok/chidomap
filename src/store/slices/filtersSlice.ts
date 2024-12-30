// filterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const categories = [
    "Citernes d'eau",
    "Vétérinaire",
    "Point d'eau",
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

interface FilterState {
  selectedCategories: string[];
}

const initialState: FilterState = {
  selectedCategories: [],
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    toggleCategoryFilter: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      if (state.selectedCategories.includes(category)) {
        state.selectedCategories = state.selectedCategories.filter(c => c !== category);
      } else {
        state.selectedCategories.push(category);
      }
    },
    setAllCategories: (state) => {
      state.selectedCategories = [];
    },
    setNoCategories: (state) => {
      state.selectedCategories = categories
      
    }
  },
});

export const { toggleCategoryFilter, setAllCategories, setNoCategories } = filterSlice.actions;
export default filterSlice.reducer;