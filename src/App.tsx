import { useState } from 'react';
import { useRecipes } from './hooks/useRecipes';
import type { Recipe } from './types/recipe';
import { RecipeForm } from './components/RecipeForm';
import { RecipeList } from './components/RecipeList';
import { RecipeDetail } from './components/RecipeDetail';
import { TagFilter } from './components/TagFilter';
import { Timer } from './components/Timer';

function App() {
  const { recipes, addRecipe, updateRecipe, deleteRecipe, resetRecipes } = useRecipes();
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
    <div style={{ padding: '0 1rem 1rem 1rem', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', boxShadow: '0 0 30px rgba(0,0,0,0.5)' }}>
      <header style={{ padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'var(--accent-primary)', fontSize: '1.8rem' }}>CookMemo</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>レシピをスマートに管理</p>
        </div>
        {view === 'list' && (
          <button className="btn-primary" onClick={() => { setSelectedRecipe(null); setView('form'); }} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            + 新規作成
          </button>
        )}
      </header>
      
      <section className="sticky-timer-section">
        <Timer />
      </section>

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
        <p style={{ marginBottom: '1.5rem' }}>&copy; 2026 CookMemo - Premium Dark Mode</p>
        <button 
          onClick={resetRecipes}
          style={{ 
            background: 'rgba(250, 204, 21, 0.1)', 
            color: 'var(--accent-primary)', 
            fontSize: '0.85rem', 
            border: '1px solid var(--accent-primary)', 
            padding: '0.5rem 1rem', 
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(250, 204, 21, 0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(250, 204, 21, 0.1)'}
        >
          🔄 全レシピを初期状態に戻す
        </button>
      </footer>
    </div>
  );
}

export default App;
