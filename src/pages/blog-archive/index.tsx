// src/pages/blog-archive/index.tsx

import { useParams } from 'react-router';

import { ArticleArchive, ArchiveArticleList, useArticleArchive } from '@/features/article-archive';

import { PageHeader } from '@/shared/ui/page-header';

// -- 归档总览组件 --

function ArchiveOverview() {
  const { archives, loading, error } = useArticleArchive();

  return (
    <div className="page-stack">
      <PageHeader description="按年月浏览文章" title="归档" />
      <ArticleArchive archives={archives} loading={loading} error={error} />
    </div>
  );
}

// -- 页面入口 --

export function BlogArchivePage() {
  const { year, month } = useParams<{ year: string; month: string }>();

  if (year && month) {
    return (
      <div className="page-stack">
        <PageHeader description={`${year} 年 ${month} 月`} title="归档文章" />
        <ArchiveArticleList year={Number(year)} month={Number(month)} />
      </div>
    );
  }

  return <ArchiveOverview />;
}
