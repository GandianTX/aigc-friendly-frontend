// src/entities/category/domain/category.ts

export interface Category {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly parentId: string | null;
  readonly sortOrder: number;
  readonly articleCount: number;
}

export interface CategoryTreeNode extends Category {
  readonly children: CategoryTreeNode[];
}
