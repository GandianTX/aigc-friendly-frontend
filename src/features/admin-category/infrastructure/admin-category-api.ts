// src/features/admin-category/infrastructure/admin-category-api.ts

import { executeGraphQL } from '@/shared/graphql';
import { fetchCategories } from '@/entities/category';
import type { CategoryDTO } from '@/entities/category';

export { fetchCategories };
export type { CategoryDTO };

import type { CreateCategoryInputDTO, UpdateCategoryInputDTO } from './dto';

const CREATE_CATEGORY_MUTATION = `
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id name slug parentId sortOrder articleCount createdAt updatedAt
    }
  }
`;

const UPDATE_CATEGORY_MUTATION = `
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      id name slug parentId sortOrder articleCount createdAt updatedAt
    }
  }
`;

const DELETE_CATEGORY_MUTATION = `
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id) { deleted id }
  }
`;

export async function createCategory(input: CreateCategoryInputDTO): Promise<CategoryDTO> {
  const data = await executeGraphQL<
    { createCategory: CategoryDTO },
    { input: CreateCategoryInputDTO }
  >(CREATE_CATEGORY_MUTATION, { input });
  return data.createCategory;
}

export async function updateCategory(input: UpdateCategoryInputDTO): Promise<CategoryDTO> {
  const data = await executeGraphQL<
    { updateCategory: CategoryDTO },
    { input: UpdateCategoryInputDTO }
  >(UPDATE_CATEGORY_MUTATION, { input });
  return data.updateCategory;
}

export async function deleteCategory(id: string): Promise<{ deleted: boolean; id: string }> {
  const data = await executeGraphQL<
    { deleteCategory: { deleted: boolean; id: string } },
    { id: string }
  >(DELETE_CATEGORY_MUTATION, { id });
  return data.deleteCategory;
}
