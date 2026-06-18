// src/features/article-detail/ui/article-detail.tsx

import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Divider, Empty, Spin, Tag, Typography } from 'antd';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { type Article, formatPublishedDate } from '@/entities/article';

import { useArticleDetail } from '../application/use-article-detail';

const { Title, Paragraph } = Typography;

function PrevNextNav({
  prev,
  next,
}: {
  prev: Article | null;
  next: Article | null;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between mt-6">
      {prev ? (
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(`/blog/article/${prev.id}`)}>
          {prev.title}
        </Button>
      ) : (
        <div />
      )}
      {next ? (
        <Button type="text" onClick={() => navigate(`/blog/article/${next.id}`)}>
          {next.title}
          <ArrowRightOutlined />
        </Button>
      ) : (
        <div />
      )}
    </div>
  );
}

interface ArticleDetailProps {
  articleId: string | undefined;
  likeSlot?: ReactNode;
  commentSlot?: ReactNode;
}

export function ArticleDetail({ articleId, likeSlot, commentSlot }: ArticleDetailProps) {
  const { article, prevArticle, nextArticle, loading, error } = useArticleDetail(articleId);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !article) {
    return <Empty description={error ?? '文章不存在'} />;
  }

  return (
    <article>
      <header className="mb-6">
        <Title level={2}>{article.title}</Title>
        <div className="flex items-center gap-4 text-text-secondary text-sm">
          <span>{formatPublishedDate(article.publishedAt)}</span>
          <span>{article.viewCount} 阅读</span>
          <span>{article.likeCount} 点赞</span>
          <span>{article.commentCount} 评论</span>
        </div>
        {article.tags.length > 0 ? (
          <div className="mt-2 flex gap-1">
            {article.tags.map((tag) => (
              <Tag key={tag.id}>{tag.name}</Tag>
            ))}
          </div>
        ) : null}
      </header>

      <div className="article-content">
        <Paragraph>{article.content}</Paragraph>
      </div>

      {likeSlot ? <div className="mt-4">{likeSlot}</div> : null}

      <PrevNextNav prev={prevArticle} next={nextArticle} />

      {commentSlot ? (
        <>
          <Divider />
          <section>{commentSlot}</section>
        </>
      ) : null}
    </article>
  );
}
