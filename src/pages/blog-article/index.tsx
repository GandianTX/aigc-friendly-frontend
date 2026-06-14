// src/pages/blog-article/index.tsx

import { useParams } from 'react-router';

import { ArticleDetail } from '@/features/article-detail';

import { PageHeader } from '@/shared/ui/page-header';

export function BlogArticlePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page-stack">
      <PageHeader description="阅读文章" title="文章详情" />
      <ArticleDetail articleId={id} />
    </div>
  );
}
