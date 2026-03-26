import React from 'react';

interface TagFilterProps {
  tags: string[];
  selectedTag: string;
  onSelect: (tag: string) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTag, onSelect }) => {
  if (tags.length === 0) return null;

  return (
    <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>タグで絞り込む:</span>
      <button
        onClick={() => onSelect('')}
        style={{
          padding: '0.4rem 1rem',
          fontSize: '0.875rem',
          background: selectedTag === '' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
          color: selectedTag === '' ? 'var(--bg-primary)' : 'var(--text-primary)',
          borderRadius: '100px',
        }}
      >
        すべて
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(tag)}
          style={{
            padding: '0.4rem 1rem',
            fontSize: '0.875rem',
            background: selectedTag === tag ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
            color: selectedTag === tag ? 'var(--bg-primary)' : 'var(--text-primary)',
            borderRadius: '100px',
          }}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
};
