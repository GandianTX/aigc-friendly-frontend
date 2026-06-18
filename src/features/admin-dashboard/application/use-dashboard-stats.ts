// src/features/admin-dashboard/application/use-dashboard-stats.ts

import { useCallback, useEffect, useReducer } from 'react';

import type { DashboardStatsDTO } from '../infrastructure/dto';
import { fetchDashboardStats } from '../infrastructure/dashboard-api';

type DashboardState = {
  stats: DashboardStatsDTO | null;
  loading: boolean;
  error: string | null;
};

type DashboardAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; stats: DashboardStatsDTO }
  | { type: 'FETCH_FAILURE'; error: string };

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { stats: action.stats, loading: false, error: null };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

export function useDashboardStats() {
  const [state, dispatch] = useReducer(dashboardReducer, {
    stats: null,
    loading: false,
    error: null,
  });

  const loadStats = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const stats = await fetchDashboardStats();
      dispatch({ type: 'FETCH_SUCCESS', stats });
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载统计数据失败';
      dispatch({ type: 'FETCH_FAILURE', error: message });
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return { ...state, reload: loadStats };
}
