// src/entities/category/index.ts

export type { Category, CategoryTreeNode } from './domain/category';
export { buildCategoryTree, flattenTree } from './domain/category-policy';
export { fetchCategories } from './infrastructure/category-api';
export type { CategoryDTO } from './infrastructure/dto';
export { mapCategoryDTOToCategory } from './infrastructure/mapper';
