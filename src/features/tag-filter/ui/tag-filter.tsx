// src/features/tag-filter/ui/tag-filter.tsx

import { Spin, Tag } from 'antd';

import type { Tag as TagType } from '@/entities/tag';

import { useTagFilter } from '../application/use-tag-filter';

interface TagFilterProps {
  selectedTagId: string | null;
  onSelect: (tagId: string | null) => void;
}

export function TagFilter({ selectedTagId, onSelect }: TagFilterProps) {
  const { tags, loading } = useTagFilter();

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Spin />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Tag
        color={selectedTagId === null ? 'blue' : undefined}
        style={{ cursor: 'pointer' }}
        onClick={() => onSelect(null)}
      >
        全部标签
      </Tag>
      {tags.map((tag: TagType) => (
        <Tag
          key={tag.id}
          color={selectedTagId === tag.id ? 'blue' : undefined}
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect(selectedTagId === tag.id ? null : tag.id)}
        >
          {tag.name} ({tag.articleCount})
        </Tag>
      ))}
    </div>
  );
}
