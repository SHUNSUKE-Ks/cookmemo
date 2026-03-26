import { useState, useEffect } from 'react';
import type { Recipe } from '../types/recipe';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cookmemo_recipes');
    if (saved) {
      try {
        setRecipes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recipes:", e);
      }
    }
  }, []);

  // Save to LocalStorage whenever recipes change
  useEffect(() => {
    localStorage.setItem('cookmemo_recipes', JSON.stringify(recipes));
  }, [recipes]);

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now(),
    };
    setRecipes((prev) => [newRecipe, ...prev]);
  };

  const updateRecipe = (id: number, updatedData: Partial<Recipe>) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
    );
  };

  const deleteRecipe = (id: number) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  return {
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  };
};
