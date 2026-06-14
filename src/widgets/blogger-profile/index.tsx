// src/widgets/blogger-profile/index.tsx

import { Avatar, Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

interface BloggerProfileProps {
  nickname?: string;
  bio?: string;
  avatarUrl?: string;
}

export function BloggerProfile({
  nickname = '博主',
  bio = '欢迎来到我的博客',
  avatarUrl,
}: BloggerProfileProps) {
  return (
    <Card>
      <div className="flex flex-col items-center gap-3">
        <Avatar size={80} src={avatarUrl}>
          {nickname[0]}
        </Avatar>
        <Title level={4} className="m-0">
          {nickname}
        </Title>
        <Paragraph className="m-0 text-text-secondary text-center">
          {bio}
        </Paragraph>
      </div>
    </Card>
  );
}
