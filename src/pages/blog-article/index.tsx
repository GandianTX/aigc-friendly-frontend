// src/pages/blog-article/index.tsx

import { useParams } from 'react-router';

import { ArticleDetail } from '@/features/article-detail';
import { LikeButton } from '@/features/article-like';
import { CommentForm, CommentList, useComments } from '@/features/comment';

import { PageHeader } from '@/shared/ui/page-header';

function ArticleCommentSection({ articleId }: { articleId: string | undefined }) {
  const { comments, loading, reload } = useComments(articleId);

  return (
    <>
      <CommentList
        comments={comments}
        loading={loading}
        articleId={articleId}
        onReplySuccess={reload}
      />
      <div className="mt-6">
        <CommentForm articleId={articleId} onSuccess={reload} />
      </div>
    </>
  );
}

export function BlogArticlePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page-stack">
      <PageHeader description="阅读文章" title="文章详情" />
      <ArticleDetail
        articleId={id}
        likeSlot={<LikeButton articleId={id} />}
        commentSlot={<ArticleCommentSection articleId={id} />}
      />
    </div>
  );
}
