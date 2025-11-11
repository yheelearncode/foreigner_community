// window kakao 선언부, React import 유지
import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_MAP_API_KEY = "08a2de71046acd72f7f1c67a474c9e17";

// 상세 정보 모달용 타입
interface EventDetail {
  id: number;
  title: string;
  description: string;
  startsAt?: string;
  endsAt?: string;
  lat: number;
  lon: number;
  likes?: number;
  comments?: {user: string, content: string}[];
  imageUrl?: string; // 이미지 URL 추가
}

export default function CampusMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false); // 추가 모드 토글
  const [newEventPosition, setNewEventPosition] = useState<{ lat: number, lon: number } | null>(null);
  const [form, setForm] = useState({ title: '', description: '', startsAt: '', endsAt: '' });
  const [imageFile, setImageFile] = useState<File | null>(null); // 이미지 파일
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [eventDetails, setEventDetails] = useState<EventDetail | null>(null);
  const [comment, setComment] = useState('');

  // 로그아웃 함수
  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      window.location.href = '/login';
    }
  };

  // 지도 및 마커 초기화
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (window.kakao) {
        window.kakao.maps.load(() => {
          const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(36.632473, 127.453143),
            level: 4,
          });
          setMapInstance(map);
          loadMarkers(map);
          
          // ✅ 추가 모드일 때만 클릭 이벤트 작동
          window.kakao.maps.event.addListener(map, 'click', (e: any) => {
            if (isAddMode) {
              const latlng = e.latLng;
              setNewEventPosition({ lat: latlng.getLat(), lon: latlng.getLng() });
              setShowForm(true);
              setIsAddMode(false); // 등록 후 모드 해제
            }
          });
        });
      }
    };
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [isAddMode]);

  // 새 마커/이벤트 불러오기
  function loadMarkers(map: any) {
    fetch("/api/events")
      .then(res => res.json())
      .then(events => {
        // 기존 마커 지움
        markers.forEach(m => m.setMap(null));
        const newMarkers = events.map((ev: any) => {
          const marker = new window.kakao.maps.Marker({
            map,
            position: new window.kakao.maps.LatLng(ev.lat, ev.lon),
            title: ev.title,
          });
          // 마커 클릭 시 상세 모달 표시
          window.kakao.maps.event.addListener(marker, 'click', () => {
            // 상세정보 API 연동 (현재는 event 자체만)
            setEventDetails({
              id: ev.id,
              title: ev.title,
              description: ev.description,
              lat: ev.lat,
              lon: ev.lon,
              startsAt: ev.startsAt,
              endsAt: ev.endsAt,
              imageUrl: ev.imageUrl,
              likes: ev.likes || 0,
              comments: ev.comments || []
            });
          });
          return marker;
        });
        setMarkers(newMarkers);
      });
  }

  // 폼 변경 핸들러
  const onFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ 이미지 파일 선택
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // 이벤트 생성 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      alert('제목과 내용을 입력하세요.');
      return;
    }
    if (!newEventPosition) return;

    // ✅ FormData로 이미지와 데이터 함께 전송
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('lat', newEventPosition.lat.toString());
    formData.append('lon', newEventPosition.lon.toString());
    formData.append('creatorId', '1');
    if (form.startsAt) formData.append('startsAt', form.startsAt);
    if (form.endsAt) formData.append('endsAt', form.endsAt);
    if (imageFile) formData.append('image', imageFile);

    const res = await fetch('/api/events', {
      method: 'POST',
      body: formData // JSON이 아닌 FormData
    });
    
    if (res.ok) {
      setShowForm(false);
      setForm({ title: '', description: '', startsAt: '', endsAt: '' });
      setImageFile(null);
      setNewEventPosition(null);
      if (mapInstance) loadMarkers(mapInstance);
      alert('이벤트 등록 완료!');
    } else {
      alert('이벤트 등록 실패');
    }
  };

  const handleAddComment = () => {
    if (!comment.trim() || !eventDetails) return;
    setEventDetails({
      ...eventDetails,
      comments: [
        ...(eventDetails.comments || []),
        { user: 'me', content: comment }
      ]
    });
    setComment('');
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 헤더 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        color: 'white'
      }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
          🗺️ 캠퍼스 이벤트 지도
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* ✅ 이벤트 추가 버튼 */}
          <button 
            onClick={() => setIsAddMode(!isAddMode)}
            style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: '8px',
              background: isAddMode ? '#ff6b6b' : 'rgba(255,255,255,0.2)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)'
            }}
          >
            {isAddMode ? '📍 취소' : '➕ 이벤트 추가'}
          </button>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            👤 {localStorage.getItem('userName') || '사용자'}님
          </span>
          <button 
            onClick={handleLogout}
            style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)'
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
      
      {/* ✅ 추가 모드 안내 메시지 */}
      {isAddMode && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#667eea',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          zIndex: 999,
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          📍 지도에서 이벤트 위치를 클릭하세요
        </div>
      )}
      
      {/* 지도 */}
      <div ref={mapRef} style={{ width: "100%", flex: 1 }} />
      
      {/* 이벤트 등록 폼 */}
      {showForm && newEventPosition && (
        <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: 30, borderRadius: 10, minWidth: 400, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>🎉 이벤트 등록</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', marginBottom: 5, fontWeight: '600' }}>제목 *</label>
                <input name="title" value={form.title} onChange={onFormChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} maxLength={64} required />
              </div>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', marginBottom: 5, fontWeight: '600' }}>내용 *</label>
                <textarea name="description" value={form.description} onChange={onFormChange} rows={4} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} maxLength={500} required />
              </div>
              {/* ✅ 이미지 업로드 */}
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', marginBottom: 5, fontWeight: '600' }}>📷 이미지 (선택)</label>
                <input type="file" accept="image/*" onChange={onImageChange} style={{ width: '100%', padding: '8px' }} />
                {imageFile && (
                  <div style={{ marginTop: 10, fontSize: 14, color: '#667eea' }}>
                    ✅ {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', marginBottom: 5, fontWeight: '600' }}>시작일시 (선택)</label>
                <input name="startsAt" type="datetime-local" value={form.startsAt} onChange={onFormChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', marginBottom: 5, fontWeight: '600' }}>종료일시 (선택)</label>
                <input name="endsAt" type="datetime-local" value={form.endsAt} onChange={onFormChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => { 
                  setShowForm(false); 
                  setForm({ title: '', description: '', startsAt: '', endsAt: '' }); 
                  setImageFile(null);
                  setNewEventPosition(null); 
                }} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>
                  취소
                </button>
                <button type="submit" style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#667eea', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* 상세정보 모달 */}
      {eventDetails && (
        <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ background: 'white', padding: 30, borderRadius: 10, minWidth: 400, maxWidth: 600, width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>{eventDetails.title}</h3>
            
            {/* ✅ 이미지 표시 - 백엔드 URL 사용 */}
            {eventDetails.imageUrl && (
              <img 
                src={eventDetails.imageUrl}  // ← /uploads/abc.jpg (프록시 사용)
                alt={eventDetails.title} 
                style={{ 
                  width: '100%', 
                  borderRadius: '8px', 
                  marginBottom: 15,
                  maxHeight: '400px',
                  objectFit: 'cover'
                }} 
                onError={(e) => {
                  console.error('이미지 로드 실패:', eventDetails.imageUrl);
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            
            <div style={{ margin: '10px 0 18px', lineHeight: 1.6 }}>{eventDetails.description}</div>
            {(eventDetails.startsAt || eventDetails.endsAt) && (
              <div style={{ fontSize: 13, color: '#888', marginBottom: 15, background: '#f8f9fa', padding: 10, borderRadius: 6 }}>
                {eventDetails.startsAt && <>📅 시작: {eventDetails.startsAt}<br /></>}
                {eventDetails.endsAt && <>📅 종료: {eventDetails.endsAt}</>}
              </div>
            )}
            <div style={{ margin: '15px 0', fontSize: 15 }}>
              <span style={{ marginRight: 10 }}>❤️ 추천: {eventDetails.likes || 0}</span>
              <button style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: '#ff6b6b', color: 'white', cursor: 'pointer' }} onClick={() => {
                setEventDetails({ ...eventDetails, likes: (eventDetails.likes||0)+1 })
              }}>
                추천하기
              </button>
            </div>

            {/* 댓글 */}
            <div style={{ margin: '20px 0 10px', fontWeight: 'bold', fontSize: 16 }}>💬 댓글 ({eventDetails.comments?.length || 0})</div>
            <div style={{ maxHeight: 120, overflowY: 'auto', background: '#f8f9fa', padding: 12, marginBottom: 15, borderRadius: 8 }}>
              {(eventDetails.comments||[]).map((c,i)=>(
                <div key={i} style={{ marginBottom: 8, padding: 8, background: 'white', borderRadius: 6 }}>
                  <b style={{ fontSize: 13, color: '#667eea' }}>{c.user}</b>: {c.content}
                </div>
              ))}
              {(!eventDetails.comments||eventDetails.comments.length===0) && (
                <div style={{ color: '#888', fontSize: 14, textAlign: 'center', padding: 20 }}>
                  아직 댓글이 없습니다.
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={comment} placeholder="댓글을 입력하세요..." onChange={e=>setComment(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} maxLength={100} />
              <button onClick={handleAddComment} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#667eea', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
                등록
              </button>
            </div>
            <div style={{ textAlign: 'right', marginTop: 20 }}>
              <button onClick={()=>setEventDetails(null)} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
