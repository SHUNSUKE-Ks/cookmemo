import { useState, useEffect } from 'react';
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
  
  // Shopping List States
  const [todayRecipes, setTodayRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('cookmemo_today');
    return saved ? JSON.parse(saved) : [];
  });
  const [shoppingItems, setShoppingItems] = useState<any[]>(() => {
    const saved = localStorage.getItem('cookmemo_shopping');
    return saved ? JSON.parse(saved) : [];
  });
  const [isShoppingOpen, setIsShoppingOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('cookmemo_today', JSON.stringify(todayRecipes));
  }, [todayRecipes]);

  useEffect(() => {
    localStorage.setItem('cookmemo_shopping', JSON.stringify(shoppingItems));
  }, [shoppingItems]);

  // Merge ingredients when todayRecipes changes
  useEffect(() => {
    const merged = todayRecipes.flatMap(r => r.ingredients);
    const grouped = merged.reduce((acc, ing) => {
      const key = ing.name;
      const val = parseFloat(ing.value) || 0;
      if (!acc[key]) {
        // Try to find existing checked state
        const existing = shoppingItems.find(item => item.name === ing.name);
        acc[key] = {
          name: ing.name,
          value: val,
          unit: ing.unit,
          checked: existing ? existing.checked : false
        };
      } else {
        acc[key].value += val;
      }
      return acc;
    }, {} as Record<string, any>);

    // Only update if the structure changed (basic check)
    const newItems = Object.values(grouped);
    if (JSON.stringify(newItems.map(i => ({n:i.name, v:i.value}))) !== 
        JSON.stringify(shoppingItems.map(i => ({n:i.name, v:i.value})))) {
      setShoppingItems(newItems);
    }
  }, [todayRecipes]);

  const toggleTodayRecipe = (recipe: Recipe) => {
    setTodayRecipes(prev => {
      const exists = prev.find(r => r.id === recipe.id);
      if (exists) {
        return prev.filter(r => r.id !== recipe.id);
      }
      return [...prev, recipe];
    });
  };

  const toggleCheck = (index: number) => {
    const updated = [...shoppingItems];
    updated[index].checked = !updated[index].checked;
    setShoppingItems(updated);
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
          <button 
            onClick={() => setIsShoppingOpen(true)}
            style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', position: 'relative' }}
            title="買い物リスト"
          >
            📝
            {shoppingItems.length > 0 && shoppingItems.some(i => !i.checked) && (
              <span style={{ 
                position: 'absolute', top: '2px', right: '0px', 
                background: 'var(--accent-primary)', color: 'var(--bg-primary)', 
                fontSize: '0.7rem', padding: '1px 5px', borderRadius: '10px',
                fontWeight: 'bold', minWidth: '1.2rem', textAlign: 'center'
              }}>
                {shoppingItems.filter(i => !i.checked).length}
              </span>
            )}
          </button>
          {view === 'list' && (
            <button className="btn-primary" onClick={() => { setSelectedRecipe(null); setView('form'); }} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              + 新規作成
            </button>
          )}
        </div>
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
              onToggleToday={toggleTodayRecipe}
              todayIds={todayRecipes.map(r => r.id)}
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
            onToggleToday={toggleTodayRecipe}
            isToday={todayRecipes.some(r => r.id === selectedRecipe.id)}
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

      {/* Shopping List Modal */}
      {isShoppingOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', 
          alignItems: 'end', zIndex: 1100
        }}>
          <div className="glass" style={{ 
            width: '100%', maxWidth: '480px', maxHeight: '85vh', 
            padding: '2rem 1.5rem', borderRadius: '24px 24px 0 0', 
            display: 'flex', flexDirection: 'column', gap: '1.5rem',
            overflowY: 'auto', borderBottom: 'none'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}>🛒 買い物リスト</h2>
              <button onClick={() => setIsShoppingOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>

            {shoppingItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>リストが空です</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>レシピから「今日に追加」すると、材料が自動でここに表示されます。</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>{todayRecipes.length} つのレシピから集計</span>
                  <span>{shoppingItems.filter(i => i.checked).length} / {shoppingItems.length} 完了</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {shoppingItems.map((item, i) => (
                    <label key={i} style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.8rem', 
                      padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', 
                      borderRadius: '12px', cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s ease'
                    }}>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleCheck(i)}
                        style={{ width: '22px', height: '22px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                      />
                      <span style={{ 
                        flex: 1,
                        textDecoration: item.checked ? 'line-through' : 'none',
                        color: item.checked ? 'var(--text-muted)' : 'var(--text-primary)',
                        fontSize: '1rem'
                      }}>
                        {item.name}
                      </span>
                      <span style={{ 
                        color: item.checked ? 'var(--text-muted)' : 'var(--accent-primary)', 
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>
                        {item.value} {item.unit}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}

            <button onClick={() => setIsShoppingOpen(false)} className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
