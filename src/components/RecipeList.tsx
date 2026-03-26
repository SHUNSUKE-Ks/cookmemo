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
  const [dragX, setDragX] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    startX.current = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    isDragging.current = true;
  };

  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = currentX - startX.current;
    
    // Limit drag to one direction or constrain it
    if (diff < 0) {
      setDragX(Math.max(diff, -150));
    }
  };

  const onDragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    if (dragX < -80) {
      onSelect(recipe);
    }
    setDragX(0);
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
      {/* Background Layer revealed by dragging */}
      <div style={{ 
        position: 'absolute', 
        right: 0, 
        top: 0, 
        bottom: 0, 
        width: '150px', 
        background: 'linear-gradient(90deg, transparent, var(--accent-primary))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--bg-primary)',
        fontWeight: 'bold',
        opacity: Math.min(Math.abs(dragX) / 100, 1),
        borderRadius: '16px'
      }}>
        詳細を表示 →
      </div>

      <div 
        className="premium-card" 
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          transform: `translateX(${dragX}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'grab',
          userSelect: 'none',
          position: 'relative',
          zIndex: 1,
          margin: 0
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
        <div style={{ position: 'absolute', bottom: '0.5rem', left: '50%', transform: 'translateX(-50%)', color: 'var(--text-muted)', fontSize: '0.6rem', opacity: 0.5 }}>
          ← スワイプして詳細を開く
        </div>
      </div>
    </div>
  );
};
