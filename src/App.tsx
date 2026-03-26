import { useState } from 'react';
import { useRecipes } from './hooks/useRecipes';
import type { Recipe } from './types/recipe';
import { RecipeForm } from './components/RecipeForm';
import { RecipeList } from './components/RecipeList';
import { RecipeDetail } from './components/RecipeDetail';
import { TagFilter } from './components/TagFilter';

function App() {
  const { recipes, addRecipe, updateRecipe, deleteRecipe } = useRecipes();
  const [view, setView] = useState<'list' | 'detail' | 'form'>('list');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const allTags = Array.from(new Set(recipes.flatMap((r) => r.tags)));

  const handleSave = (recipeData: Omit<Recipe, 'id'>) => {
    if (selectedRecipe) {
      updateRecipe(selectedRecipe.id, recipeData);
    } else {
      addRecipe(recipeData);
    }
    setView('list');
    setSelectedRecipe(null);
  };

  const handleEdit = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView('form');
  };

  const handleSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView('detail');
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', boxShadow: '0 0 30px rgba(0,0,0,0.5)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ color: 'var(--accent-primary)', fontSize: '2.5rem' }}>CookMemo</h1>
          <p style={{ color: 'var(--text-muted)' }}>レシピをJSONでスマートに管理</p>
        </div>
        {view === 'list' && (
          <button className="btn-primary" onClick={() => { setSelectedRecipe(null); setView('form'); }}>
            + 新規作成
          </button>
        )}
      </header>

      <main>
        {view === 'list' && (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <input
                type="text"
                placeholder="料理名で検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ fontSize: '1.25rem', padding: '1rem' }}
              />
            </div>

            <TagFilter 
              tags={allTags} 
              selectedTag={filterTag} 
              onSelect={setFilterTag} 
            />

            <RecipeList
              recipes={recipes}
              onSelect={handleSelect}
              onDelete={deleteRecipe}
              search={search}
              filterTag={filterTag}
            />
          </>
        )}

        {view === 'form' && (
          <RecipeForm
            onSave={handleSave}
            onCancel={() => { setView('list'); setSelectedRecipe(null); }}
            initialData={selectedRecipe}
          />
        )}

        {view === 'detail' && selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onBack={() => { setView('list'); setSelectedRecipe(null); }}
            onEdit={() => handleEdit(selectedRecipe)}
          />
        )}
      </main>

      <footer style={{ marginTop: '5rem', padding: '2rem 0', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>&copy; 2026 CookMemo - Designed with Premium Dark Mode</p>
      </footer>
    </div>
  );
}

export default App;
