// src/entities/category/infrastructure/category-api.ts

import { executeGraphQL } from '@/shared/graphql';

import type { CategoryDTO } from './dto';

type CategoriesVariables = Record<string, never>;

const CATEGORIES_QUERY = `
  query Categories {
    categories {
      id name slug parentId sortOrder articleCount createdAt updatedAt
    }
  }
`;

export async function fetchCategories(): Promise<CategoryDTO[]> {
  const data = await executeGraphQL<{ categories: CategoryDTO[] }, CategoriesVariables>(
    CATEGORIES_QUERY,
    {},
    { authMode: 'none' },
  );

  return data.categories;
}
