import React, { useState, useRef } from 'react';
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
    <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: '1fr' }}>
      {filtered.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} onSelect={onSelect} onDelete={onDelete} />
      ))}
    </div>
  );
};

const RecipeCard: React.FC<{ 
  recipe: Recipe; 
  onSelect: (r: Recipe) => void; 
  onDelete: (id: number) => void 
}> = ({ recipe, onSelect, onDelete }) => {
  const lastTap = useRef<number>(0);

  const handleTouch = (e: React.TouchEvent | React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      onSelect(recipe);
    }
    lastTap.current = now;
  };

  return (
    <div 
      className="premium-card" 
      onClick={handleTouch}
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {recipe.image && (
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          draggable={false}
          style={{ width: 'calc(100% + 3rem)', margin: '-1.5rem -1.5rem 1rem -1.5rem', height: '180px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} 
        />
      )}
      <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>{recipe.title}</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {recipe.tags.slice(0, 3).map((tag) => (
          <span key={tag} style={{ fontSize: '0.75rem', background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '100px', color: 'var(--text-secondary)' }}>
            #{tag}
          </span>
        ))}
        {recipe.tags.length > 3 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>...</span>}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }}
          style={{ padding: '0.5rem', color: 'var(--error)', background: 'transparent', fontSize: '1.25rem' }}
          title="削除"
        >
          🗑️
        </button>
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem', opacity: 0.5, textAlign: 'center', marginTop: '0.5rem' }}>
        ダブルタップで詳細を開く
      </div>
    </div>
  );
};
