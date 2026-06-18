// src/features/article-list/ui/article-list.tsx

import { Empty, List, Pagination, Spin } from 'antd';

import { ArticleCard } from '@/entities/article';

import { useArticleList } from '../application/use-article-list';

interface ArticleListProps {
  categoryId?: string | null;
  tagId?: string | null;
}

export function ArticleList({ categoryId, tagId }: ArticleListProps) {
  const { items, total, page, pageSize, loading, error, setPage } = useArticleList({ categoryId, tagId });

  if (error) {
    return <Empty description={error} />;
  }

  return (
    <Spin spinning={loading}>
      <List
        dataSource={items}
        renderItem={(article) => <ArticleCard key={article.id} article={article} />}
        locale={{ emptyText: <Empty description="暂无文章" /> }}
      />
      {total > pageSize ? (
        <div className="mt-4 flex justify-center">
          <Pagination current={page} pageSize={pageSize} total={total} onChange={setPage} />
        </div>
      ) : null}
    </Spin>
  );
}
