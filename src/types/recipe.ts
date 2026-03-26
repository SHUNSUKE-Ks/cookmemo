export interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  steps: string[];
  tags: string[];
  image: string | null;
}
