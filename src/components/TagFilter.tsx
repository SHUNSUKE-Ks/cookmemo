import React, { useState } from 'react';

interface TagFilterProps {
  tags: string[];
  selectedTag: string;
  onSelect: (tag: string) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTag, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (tags.length === 0) return null;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%', 
          background: 'var(--bg-tertiary)', 
          padding: '0.75rem 1rem', 
          borderRadius: '12px',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          marginBottom: isExpanded ? '1rem' : '0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🏷️ タグで絞り込む</span>
          {selectedTag && (
            <span style={{ 
              background: 'var(--accent-primary)', 
              color: 'var(--bg-primary)', 
              padding: '0.1rem 0.5rem', 
              borderRadius: '100px', 
              fontSize: '0.7rem', 
              fontWeight: 'bold' 
            }}>
              #{selectedTag}
            </span>
          )}
        </div>
        <span>{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem' }}>
          <button
            onClick={() => { onSelect(''); setIsExpanded(false); }}
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
              onClick={() => { onSelect(tag); setIsExpanded(false); }}
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
      )}
    </div>
  );
};
