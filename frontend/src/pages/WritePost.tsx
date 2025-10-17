import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  '잡담', '아르바이트', '수강신청', '주거/기숙사', 
  '비자/체류', '캠퍼스생활', '생활/의료', '금융/통신', '비자/이민',
  '맛집/카페', '여행', '진로/취업', '행사/모임', '질문', '건강/피트니스'
];

export default function WritePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('잡담');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category: selectedCategory
        })
      });

      if (response.ok) {
        alert('게시글이 작성되었습니다.');
        navigate('/');
      } else {
        alert('게시글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    if (title.trim() || content.trim()) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* 헤더 */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '20px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button
              onClick={handleGoBack}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              ← 뒤로가기
            </button>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>
              글쓰기
            </h1>
          </div>
          
          <button
            type="submit"
            form="writePostForm"
            disabled={isSubmitting}
            style={{
              padding: '10px 24px',
              backgroundColor: isSubmitting ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            {isSubmitting ? '작성 중...' : '저장'}
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ padding: '40px 20px' }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <form id="writePostForm" onSubmit={handleSubmit}>
            {/* 카테고리 선택 */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '12px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333'
              }}>
                카테고리 <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  minWidth: '200px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* 제목 입력 */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '12px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333'
              }}>
                제목 <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                maxLength={100}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                required
              />
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '8px'
              }}>
                <span style={{ fontSize: '13px', color: '#999' }}>
                  최대 100자까지 입력 가능합니다
                </span>
                <span style={{ 
                  fontSize: '13px', 
                  color: title.length > 90 ? '#dc3545' : '#666',
                  fontWeight: '500'
                }}>
                  {title.length}/100
                </span>
              </div>
            </div>

            {/* 내용 입력 */}
            <div style={{ marginBottom: '40px' }}>
              <label style={{
                display: 'block',
                marginBottom: '12px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333'
              }}>
                내용 <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요&#10;&#10;• 커뮤니티 가이드라인을 준수해주세요&#10;• 타인을 배려하는 글을 작성해주세요"
                style={{
                  width: '100%',
                  minHeight: '400px',
                  padding: '15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  lineHeight: '1.7',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit'
                }}
                maxLength={2000}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                required
              />
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '8px'
              }}>
                <span style={{ fontSize: '13px', color: '#999' }}>
                  최대 2,000자까지 입력 가능합니다
                </span>
                <span style={{ 
                  fontSize: '13px', 
                  color: content.length > 1900 ? '#dc3545' : '#666',
                  fontWeight: '500'
                }}>
                  {content.length}/2,000
                </span>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}