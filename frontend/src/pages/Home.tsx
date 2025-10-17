import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryTabs from '../components/post/CategoryTabs';
import PostCard from '../components/post/PostCard';
import './home.css';

const categories = [
  '전체', 'Best', '잡담', '아르바이트', '수강신청', '주거/기숙사', 
  '비자/체류', '캠퍼스생활', '생활/의료', '금융/통신', '비자/이민',
  '맛집/카페', '여행', '진로/취업', '행사/모임', '질문', '건강/피트니스'
];

export default function Home() {
  const navigate = useNavigate(); // 오타 수정!
  const [activeCategory, setActiveCategory] = useState('전체');
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  const handleLogin = () => {
    navigate('/login'); 
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleWritePost = () => {
    navigate('/write');
  };

  return (
    <div className="home-container">
      {/* 헤더 */}
      <header className="header">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '0 20px',
          margin: 0
        }}>
          <h1 
            className="logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            외국인 커뮤니티
          </h1>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleWritePost}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  글쓰기
                </button>
                <span style={{ fontSize: '14px', color: '#666' }}>안녕하세요!</span>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  로그인
                </button>
                <button
                  onClick={handleRegister}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    color: '#007bff',
                    border: '2px solid #007bff',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="main-content">
        <div style={{
          width: '100%',
          padding: '0 20px',
          margin: 0
        }}>
          <CategoryTabs 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryClick}
          />
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '20px',
            alignItems: 'start',
            width: '100%',
            margin: 0,
            padding: 0
          }}>
            {posts.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#999', 
                gridColumn: '1 / -1',
                padding: '80px 20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
              
                <h3 style={{ marginBottom: '10px', fontSize: '24px', color: '#333' }}>
                  
                </h3>
                <p style={{ marginBottom: '30px', fontSize: '16px' }}>
                  첫 번째 게시글을 작성해보세요!
                </p>
                {isLoggedIn && (
                  <button
                    onClick={handleWritePost}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    글쓰기
                  </button>
                )}
              </div>
            ) : (
              posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}