export type ClassicProduct = {
  id: string;
  name: string;
  description: string;
  badge?: string;
  flavors: string[];
  imagePosition: string;
};

export type CustomFlavor = {
  id: string;
  name: string;
  description: string;
  imagePosition: string;
};

export type SizeOption = {
  id: string;
  name: string;
  price: number;
  maxFlavors: number;
};

export const sizeOptions: SizeOption[] = [
  {
    id: "500ml",
    name: "500 ml",
    price: 23,
    maxFlavors: 2
  },
  {
    id: "1l",
    name: "1 litro",
    price: 38,
    maxFlavors: 3
  }
];

export const classicProducts: ClassicProduct[] = [
  {
    id: "classico-leite-em-po",
    name: "Leite em pó",
    description:
      "Creme de leite em pó. Delicada, cremosa e irresistível.",
    badge: "Favorito da casa",
    flavors: ["Leite em pó"],
    imagePosition: "50% 42%"
  },
  {
    id: "classico-avela",
    name: "Avelã",
    description: "Creme de avelã. Intensa, cremosa e marcante.",
    flavors: ["Avelã"],
    imagePosition: "42% 45%"
  },
  {
    id: "classico-kinder-bueno",
    name: "Kinder Bueno",
    description:
      "Chocolate, creme de avelã e uma combinação delicada.",
    flavors: ["Kinder Bueno"],
    imagePosition: "55% 50%"
  },
  {
    id: "classico-ovomaltine",
    name: "Ovomaltine",
    description: "Creme de chocolate com flocos crocantes.",
    flavors: ["Ovomaltine"],
    imagePosition: "48% 44%"
  }
];

export const customFlavors: CustomFlavor[] = [
  {
    id: "leite-em-po",
    name: "Leite em pó",
    description: "Delicado, cremoso e suave.",
    imagePosition: "50% 42%"
  },
  {
    id: "avela",
    name: "Avelã",
    description: "Cremoso, intenso e marcante.",
    imagePosition: "42% 45%"
  },
  {
    id: "kinder-bueno",
    name: "Kinder Bueno",
    description: "Chocolate com creme de avelã.",
    imagePosition: "55% 50%"
  },
  {
    id: "ovomaltine",
    name: "Ovomaltine",
    description: "Creme de chocolate com flocos crocantes.",
    imagePosition: "48% 44%"
  }
];
