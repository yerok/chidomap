import React, { useState } from "react";
import { Checkbox, FormControlLabel, FormGroup, Typography, Drawer, Button } from "@mui/material";

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

const FilterSidebar = ({ onFilterChange }: { onFilterChange: (selected: string[]) => void }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleToggle = (category: string) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newSelectedCategories);
    onFilterChange(newSelectedCategories);
  };

  return (
    <div>
      <Button variant="contained" onClick={() => setDrawerOpen(true)}>
        Filtres
      </Button>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          style: { width: 300, padding: 16 },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Filtres
        </Typography>
        <FormGroup>
          {categories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleToggle(category)}
                />
              }
              label={category}
            />
          ))}
        </FormGroup>
        <Button variant="outlined" onClick={() => setDrawerOpen(false)}>
          Fermer
        </Button>
      </Drawer>
    </div>
  );
};

export default FilterSidebar;