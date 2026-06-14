// src/features/article-archive/ui/archive-article-list.tsx

import { Empty, List, Pagination, Spin } from 'antd';

import { useArchiveArticles } from '../application/use-archive-articles';
import { ArticleCard } from '@/widgets/article-card';

interface ArchiveArticleListProps {
  year: number;
  month: number;
}

export function ArchiveArticleList({ year, month }: ArchiveArticleListProps) {
  const { items, total, page, pageSize, loading, error, loadPage } = useArchiveArticles(year, month);

  if (error) {
    return <Empty description={error} />;
  }

  return (
    <Spin spinning={loading}>
      <List
        dataSource={items}
        renderItem={(article) => <ArticleCard key={article.id} article={article} showLikeCount={false} showCommentCount={false} showTags={false} />}
        locale={{ emptyText: <Empty description="该月份暂无文章" /> }}
      />
      {total > pageSize ? (
        <div className="mt-4 flex justify-center">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={(p) => loadPage(p)}
          />
        </div>
      ) : null}
    </Spin>
  );
}
