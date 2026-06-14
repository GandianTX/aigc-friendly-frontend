// src/entities/tag/index.ts

export type { Tag } from './domain/tag';
export type { TagDTO } from './infrastructure/dto';
export { mapTagDTOToTag } from './infrastructure/mapper';
export { fetchTags } from './infrastructure/tag-api';
