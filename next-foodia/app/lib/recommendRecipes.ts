export const recommendedRecipes = [
  {
    id: "rec-1",
    title: "Spaghetti alla Carbonara",
    description:
      "Clásico plato italiano de pasta con huevo, queso, panceta y pimienta.",
    cookingTime: 25,
    difficulty: "Fácil",
    costLevel: "Moderado",
    cuisine: "Italiana",
    nutritionalInfo: {
      calories: 550,
      protein: 20,
      fat: 22,
      carbs: 65,
    },
    ingredients: [
      {
        name: "Spaghetti",
        quantity: 400,
        unit: "g",
      },
      {
        name: "Panceta",
        quantity: 150,
        unit: "g",
      },
      {
        name: "Huevos",
        quantity: 4,
        unit: "ud",
      },
      {
        name: "Queso Pecorino Romano",
        quantity: 100,
        unit: "g",
      },
      {
        name: "Pimienta negra",
        quantity: 1,
        unit: "cdta",
      },
    ],
    steps: [
      {
        stepNumber: 1,
        description:
          "Cocinar los spaghetti en agua con sal hasta que estén al dente.",
      },
      {
        stepNumber: 2,
        description:
          "Saltear la panceta en una sartén hasta que esté crujiente.",
      },
      {
        stepNumber: 3,
        description: "Batir los huevos con el queso rallado y la pimienta.",
      },
      {
        stepNumber: 4,
        description:
          "Escurrir la pasta y mezclar rápidamente con la panceta y la mezcla de huevo fuera del fuego.",
      },
    ],
    imageUrl: "https://images.pexels.com/photos/15681166/pexels-photo-15681166.jpeg?auto=compress&cs=tinysrgb&h=350"
  },
  {
    id: "rec-2",
    title: "Sushi de Salmón",
    description:
      "Delicioso sushi japonés con arroz avinagrado y salmón fresco.",
    cookingTime: 60,
    difficulty: "Alta",
    costLevel: "Alto",
    cuisine: "Japonesa",
    nutritionalInfo: {
      calories: 300,
      protein: 18,
      fat: 10,
      carbs: 35,
    },
    ingredients: [
      {
        name: "Arroz para sushi",
        quantity: 250,
        unit: "g",
      },
      {
        name: "Salmón fresco",
        quantity: 200,
        unit: "g",
      },
      {
        name: "Vinagre de arroz",
        quantity: 3,
        unit: "cda",
      },
      {
        name: "Alga nori",
        quantity: 4,
        unit: "ud",
      },
      {
        name: "Azúcar",
        quantity: 1,
        unit: "cda",
      },
    ],
    steps: [
      {
        stepNumber: 1,
        description:
          "Cocinar el arroz y mezclar con vinagre de arroz y azúcar.",
      },
      {
        stepNumber: 2,
        description: "Extender el arroz sobre las hojas de alga nori.",
      },
      {
        stepNumber: 3,
        description: "Colocar tiras de salmón en el centro.",
      },
      {
        stepNumber: 4,
        description: "Enrollar firmemente y cortar en piezas individuales.",
      },
    ],
    imageUrl: "https://images.pexels.com/photos/15681166/pexels-photo-15681166.jpeg?auto=compress&cs=tinysrgb&h=350"
  },
  {
    id: "rec-3",
    title: "Ratatouille",
    description: "Guiso francés de verduras asadas, lleno de color y sabor.",
    cookingTime: 90,
    difficulty: "Media",
    costLevel: "Económico",
    cuisine: "Francesa",
    nutritionalInfo: {
      calories: 180,
      protein: 4,
      fat: 8,
      carbs: 20,
    },
    ingredients: [
      {
        name: "Berenjena",
        quantity: 1,
        unit: "ud",
      },
      {
        name: "Calabacín",
        quantity: 1,
        unit: "ud",
      },
      {
        name: "Pimiento rojo",
        quantity: 1,
        unit: "ud",
      },
      {
        name: "Tomates",
        quantity: 4,
        unit: "ud",
      },
      {
        name: "Cebolla",
        quantity: 1,
        unit: "ud",
      },
    ],
    steps: [
      {
        stepNumber: 1,
        description: "Cortar todas las verduras en rodajas finas.",
      },
      {
        stepNumber: 2,
        description:
          "Saltear la cebolla con un poco de aceite hasta que esté transparente.",
      },
      {
        stepNumber: 3,
        description:
          "En una fuente para horno, colocar las verduras alternando los colores en espiral.",
      },
      {
        stepNumber: 4,
        description:
          "Hornear a 180°C durante 45 minutos hasta que estén tiernas.",
      },
    ],
    imageUrl: "https://images.pexels.com/photos/15681166/pexels-photo-15681166.jpeg?auto=compress&cs=tinysrgb&h=350"
  },
];
