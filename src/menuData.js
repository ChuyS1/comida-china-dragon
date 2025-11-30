// src/menuData.js

// 1. IMPORTAMOS LAS IMÁGENES DESDE LA CARPETA ASSETS
// Asegúrate de que los nombres de archivo coincidan con los que guardaste en src/assets/
// CAMBIO: Se actualizó la extensión a .jpeg según tu indicación.
import mongoliaImg from './assets/mongolia_beef.jpeg';
import brocoliImg from './assets/brocoli.jpeg';
import polloAgridulceImg from './assets/pollo_agridulce.jpeg';
import espaguetiImg from './assets/espagueti_chino.jpeg';
import polloNaranjaImg from './assets/pollo_naranja.jpeg';
import polloAjonjoliImg from './assets/pollo_ajonjoli.jpeg';
import kungPaoImg from './assets/kung_pao_chi.jpeg';
import verdurasImg from './assets/verduras_combinadas.jpeg';
import jalapenoImg from './assets/jalapeno_chicken.jpeg';
import dragonTigerImg from './assets/dragon_tiger.jpeg';
import arrozChinoImg from './assets/arroz_chino.jpeg';
import almendrasImg from './assets/almendras.jpeg';

// 2. USAMOS LAS VARIABLES IMPORTADAS EN LA LISTA
export const menuItems = [
    // --- Primera Columna ---
    { 
        id: 1, 
        name: "Mongolia Beef", 
        price: 150, 
        image: mongoliaImg // Usamos la variable importada
    },
    { 
        id: 2, 
        name: "Brócoli", 
        price: 150, 
        image: brocoliImg 
    },
    { 
        id: 3, 
        name: "Pollo Agridulce", 
        price: 150, 
        image: polloAgridulceImg 
    },
    { 
        id: 4, 
        name: "Espagueti Chino", 
        price: 150, 
        image: espaguetiImg 
    },
    { 
        id: 5, 
        name: "Pollo a la naranja con ajonjolí", 
        price: 150, 
        image: polloNaranjaImg 
    },
    { 
        id: 6, 
        name: "Pollo al ajonjolí", 
        price: 150, 
        image: polloAjonjoliImg 
    },
    
    // --- Segunda Columna ---
    { 
        id: 7, 
        name: "Kung Pao Chi", 
        price: 150, 
        image: kungPaoImg 
    },
    { 
        id: 8, 
        name: "Verduras Combinadas", 
        price: 150, 
        image: verdurasImg 
    },
    { 
        id: 9, 
        name: "Jalapeño Chicken con Arroz Combinado", 
        price: 150, 
        image: jalapenoImg 
    },
    { 
        id: 10, 
        name: "Dragon Tiger Fight", 
        price: 150, 
        image: dragonTigerImg 
    },
    { 
        id: 11, 
        name: "Arroz Chino", 
        price: 150, 
        image: arrozChinoImg 
    },
    { 
        id: 12, 
        name: "Almendras", 
        price: 150, 
        image: almendrasImg 
    },
];