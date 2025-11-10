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
}

export default function CampusMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [newEventPosition, setNewEventPosition] = useState<{ lat: number, lon: number } | null>(null);
  const [form, setForm] = useState({ title: '', description: '', startsAt: '', endsAt: '' });
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
          // 클릭 이벤트 리스너
          window.kakao.maps.event.addListener(map, 'click', (e: any) => {
            const latlng = e.latLng;
            setNewEventPosition({ lat: latlng.getLat(), lon: latlng.getLng() });
            setShowForm(true);
          });
        });
      }
    };
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
    // eslint-disable-next-line
  }, []);

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
              likes: Math.floor(Math.random()*10+1), // 모킹
              comments: [
                {user: 'Alice', content: '재밌는 행사네요!'},
                {user: 'Bob', content: '위치가 좋아서 가고 싶어요'},
              ] // 모킹
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

  // 이벤트 생성 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      alert('제목과 내용을 입력하세요.');
      return;
    }
    if (!newEventPosition) return;
    const body = {
      ...form,
      lat: newEventPosition.lat,
      lon: newEventPosition.lon,
      creatorId: 1 // 실제 서비스 적용시 로그인 사용자 id 넣어야 함!
    };
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ title: '', description: '', startsAt: '', endsAt: '' });
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
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            로그아웃
          </button>
        </div>
      </div>
      
      {/* 지도 */}
      <div ref={mapRef} style={{ width: "100%", flex: 1 }} />
      
      {/* 이벤트 등록 폼 */}
      {showForm && newEventPosition && (
        <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: 30, borderRadius: 10, minWidth: 350 }}>
            <h3>이벤트 등록</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 1 }}>
                <label>제목<br /><input name="title" value={form.title} onChange={onFormChange} style={{ width: '100%' }} maxLength={64} required /></label>
              </div>
              <div style={{ marginBottom: 1}}>
                <label>내용<br /><textarea name="description" value={form.description} onChange={onFormChange} rows={4} style={{ width: '100%' }} maxLength={500} required /></label>
              </div>
              <div style={{ marginBottom: 1}}>
                <label>시작일시(선택)<br /><input name="startsAt" type="datetime-local" value={form.startsAt} onChange={onFormChange} /></label>
              </div>
              <div style={{ marginBottom: 1 }}>
                <label>종료일시(선택)<br /><input name="endsAt" type="datetime-local" value={form.endsAt} onChange={onFormChange} /></label>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 22, justifyContent: 'right' }}>
                <button type="button" onClick={() => { setShowForm(false); setForm({ title: '', description: '', startsAt: '', endsAt: '' }); setNewEventPosition(null); }}>취소</button>
                <button type="submit">등록</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 상세정보 모달/패널 */}
      {eventDetails && (
        <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ background: 'white', padding: 30, borderRadius: 10, minWidth: 350, maxWidth:500, width: '90%' }}>
            <h3>{eventDetails.title}</h3>
            <div style={{ margin: '10px 0 18px' }}>{eventDetails.description}</div>
            {(eventDetails.startsAt || eventDetails.endsAt) && <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
              {eventDetails.startsAt && <>시작: {eventDetails.startsAt}<br /></>}
              {eventDetails.endsAt && <>종료: {eventDetails.endsAt}</>}
            </div>}
            <div style={{ margin: '10px 0', fontSize: 15 }}>
              <span>❤️ 추천: {eventDetails.likes || 0}</span>
              <button style={{ marginLeft: 15 }} onClick={() => {
                setEventDetails({ ...eventDetails, likes: (eventDetails.likes||0)+1 })
              }}>+추천</button>
            </div>


            
            {/* 댓글 표시 */}


            <div style={{ margin: '20px 0 5px', fontWeight: 'bold' }}>댓글</div>
            <div style={{ maxHeight:80, overflowY:'auto', background:'#f6f6f6', padding:8, marginBottom:10, borderRadius:6}}>
              {(eventDetails.comments||[]).map((c,i)=>(<div key={i}><b style={{fontSize:12}}>{c.user}</b>: {c.content}</div>))}
              {(!eventDetails.comments||eventDetails.comments.length===0) && <div style={{ color: '#888', fontSize:14 }}>아직 댓글이 없습니다.</div>}
            </div>
            <div>
              <input value={comment} placeholder="댓글 작성..." onChange={e=>setComment(e.target.value)} style={{width:'75%',marginRight:5}} maxLength={100} />
              <button onClick={handleAddComment}>등록</button>
            </div>
            <div style={{ textAlign:'right', marginTop:15 }}>
              <button onClick={()=>setEventDetails(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
