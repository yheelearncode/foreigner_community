interface Post {
  id: number;
  category: string;
  title: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  views: number;
  time: string;
  hasImage?: boolean;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
        자유 / {post.category}
      </div>
      
      <h3 style={{ 
        fontSize: '16px', 
        fontWeight: 'bold', 
        marginBottom: '12px',
        lineHeight: '1.4',
        color: '#333'
      }}>
        {post.title}
      </h3>
      
      <p style={{ 
        fontSize: '14px', 
        color: '#666', 
        lineHeight: '1.5',
        marginBottom: '15px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical' as any,
        height: '63px'
      }}>
        {post.content}
      </p>
      
      <div style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>
        {post.author}
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        fontSize: '12px', 
        color: '#999' 
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          👍 {post.likes}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          💬 {post.comments}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          👁 {post.views}
        </span>
        <span style={{ marginLeft: 'auto', color: '#999' }}>
          {post.time}
        </span>
      </div>
      
      {post.hasImage && (
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          width: '60px',
          height: '60px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          📷
        </div>
      )}
    </div>
  );
}