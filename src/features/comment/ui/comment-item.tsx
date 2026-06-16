// src/features/comment/ui/comment-item.tsx

import { Avatar, Button, Typography } from 'antd';
import { useState } from 'react';

import type { CommentTreeNode } from '@/entities/comment';
import { formatPublishedDate } from '@/entities/article';

import { ReplyForm } from './reply-form';

const { Text, Paragraph } = Typography;

export function CommentItem({
  comment,
  articleId,
  onReplySuccess,
  depth = 0,
}: {
  comment: CommentTreeNode;
  articleId: string | undefined;
  onReplySuccess: () => void;
  depth?: number;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onReplySuccess();
  };

  const replyToPrefix = comment.replyToId ? (
    <Text type="secondary" className="ml-1">
      回复
    </Text>
  ) : null;

  return (
    <div style={depth > 0 ? { marginLeft: Math.min(depth * 6, 12) * 4 } : undefined}>
      <div className="flex gap-3">
        <Avatar src={comment.avatarUrl} size="small">
          {comment.nickname[0]}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Text strong>{comment.nickname}</Text>
            {replyToPrefix}
            <Text type="secondary" className="text-xs">
              {formatPublishedDate(comment.createdAt)}
            </Text>
          </div>
          <Paragraph className="mt-1 mb-1">{comment.content}</Paragraph>
          <Button
            type="link"
            size="small"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            回复
          </Button>

          {showReplyForm && (
            <div className="mt-2">
              <ReplyForm
                articleId={articleId}
                parentId={comment.parentId ?? comment.id}
                replyToId={comment.id}
                onSuccess={handleReplySuccess}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {comment.children.length > 0 && (
            <div className="mt-3 space-y-4">
              {comment.children.map((child) => (
                <CommentItem
                  key={child.id}
                  comment={child}
                  articleId={articleId}
                  onReplySuccess={onReplySuccess}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
