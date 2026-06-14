// src/widgets/article-card/index.tsx

import { Card, Tag } from 'antd';
import { useNavigate } from 'react-router';

import { type ArticleListItem, formatPublishedDate } from '@/entities/article';

interface ArticleCardProps {
  article: ArticleListItem;
  showLikeCount?: boolean;
  showCommentCount?: boolean;
  showTags?: boolean;
  highlightKeyword?: string;
}

function highlightText(text: string, keyword: string): React.ReactNode {
  if (!keyword) return text;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  if (parts.length <= 1) return text;
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={i} style={{ backgroundColor: '#ffe58f', padding: 0 }}>{part}</mark>
    ) : (
      part
    ),
  );
}

export function ArticleCard({
  article,
  showLikeCount = true,
  showCommentCount = true,
  showTags = true,
  highlightKeyword,
}: ArticleCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      onClick={() => navigate(`/blog/article/${article.id}`)}
      style={{ marginBottom: 16 }}
    >
      <Card.Meta
        title={
          <div className="flex items-center gap-2">
            {article.isTop ? <Tag color="red">置顶</Tag> : null}
            <span>{highlightKeyword ? highlightText(article.title, highlightKeyword) : article.title}</span>
          </div>
        }
        description={
          <div>
            {article.summary ? (
              <p className="m-0 mb-2 text-text-secondary">
                {highlightKeyword ? highlightText(article.summary, highlightKeyword) : article.summary}
              </p>
            ) : null}
            <div className="flex items-center gap-4 text-text-secondary text-sm">
              <span>{formatPublishedDate(article.publishedAt)}</span>
              <span>{article.viewCount} 阅读</span>
              {showLikeCount ? <span>{article.likeCount} 点赞</span> : null}
              {showCommentCount ? <span>{article.commentCount} 评论</span> : null}
            </div>
            {showTags && article.tags.length > 0 ? (
              <div className="mt-2 flex gap-1">
                {article.tags.map((tag) => (
                  <Tag key={tag.id}>{tag.name}</Tag>
                ))}
              </div>
            ) : null}
          </div>
        }
      />
    </Card>
  );
}
