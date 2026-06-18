// src/features/admin-settings/infrastructure/dto.ts

export interface BloggerInfoDTO {
  readonly nickname: string | null;
  readonly bio: string | null;
  readonly avatarUrl: string | null;
}

export interface UpdateBloggerInfoInputDTO {
  readonly nickname?: string | null;
  readonly bio?: string | null;
  readonly avatarUrl?: string | null;
}
