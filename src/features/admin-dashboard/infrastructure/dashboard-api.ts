// src/features/admin-dashboard/infrastructure/dashboard-api.ts

import { executeGraphQL } from '@/shared/graphql';

import type { DashboardStatsDTO } from './dto';

const DASHBOARD_STATS_QUERY = `
  query DashboardStats {
    dashboardStats {
      totalArticles totalPublishedArticles totalComments
      totalPendingComments totalViews totalLikes
    }
  }
`;

export async function fetchDashboardStats(): Promise<DashboardStatsDTO> {
  const data = await executeGraphQL<{ dashboardStats: DashboardStatsDTO }, Record<string, never>>(
    DASHBOARD_STATS_QUERY,
    {},
  );

  return data.dashboardStats;
}
