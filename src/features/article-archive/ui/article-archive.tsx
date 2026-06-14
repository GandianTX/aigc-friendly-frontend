// src/features/article-archive/ui/article-archive.tsx

import { Card, Empty, List, Spin, Tag } from 'antd';
import { useNavigate } from 'react-router';

import { type ArchiveDTO } from '..';

interface ArticleArchiveProps {
  archives: ArchiveDTO[];
  loading: boolean;
  error: string | null;
}

export function ArticleArchive({ archives, loading, error }: ArticleArchiveProps) {
  const navigate = useNavigate();

  if (error) {
    return <Empty description={error} />;
  }

  // 按年份分组
  const grouped = archives.reduce<Record<number, ArchiveDTO[]>>((acc, item) => {
    if (!acc[item.year]) {
      acc[item.year] = [];
    }
    acc[item.year].push(item);
    return acc;
  }, {});

  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <Spin spinning={loading}>
      <List
        dataSource={years}
        locale={{ emptyText: <Empty description="暂无归档" /> }}
        renderItem={(year) => (
          <List.Item>
            <Card title={`${year} 年`} style={{ width: '100%' }} size="small">
              <div className="flex flex-wrap gap-2">
                {grouped[year].map((item) => (
                  <Tag
                    key={`${item.year}-${item.month}`}
                    color="blue"
                    className="cursor-pointer"
                    onClick={() => navigate(`/blog/archive/${item.year}/${item.month}`)}
                  >
                    {item.month} 月 ({item.count})
                  </Tag>
                ))}
              </div>
            </Card>
          </List.Item>
        )}
      />
    </Spin>
  );
}
