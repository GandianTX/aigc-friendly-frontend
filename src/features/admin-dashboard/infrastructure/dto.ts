// src/features/admin-dashboard/infrastructure/dto.ts

export interface DashboardStatsDTO {
  readonly totalArticles: number;
  readonly totalPublishedArticles: number;
  readonly totalComments: number;
  readonly totalPendingComments: number;
  readonly totalViews: number;
  readonly totalLikes: number;
}
