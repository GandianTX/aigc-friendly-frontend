// src/pages/blog-home/index.tsx

import { useState } from 'react';
import { Col, Row } from 'antd';

import { BloggerProfile } from '@/widgets/blogger-profile';
import { ArticleList } from '@/features/article-list';
import { CategoryFilter } from '@/features/category-filter';
import { TagFilter } from '@/features/tag-filter';

import { PageHeader } from '@/shared/ui/page-header';

export function BlogHomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  return (
    <div className="page-stack">
      <PageHeader description="阅读、探索与发现" title="博客" />

      <Row gutter={24}>
        <Col span={6}>
          <div className="flex flex-col gap-4">
            <BloggerProfile />
            <CategoryFilter
              selectedCategoryId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
            />
          </div>
        </Col>
        <Col span={18}>
          <div className="mb-4">
            <TagFilter selectedTagId={selectedTagId} onSelect={setSelectedTagId} />
          </div>
          <ArticleList categoryId={selectedCategoryId} tagId={selectedTagId} />
        </Col>
      </Row>
    </div>
  );
}
