import { useState, useEffect } from 'react';
import type { Recipe } from '../types/recipe';

const INITIAL_RECIPES: Recipe[] = [
  {
    id: 1,
    title: "ライ麦パン（50%・パウンド型）",
    ingredients: "強力粉：150g\nライ麦粉：150g（50%）\n水：180〜200ml\n塩：5g\nドライイースト：3g\n\n※砂糖・バターなし",
    steps: [
      "① こね：全部混ぜて5〜10分軽くこねる（ライ麦はこねすぎNG）",
      "② 一次発酵：60〜90分（25〜28℃）1.5倍くらいまで。膨らみは控えめでOK",
      "③ 成形：軽くまとめて型へ。ベタつくので手に粉をつける",
      "④ 二次発酵：40〜60分。型の8割くらいまで",
      "⑤ 焼成：予熱220℃。最初10分220℃、その後180℃で20〜30分焼く"
    ],
    tags: ["パン", "ライ麦", "ヘルシー", "シンプル"],
    image: null
  }
];

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cookmemo_recipes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecipes(parsed);
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

  return {
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  };
};
