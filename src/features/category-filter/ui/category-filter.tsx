// src/features/category-filter/ui/category-filter.tsx

import { Menu, Spin } from 'antd';

import type { Category } from '@/entities/category';

import { useCategoryFilter } from '../application/use-category-filter';

interface CategoryFilterProps {
  selectedCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({ selectedCategoryId, onSelect }: CategoryFilterProps) {
  const { categories, loading } = useCategoryFilter();

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Spin />
      </div>
    );
  }

  const menuItems = [
    { key: '', label: '全部分类' },
    ...categories.map((cat: Category) => ({
      key: cat.id,
      label: `${cat.name} (${cat.articleCount})`,
    })),
  ];

  return (
    <Menu
      mode="inline"
      selectedKeys={selectedCategoryId ? [selectedCategoryId] : ['']}
      items={menuItems}
      onClick={({ key }) => onSelect(key || null)}
    />
  );
}
