import React from 'react';
import type { Recipe } from '../types/recipe';

interface RecipeListProps {
  recipes: Recipe[];
  onSelect: (recipe: Recipe) => void;
  onDelete: (id: number) => void;
  search: string;
  filterTag: string;
}

export const RecipeList: React.FC<RecipeListProps> = ({ recipes, onSelect, onDelete, search, filterTag }) => {
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
    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr' }}>
      {filtered.map((recipe) => (
        <div key={recipe.id} className="premium-card" style={{ display: 'flex', flexDirection: 'column' }}>
          {recipe.image && (
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              style={{ width: 'calc(100% + 3rem)', margin: '-1.5rem -1.5rem 1rem -1.5rem', height: '180px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} 
            />
          )}
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>{recipe.title}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {recipe.tags.map((tag) => (
              <span key={tag} style={{ fontSize: '0.75rem', background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '100px', color: 'var(--text-secondary)' }}>
                #{tag}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={() => onSelect(recipe)}
              style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', fontSize: '0.875rem' }}
            >
              詳細を見る
            </button>
            <button 
              onClick={() => onDelete(recipe.id)}
              style={{ padding: '0.5rem', color: 'var(--error)', background: 'transparent', fontSize: '1.25rem' }}
              title="削除"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
