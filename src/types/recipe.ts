export interface Ingredient {
  name: string;
  value: string; // 数字のみ
  unit: string;  // 単位
}

export interface Recipe {
  id: number;
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
  image: string | null;
  tips?: string[];
  story?: string;
  mood?: string[];
}
