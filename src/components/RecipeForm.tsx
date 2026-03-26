import React, { useState, useEffect } from 'react';
import type { Recipe } from '../types/recipe';

interface RecipeFormProps {
  onSave: (recipe: Omit<Recipe, 'id'>) => void;
  onCancel: () => void;
  initialData?: Recipe | null;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ onSave, onCancel, initialData }) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setIngredients(initialData.ingredients);
      setSteps(initialData.steps.join('\n'));
      setTags(initialData.tags.join(', '));
      setImage(initialData.image);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onSave({
      title,
      ingredients,
      steps: steps.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      image,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="glass premium-card" style={{ marginBottom: '2rem' }}>
      <h2 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>
        {initialData ? 'レシピを編集' : '新しいレシピを追加'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>料理名</label>
          <input
            type="text"
            placeholder="例: 肉じゃが"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>材料</label>
          <textarea
            rows={4}
            placeholder="例: 牛肉 200g, じゃがいも 3個..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>手順</label>
          <textarea
            rows={6}
            placeholder="例: 1. じゃがいもを切る..."
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>タグ (カンマ区切り)</label>
          <input
            type="text"
            placeholder="例: 和食, 夕食, 時短"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>写真</label>
          <input type="file" onChange={handleImageChange} accept="image/*" style={{ border: 'none', background: 'none', padding: '0' }} />
          {image && (
            <div style={{ marginTop: '1rem', position: 'relative' }}>
              <img src={image} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginTop: '1rem' }} />
              <button 
                type="button" 
                onClick={() => setImage(null)}
                style={{ position: 'absolute', top: '1.5rem', right: '0.5rem', background: 'var(--error)', padding: '0.25rem 0.5rem', borderRadius: '50%', color: 'white' }}
              >
                ×
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn-primary" style={{ flex: 1 }}>
            保存する
          </button>
          <button type="button" onClick={onCancel} style={{ flex: 1, background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};
