// _RecipeNoteApp.jsx
// レシピノートPWA（拡張版）
// 機能: 検索 / タグ / 画像 / 詳細ページ

import { useState, useEffect } from "react";

export default function RecipeNoteApp() {
    const [recipes, setRecipes] = useState([]);
    const [view, setView] = useState("list"); // list or detail
    const [selected, setSelected] = useState(null);

    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [steps, setSteps] = useState("");
    const [tags, setTags] = useState("");
    const [image, setImage] = useState(null);

    const [search, setSearch] = useState("");
    const [filterTag, setFilterTag] = useState("");

    // load
    useEffect(() => {
        const saved = localStorage.getItem("recipes");
        if (saved) setRecipes(JSON.parse(saved));
    }, []);

    // save
    useEffect(() => {
        localStorage.setItem("recipes", JSON.stringify(recipes));
    }, [recipes]);

    const addRecipe = () => {
        if (!title) return;

        const newRecipe = {
            id: Date.now(),
            title,
            ingredients,
            steps,
            tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
            image,
        };

        setRecipes([newRecipe, ...recipes]);
        resetForm();
    };

    const resetForm = () => {
        setTitle("");
        setIngredients("");
        setSteps("");
        setTags("");
        setImage(null);
    };

    const deleteRecipe = (id) => {
        setRecipes(recipes.filter((r) => r.id !== id));
    };

    const filteredRecipes = recipes.filter((r) => {
        const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
        const matchTag = filterTag ? r.tags.includes(filterTag) : true;
        return matchSearch && matchTag;
    });

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => setImage(reader.result);
        reader.readAsDataURL(file);
    };

    const allTags = [...new Set(recipes.flatMap((r) => r.tags))];

    // ---------------- UI ----------------
    if (view === "detail" && selected) {
        return (
            <div className="p-4">
                <button onClick={() => setView("list")}>← 戻る</button>
                <h1 className="text-xl font-bold mt-2">{selected.title}</h1>

                {selected.image && (
                    <img src={selected.image} className="w-full mt-2" />
                )}

                <div className="mt-2">
                    {selected.tags.map((t) => (
                        <span key={t} className="mr-2 text-sm bg-gray-200 px-2">
                            {t}
                        </span>
                    ))}
                </div>

                <p className="mt-4 whitespace-pre-wrap">材料:\n{selected.ingredients}</p>
                <p className="mt-4 whitespace-pre-wrap">手順:\n{selected.steps}</p>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-xl font-bold mb-4">レシピノート</h1>

            {/* 検索 */}
            <input
                className="border p-2 w-full mb-2"
                placeholder="検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* タグフィルター */}
            <div className="mb-2">
                {allTags.map((t) => (
                    <button
                        key={t}
                        className={`mr-2 mb-2 px-2 ${filterTag === t ? "bg-blue-300" : "bg-gray-200"}`}
                        onClick={() => setFilterTag(t === filterTag ? "" : t)}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* 入力 */}
            <div className="mb-4 border p-2">
                <input
                    className="border p-2 w-full mb-2"
                    placeholder="料理名"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="border p-2 w-full mb-2"
                    placeholder="材料"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                />
                <textarea
                    className="border p-2 w-full mb-2"
                    placeholder="手順"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                />
                <input
                    className="border p-2 w-full mb-2"
                    placeholder="タグ（カンマ区切り）"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <input type="file" onChange={handleImage} className="mb-2" />

                <button className="bg-blue-500 text-white px-4 py-2" onClick={addRecipe}>
                    保存
                </button>
            </div>

            {/* 一覧 */}
            {filteredRecipes.map((r) => (
                <div key={r.id} className="border p-2 mb-2">
                    <h2
                        className="font-bold cursor-pointer"
                        onClick={() => {
                            setSelected(r);
                            setView("detail");
                        }}
                    >
                        {r.title}
                    </h2>

                    <div className="text-sm">
                        {r.tags.map((t) => (
                            <span key={t} className="mr-2 bg-gray-200 px-1">
                                {t}
                            </span>
                        ))}
                    </div>

                    <button className="text-red-500 mt-1" onClick={() => deleteRecipe(r.id)}>
                        削除
                    </button>
                </div>
            ))}
        </div>
    );
}

// _manifest.json
{
    "name": "Recipe Note",
        "short_name": "Recipes",
            "start_url": ".",
                "display": "standalone",
                    "background_color": "#ffffff",
                        "theme_color": "#3b82f6",
                            "icons": [
                                {
                                    "src": "/icon-192.png",
                                    "sizes": "192x192",
                                    "type": "image/png"
                                }
                            ]
}

// _sw.js
self.addEventListener("install", (e) => {
    self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

// main.jsx
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js');
// }
