// src/entities/category/domain/category-policy.ts

import type { Category, CategoryTreeNode } from './category';

export function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const map = new Map<string, CategoryTreeNode>();
  const roots: CategoryTreeNode[] = [];

  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] });
  }

  for (const cat of categories) {
    const node = map.get(cat.id)!;
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export function flattenTree(nodes: CategoryTreeNode[]): Category[] {
  const result: Category[] = [];

  function walk(node: CategoryTreeNode) {
    const { children, ...rest } = node;
    result.push(rest);
    children.forEach(walk);
  }

  nodes.forEach(walk);
  return result;
}
