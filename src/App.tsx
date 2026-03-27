import { useState } from 'react';
import { useRecipes } from './hooks/useRecipes';
import type { Recipe } from './types/recipe';
import { RecipeForm } from './components/RecipeForm';
import { RecipeList } from './components/RecipeList';
import { RecipeDetail } from './components/RecipeDetail';
import { TagFilter } from './components/TagFilter';
import { Timer } from './components/Timer';
import recipeSchema from './assets/recipeJson/recipe-schema.json';

function App() {
  const { recipes, addRecipe, updateRecipe, deleteRecipe, importRecipes } = useRecipes();
  const [view, setView] = useState<'list' | 'detail' | 'form'>('list');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(recipeSchema, null, 2))
      .then(() => alert('インポート用スキーマをクリップボードにコピーしました。'))
      .catch(() => alert('コピーに失敗しました。'));
  };
  
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

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

  const handleExport = () => {
    const dataStr = JSON.stringify(recipes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `cookmemo_backup_${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const validateRecipes = (data: any): data is Recipe[] => {
    if (!Array.isArray(data)) return false;
    return data.every(r => (
      typeof r.title === 'string' &&
      Array.isArray(r.ingredients) &&
      r.ingredients.every((ing: any) => (
        typeof ing.name === 'string' &&
        typeof ing.value === 'string' &&
        typeof ing.unit === 'string'
      ))
    ));
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (validateRecipes(json)) {
          importRecipes(json);
          alert(`${json.length}件のレシピをインポートしました。`);
        } else {
          alert('ファイルの形式が正しくありません。');
        }
      } catch (err) {
        alert('ファイルの読み込みに失敗しました。');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleTextImport = () => {
    try {
      const json = JSON.parse(jsonInput);
      if (validateRecipes(json)) {
        importRecipes(json);
        alert(`${json.length}件のレシピをインポートしました。`);
        setIsImportModalOpen(false);
        setJsonInput('');
      } else {
        alert('JSONの形式が正しくありません。スキーマを確認してください。');
      }
    } catch (err) {
      alert('JSONのパースに失敗しました。正しいJSON形式で入力してください。');
    }
  };

  return (
    <div style={{ padding: '0 1rem 1rem 1rem', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', boxShadow: '0 0 30px rgba(0,0,0,0.5)', position: 'relative' }}>
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

      <footer style={{ marginTop: '5rem', padding: '2rem 1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ marginBottom: '1.5rem' }}>&copy; 2026 CookMemo - Premium Dark Mode</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <label style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
              📤 Import
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
            <button 
              onClick={handleExport}
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            >
              📥 Export JSON
            </button>
            <button 
              onClick={handleCopySchema}
              style={{ 
                padding: '0.5rem 0.75rem', 
                fontSize: '0.8rem', 
                background: 'rgba(250, 204, 21, 0.1)', 
                color: 'var(--accent-primary)', 
                borderRadius: '8px', 
                border: '1px solid var(--accent-primary)' 
              }}
            >
              📋 Copy Schema
            </button>
          </div>
          
          <button 
            onClick={() => setIsImportModalOpen(true)}
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.85rem', 
              background: 'var(--bg-tertiary)', 
              color: 'var(--accent-primary)', 
              borderRadius: '8px', 
              border: '1px dashed var(--accent-primary)',
              marginTop: '0.5rem'
            }}
          >
            📝 JSON Text Import
          </button>
        </div>
      </footer>

      {/* JSON Import Modal */}
      {isImportModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', 
          alignItems: 'center', zIndex: 1000, padding: '1rem' 
        }}>
          <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ color: 'var(--accent-primary)' }}>JSONを貼り付けてインポート</h3>
            <textarea
              rows={10}
              placeholder='[ { "title": "...", "ingredients": [...] } ]'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'var(--text-primary)', fontSize: '0.8rem', fontFamily: 'monospace' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleTextImport} className="btn-primary" style={{ flex: 1 }}>インポート実行</button>
              <button 
                onClick={() => { setIsImportModalOpen(false); setJsonInput(''); }}
                style={{ flex: 1, background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
