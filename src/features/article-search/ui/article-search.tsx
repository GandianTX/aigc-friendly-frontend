// src/features/article-search/ui/article-search.tsx

import { useState } from 'react';
import { Empty, Input, List, Pagination, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { useArticleSearch } from '../application/use-article-search';
import { ArticleCard } from '@/widgets/article-card';

export function ArticleSearch() {
  const { items, total, page, pageSize, loading, error, keyword, search, loadPage } = useArticleSearch();
  const [inputValue, setInputValue] = useState(keyword);

  const handleSearch = () => {
    if (inputValue.trim()) {
      search(inputValue.trim());
    }
  };

  return (
    <div>
      <Input.Search
        placeholder="搜索文章..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onSearch={handleSearch}
        enterButton={<><SearchOutlined /> 搜索</>}
        size="large"
        style={{ marginBottom: 24 }}
      />

      {error ? (
        <Empty description={error} />
      ) : keyword ? (
        <Spin spinning={loading}>
          <List
            dataSource={items}
            renderItem={(article) => <ArticleCard key={article.id} article={article} showLikeCount={false} showCommentCount={false} highlightKeyword={keyword} />}
            locale={{ emptyText: <Empty description="未找到相关文章" /> }}
          />
          {total > pageSize ? (
            <div className="mt-4 flex justify-center">
              <Pagination current={page} pageSize={pageSize} total={total} onChange={loadPage} />
            </div>
          ) : null}
        </Spin>
      ) : (
        <Empty description="输入关键词开始搜索" />
      )}
    </div>
  );
}
