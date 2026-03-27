import React from 'react';
import type { Recipe } from '../types/recipe';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onEdit: () => void;
  onToggleToday: (recipe: Recipe) => void;
  isToday: boolean;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack, onEdit, onToggleToday, isToday }) => {
  return (
    <div className="glass premium-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
        <button onClick={onBack} style={{ background: 'var(--bg-tertiary)', padding: '0.5rem 1rem' }}>
          ← 戻る
        </button>
        <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
          <button 
            onClick={() => onToggleToday(recipe)}
            style={{ 
              flex: 1,
              padding: '0.5rem', 
              borderRadius: '8px',
              background: isToday ? 'rgba(250, 204, 21, 0.2)' : 'var(--bg-tertiary)',
              color: isToday ? 'var(--accent-primary)' : 'var(--text-primary)',
              border: `1px solid ${isToday ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {isToday ? '⭐ 今日から解除' : '⭐ 今日に追加'}
          </button>
        </div>
        <button onClick={onEdit} className="btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
          編集
        </button>
      </div>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>{recipe.title}</h1>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
        {recipe.tags.map((tag) => (
          <span key={tag} style={{ background: 'var(--bg-tertiary)', padding: '0.4rem 1rem', borderRadius: '100px', color: 'var(--text-secondary)' }}>
            #{tag}
          </span>
        ))}
        {recipe.mood && recipe.mood.map(m => (
          <span key={m} style={{ background: 'rgba(250, 204, 21, 0.1)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '1rem' }}>
            ✨ {m}
          </span>
        ))}
      </div>

      {recipe.image && (
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '2rem' }} 
        />
      )}

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr' }}>
        <section>
          <h2 style={{ borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>材料</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ing, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{ing.name}</span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
                    {ing.value} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{ing.unit}</span>
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>未登録</p>
            )}
          </div>
        </section>

        <section>
          <h2 style={{ borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>手順</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recipe.steps.length > 0 ? (
              recipe.steps.map((step, index) => (
                <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ 
                    background: 'var(--accent-primary)', 
                    color: 'var(--bg-primary)', 
                    borderRadius: '50%', 
                    width: '24px', 
                    height: '24px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    flexShrink: 0,
                    marginTop: '0.2rem'
                  }}>
                    {index + 1}
                  </span>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{step}</p>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>未登録</p>
            )}
          </div>
        </section>

        {recipe.tips && recipe.tips.length > 0 && (
          <section style={{ background: 'rgba(250, 204, 21, 0.05)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--accent-primary)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>💡 コツ・ポイント</h2>
            <ul style={{ listStyleType: 'none' }}>
              {recipe.tips.map((tip, index) => (
                <li key={index} style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>• {tip}</li>
              ))}
            </ul>
          </section>
        )}

        {recipe.story && (
          <section>
            <h2 style={{ borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>📖 この料理の背景</h2>
            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: '1.8' }}>
              {recipe.story}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};
