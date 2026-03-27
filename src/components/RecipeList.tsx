import React from 'react';
import type { Recipe } from '../types/recipe';

interface RecipeListProps {
  recipes: Recipe[];
  onSelect: (recipe: Recipe) => void;
  onDelete: (id: number) => void;
  onToggleToday: (recipe: Recipe) => void;
  todayIds: number[];
  search: string;
  filterTag: string;
}

export const RecipeList: React.FC<RecipeListProps> = ({ recipes, onSelect, onDelete, onToggleToday, todayIds, search, filterTag }) => {
  const filtered = recipes.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchTag = filterTag ? r.tags.includes(filterTag) : true;
    return matchSearch && matchTag;
  });

  if (filtered.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
        レシピが見つかりませんでした
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr' }}>
      {filtered.map((recipe) => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          onSelect={onSelect} 
          onDelete={onDelete} 
          onToggleToday={onToggleToday}
          isToday={todayIds.includes(recipe.id)}
        />
      ))}
    </div>
  );
};

const RecipeCard: React.FC<{ 
  recipe: Recipe; 
  onSelect: (r: Recipe) => void; 
  onDelete: (id: number) => void;
  onToggleToday: (r: Recipe) => void;
  isToday: boolean;
}> = ({ recipe, onSelect, onDelete, onToggleToday, isToday }) => {

  return (
    <div 
      className="premium-card" 
      onClick={() => onSelect(recipe)}
      style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem 1rem',
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
        minHeight: '60px'
      }}
    >
      <input
        type="checkbox"
        checked={isToday}
        onChange={(e) => { e.stopPropagation(); onToggleToday(recipe); }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: '24px', height: '24px', flexShrink: 0, accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
      />

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {recipe.title}
          </h3>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }}
            style={{ padding: '0.4rem', color: 'var(--error)', background: 'transparent', fontSize: '1.2rem', zIndex: 1, minWidth: '40px' }}
            title="削除"
          >
            🗑️
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
          {recipe.tags.slice(0, 2).map((tag) => (
            <span key={tag} style={{ fontSize: '0.65rem', background: 'var(--bg-tertiary)', padding: '0.1rem 0.5rem', borderRadius: '100px', color: 'var(--text-secondary)' }}>
              #{tag}
            </span>
          ))}
          {recipe.tags.length > 2 && <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>+</span>}
        </div>
      </div>
    </div>
  );
};
