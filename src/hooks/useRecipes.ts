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
  },
  {
    id: 2,
    title: "サラメ・ディ・チョコラータ",
    ingredients: "ビスケット：150g\nココア：30g\n砂糖：80g\nバター：100g\n卵：1個\nナッツ：適量",
    steps: [
      "① ビスケットを砕く",
      "② 材料をすべて混ぜる",
      "③ ラップで棒状に成形",
      "④ 冷蔵庫で冷やし固める"
    ],
    tips: [
      "冷やし時間は2〜3時間",
      "ラム酒を少し入れると大人味"
    ],
    tags: ["チョコ", "冷やすだけ", "簡単", "イタリア"],
    story: "見た目がサラミに似ていることから、子供へのサプライズ菓子として広まった",
    image: null
  },
  {
    id: 3,
    title: "ブルッティ・マ・ブオーニ",
    ingredients: "ヘーゼルナッツ：150g\n砂糖：120g\n卵白：2個",
    steps: [
      "① ナッツを粗く刻む",
      "② 卵白と砂糖でメレンゲを作る",
      "③ ナッツを混ぜる",
      "④ スプーンで落として焼く（160℃で20分前後）"
    ],
    tips: [
      "焼きすぎると固くなる",
      "表面がカリッとすればOK"
    ],
    tags: ["メレンゲ", "ナッツ", "焼き菓子", "イタリア"],
    story: "『不格好だが美味い』という職人の自虐ネーミングがそのまま定着",
    image: null
  },
  {
    id: 4,
    title: "パーチ・ディ・ダーマ",
    ingredients: "ヘーゼルナッツ粉：100g\nバター：100g\n砂糖：80g\n小麦粉：100g\nチョコ：適量",
    steps: [
      "① 生地を混ぜて丸める",
      "② オーブンで焼く（170℃で15分前後）",
      "③ 冷めたらチョコでサンド"
    ],
    tips: [
      "焼きすぎると割れやすい",
      "チョコはビターがおすすめ"
    ],
    tags: ["クッキー", "サンド", "ナッツ", "イタリア"],
    story: "2つのクッキーが重なる様子が『貴婦人のキス』に見えることから名付けられた",
    image: null
  },
  {
    id: 5,
    title: "リングエ・ディ・ガット",
    ingredients: "バター：100g\n砂糖：100g\n卵白：2個\n小麦粉：100g",
    steps: [
      "① 材料を混ぜる",
      "② 絞り袋で細長く絞る",
      "③ オーブンで焼く（180℃で10〜12分）"
    ],
    tips: [
      "薄くするとサクサク",
      "焼き色がついたらすぐ出す"
    ],
    tags: ["クッキー", "軽い", "紅茶", "イタリア"],
    story: "細長い形が猫の舌に似ていることから命名された",
    image: null
  },
  {
    id: 6,
    title: "ピエモンテ風 素朴菓子",
    ingredients: "小麦粉：200g\n砂糖：80g\n卵：1個\nバター：80g\nナッツまたはドライフルーツ：適量",
    steps: [
      "① 材料をまとめる",
      "② 成形する（丸や棒状）",
      "③ オーブンで焼く（180℃で20〜25分）"
    ],
    tips: [
      "混ぜすぎないのがコツ",
      "素材の味を活かす"
    ],
    tags: ["素朴", "焼き菓子", "地方菓子", "イタリア"],
    story: "ピエモンテ地方では村ごとに異なるレシピが存在し、名前や作り方も微妙に変わる",
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
