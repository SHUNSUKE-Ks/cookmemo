import { useState, useEffect } from 'react';
import type { Recipe } from '../types/recipe';
import INITIAL_RECIPES_JSON from '../assets/recipeJson/recipes.json';

const INITIAL_RECIPES: Recipe[] = INITIAL_RECIPES_JSON as Recipe[];

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cookmemo_recipes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Data Migration: handle old string-based ingredients or old version objects
          const migrated = parsed.map((recipe: any) => {
            if (typeof recipe.ingredients === 'string') {
              return {
                ...recipe,
                ingredients: recipe.ingredients.split('\n').filter(Boolean).map((line: string) => {
                  const [name, amount] = line.split(/[：:]/);
                  const valPart = amount?.match(/^[\d.-]+/)?.[0] || '';
                  const unitPart = amount?.replace(valPart, '').trim() || '';
                  return { name: name?.trim() || line, value: valPart, unit: unitPart };
                })
              };
            }
            if (Array.isArray(recipe.ingredients)) {
              return {
                ...recipe,
                ingredients: recipe.ingredients.map((ing: any) => {
                  if (typeof ing.amount === 'string' && ing.value === undefined) {
                    const valPart = ing.amount.match(/^[\d.-]+/)?.[0] || '';
                    const unitPart = ing.amount.replace(valPart, '').trim() || '';
                    return { name: ing.name, value: valPart, unit: unitPart };
                  }
                  return ing;
                })
              };
            }
            return recipe;
          });
          setRecipes(migrated);
        } else {
          setRecipes(INITIAL_RECIPES);
        }
      } catch (e) {
        console.error("Failed to parse recipes:", e);
        setRecipes(INITIAL_RECIPES);
      }
    } else {
      setRecipes(INITIAL_RECIPES);
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

  const resetRecipes = () => {
    if (window.confirm("全てのレシピを初期状態に戻しますか？（現在の追加・編集内容は失われます）")) {
      setRecipes(INITIAL_RECIPES);
      localStorage.setItem('cookmemo_recipes', JSON.stringify(INITIAL_RECIPES));
    }
  };

  return {
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    resetRecipes,
  };
};
