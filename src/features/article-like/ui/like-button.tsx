// src/features/article-like/ui/like-button.tsx

import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Button, Spin, Typography } from 'antd';

import { useArticleLike } from '../application/use-article-like';

const { Text } = Typography;

export function LikeButton({ articleId }: { articleId: string | undefined }) {
  const { isLiked, likeCount, loading, toggling, toggleLike } = useArticleLike(articleId);

  if (loading) {
    return <Spin size="small" />;
  }

  return (
    <Button
      type="text"
      icon={isLiked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
      onClick={toggleLike}
      loading={toggling}
      className="flex items-center gap-1"
    >
      <Text type={isLiked ? 'danger' : 'secondary'}>{likeCount}</Text>
    </Button>
  );
}
