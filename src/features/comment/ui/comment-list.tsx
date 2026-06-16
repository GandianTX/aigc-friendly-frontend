// src/features/comment/ui/comment-list.tsx

import { Avatar, Empty, Spin, Typography } from 'antd';

import type { CommentTreeNode } from '@/entities/comment';

import { CommentItem } from './comment-item';

const { Title } = Typography;

export function CommentList({
  comments,
  loading,
  articleId,
  onReplySuccess,
}: {
  comments: CommentTreeNode[];
  loading: boolean;
  articleId: string | undefined;
  onReplySuccess: () => void;
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin />
      </div>
    );
  }

  if (comments.length === 0) {
    return <Empty description="暂无评论" />;
  }

  return (
    <div>
      <Title level={4}>评论</Title>
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            articleId={articleId}
            onReplySuccess={onReplySuccess}
          />
        ))}
      </div>
    </div>
  );
}
