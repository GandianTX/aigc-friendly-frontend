// src/features/admin-settings/application/use-blogger-info.ts

import { useCallback, useEffect, useState } from 'react';

import type { BloggerInfoDTO, UpdateBloggerInfoInputDTO } from '../infrastructure/dto';
import { fetchBloggerInfo, updateBloggerInfo } from '../infrastructure/admin-settings-api';

export type { BloggerInfoDTO, UpdateBloggerInfoInputDTO } from '../infrastructure/dto';

export function useBloggerInfo() {
  const [info, setInfo] = useState<BloggerInfoDTO | null>(null);
  const [loading, setLoading] = useState(false);

  const loadInfo = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBloggerInfo();
      setInfo(data);
    } catch {
      // 错误由调用方处理，此处仅防止 unhandled rejection
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  const doUpdate = useCallback(async (input: UpdateBloggerInfoInputDTO) => {
    await updateBloggerInfo(input);
    await loadInfo();
  }, [loadInfo]);

  return { info, loading, reload: loadInfo, doUpdate };
}
