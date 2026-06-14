// src/pages/blog-search/index.tsx

import { ArticleSearch } from '@/features/article-search';

import { PageHeader } from '@/shared/ui/page-header';

export function BlogSearchPage() {
  return (
    <div className="page-stack">
      <PageHeader description="搜索文章" title="搜索" />
      <ArticleSearch />
    </div>
  );
}
