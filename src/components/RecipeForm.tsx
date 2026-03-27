import React, { useState, useEffect, useRef } from 'react';
import type { Recipe, Ingredient } from '../types/recipe';

interface RecipeFormProps {
  onSave: (recipe: Omit<Recipe, 'id'>) => void;
  onCancel: () => void;
  initialData?: Recipe | null;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ onSave, onCancel, initialData }) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', value: '', unit: '' }]);
  const [steps, setSteps] = useState('');
  const [tags, setTags] = useState('');
  const [tips, setTips] = useState('');
  const [story, setStory] = useState('');
  const [mood, setMood] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const valueInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setIngredients(initialData.ingredients.length > 0 ? initialData.ingredients : [{ name: '', value: '', unit: '' }]);
      setSteps(initialData.steps.join('\n'));
      setTags(initialData.tags.join(', '));
      setTips(initialData.tips?.join('\n') || '');
      setStory(initialData.story || '');
      setMood(initialData.mood?.join(', ') || '');
      setImage(initialData.image);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onSave({
      title,
      ingredients: ingredients.filter(ing => ing.name.trim() !== ''),
      steps: steps.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      tips: tips.split('\n').map((s) => s.trim()).filter(Boolean),
      story,
      mood: mood.split(',').map((m) => m.trim()).filter(Boolean),
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

  const handleValueKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < ingredients.length) {
        valueInputRefs.current[nextIndex]?.focus();
      } else {
        // Last row, add new row
        setIngredients([...ingredients, { name: '', value: '', unit: '' }]);
        setTimeout(() => {
          valueInputRefs.current[nextIndex]?.focus();
        }, 0);
      }
    }
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
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span style={{ flex: 3 }}>材料名</span>
            <span style={{ flex: 1 }}>数値</span>
            <span style={{ width: '60px' }}>単位</span>
            <span style={{ width: '30px' }}></span>
          </div>
          {ingredients.map((ing, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                placeholder="名称"
                value={ing.name}
                onChange={(e) => {
                  const newIngs = [...ingredients];
                  newIngs[index].name = e.target.value;
                  setIngredients(newIngs);
                }}
                style={{ flex: 3 }}
              />
              <input
                ref={el => { valueInputRefs.current[index] = el; }}
                type="text"
                placeholder="100"
                value={ing.value}
                onChange={(e) => {
                  const newIngs = [...ingredients];
                  // 全角を半角に変換
                  let val = e.target.value.replace(/[！-～]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
                  // 数字（小数点含む）のみ許可
                  val = val.replace(/[^0-9.]/g, '');
                  newIngs[index].value = val;
                  setIngredients(newIngs);
                }}
                onKeyDown={(e) => handleValueKeyDown(e, index)}
                style={{ flex: 1 }}
              />
              <input
                type="text"
                placeholder="g"
                value={ing.unit}
                onChange={(e) => {
                  const newIngs = [...ingredients];
                  newIngs[index].unit = e.target.value;
                  setIngredients(newIngs);
                }}
                style={{ width: '60px' }}
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}
                  style={{ background: 'transparent', padding: '0.5rem', color: 'var(--error)', width: '30px' }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setIngredients([...ingredients, { name: '', value: '', unit: '' }])}
            style={{ 
              width: '100%', 
              background: 'var(--bg-tertiary)', 
              color: 'var(--accent-primary)',
              marginTop: '0.5rem',
              fontSize: '0.9rem'
            }}
          >
            + 材料を追加
          </button>
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
            {['前菜', 'スープ', 'メイン', 'デザート'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  const currentTags = tags.split(',').map(t => t.trim()).filter(Boolean);
                  if (!currentTags.includes(tag)) {
                    setTags(currentTags.concat(tag).join(', '));
                  }
                }}
                style={{ 
                  padding: '0.2rem 0.6rem', 
                  fontSize: '0.75rem', 
                  background: 'var(--bg-tertiary)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '100px',
                  color: 'var(--text-secondary)'
                }}
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>コツ・ポイント (改行区切り)</label>
          <textarea
            rows={3}
            placeholder="例: 焼きすぎないよう注意..."
            value={tips}
            onChange={(e) => setTips(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>料理の由来・背景</label>
          <textarea
            rows={3}
            placeholder="例: 古くから地元で親しまれている..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>気分・ムード (カンマ区切り)</label>
          <input
            type="text"
            placeholder="例: パーティー, 癒やし, 週末"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
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
