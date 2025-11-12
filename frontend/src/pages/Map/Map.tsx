import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import axios from 'axios'; // 백엔드 통신용 라이브러리, 백엔드 연동 시 주석 해제 (npm install axios 필요)
import './Map.css';

// =========================================================================
// 타입 정의
// =========================================================================

// Google Maps 좌표(위도/경도) 타입
interface LatLng {
  lat: number;
  lng: number;
}

// 건물/장소 데이터 타입
interface LocationData {
  id: number;
  name: string; // English Name
  lat: number;
  lng: number;
  description: string;
  category: string;
  nameKo: string; // Korean Name (for display/search)
}

// 게시물 데이터 타입
interface PostData {
  id: number;
  title: string;
  likes: number;
}

interface CustomWindow extends Window {
    google: any;
}
declare const window: CustomWindow;


// 아이콘 사용을 위한 Placeholder (lucide-react 설치 필요)
const MapPin = ({ className }: { className: string }) => <span className={className}>📍</span>;
const Search = ({ className }: { className: string }) => <span className={className}>🔍</span>;
const Globe = ({ className }: { className: string }) => <span className={className}>🌐</span>;
const MessageCircle = ({ className }: { className: string }) => <span className={className}>💬</span>;
const Plus = ({ className }: { className: string }) => <span className={className}>➕</span>;
const Heart = ({ className }: { className: string }) => <span className={className}>❤️</span>;
const ChevronDown = ({ className }: { className: string }) => <span className={className}>🔻</span>;
const ChevronUp = ({ className }: { className: string }) => <span className={className}>🔺</span>;


// =========================================================================
// 프로젝트 설정 및 더미 데이터
// =========================================================================
const GOOGLE_MAPS_API_KEY: string = 'AIzaSyCDxsILUDpeMAgMN1c_oeLKqysbtPO0AZQ'; // API
const CHUNGBUK_CENTER: LatLng = { lat: 36.6276, lng: 127.4578 }; // 지도 중앙 좌표

const DUMMY_LOCATIONS: LocationData[] = [
  { id: 1, name: 'Main Gate', lat: 36.6264, lng: 127.4578, description: 'Chungbuk National University Main Gate.', category: 'Main', nameKo: '정문' },
  { id: 2, name: 'Law School (Building B)', lat: 36.6247, lng: 127.4560, description: 'The law school building.', category: 'Academic', nameKo: '법학전문대학원' },
  { id: 3, name: 'Library (Building A)', lat: 36.6277, lng: 127.4572, description: 'The central library.', category: 'Academic', nameKo: '중앙도서관' },
  { id: 4, name: 'Headquarters (Building C)', lat: 36.6284, lng: 127.4589, description: 'Admin building.', category: 'Admin', nameKo: '본부' },
  { id: 5, name: 'Gaesin Cultural Center', lat: 36.6253, lng: 127.4593, description: 'Cultural events venue.', category: 'Culture', nameKo: '개신문화관' },
];

const DUMMY_POSTS_DB: { [key: number]: PostData[] } = {
    3: [
        { id: 501, title: "[Recommended Route] Fastest shortcut to 3rd floor library", likes: 10 },
        { id: 502, title: "Study room reservation tips and review", likes: 5 },
    ],
    2: [
        { id: 601, title: "Tip to find Law School 501 lecture room", likes: 8 },
    ],
};


// =========================================================================
// 메인 Map 컴포넌트
// =========================================================================
const Map: React.FC = () => {
  // === 지도 관련 Refs & States ===
  const mapRef = useRef<HTMLDivElement>(null);
  const allMarkersRef = useRef<{ [key: number]: any }>({});
  const mapInstanceRef = useRef<any>(null);
  const currentMarkerRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  // === UI & 데이터 상태 ===
  const [selectedBuilding, setSelectedBuilding] = useState<LocationData | null>(null);
  const [openBuildingId, setOpenBuildingId] = useState<number | null>(null);
  const [communityTab, setCommunityTab] = useState<string>('recommend');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [recommendedPosts, setRecommendedPosts] = useState<PostData[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  // 카테고리 목록
  const categories: string[] = useMemo(() => ['All', 'Main', 'Academic', 'Admin', 'Culture'], []); 

  // === 데이터 필터링 ===
  const filteredLocations: LocationData[] = useMemo(() => {
    return DUMMY_LOCATIONS.filter((loc: LocationData) => {
      const matchesCategory: boolean = selectedCategory === 'All' || loc.category === selectedCategory;
      const matchesSearch: boolean = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || loc.nameKo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const filteredLocationIds: Set<number> = useMemo(() => {
    return new Set(filteredLocations.map((loc: LocationData) => loc.id));
  }, [filteredLocations]);


  // =========================================================================
  // 핸들러 (UI 상호작용)
  // =========================================================================

  // 게시물 클릭 핸들러(게시판 상세 페이지로 이동)
  const handlePostClick = useCallback((postId: number): void => {
    console.log(`[ROUTING] Navigating to post ${postId} detail page.`);
    alert(`[ALERT] The board feature is currently under backend development. Request to navigate to post ${postId}.`);
  }, []);
  
  // 정보 공유 버튼 핸들러(게시글 작성 페이지로 이동)
  const handleSharePost = useCallback((buildingName: string): void => {
    console.log(`[ROUTING] Request to navigate to /board/write to share info for ${buildingName}.`);
    alert(`[ALERT] Navigating to post creation page for ${buildingName}.`);
  }, []);


  const fetchPostsForBuilding = useCallback((buildingId: number): void => {
    if (!buildingId) {
        setRecommendedPosts([]);
        return;
    }
    setIsLoadingPosts(true);
    
    setTimeout(() => {
        setRecommendedPosts(DUMMY_POSTS_DB[buildingId] || []);
        setIsLoadingPosts(false);
    }, 300);
  }, [selectedLanguage]); 

  // 건물 마커 또는 목록 항목 클릭 핸들러
  const handleBuildingSelect = useCallback((loc: LocationData): void => {
    // (1) 선택된 건물 상태 업데이트
    setSelectedBuilding(loc);
    
    // (2) 아코디언 토글 로직
    const currentOpenId: number | null = openBuildingId;
    const shouldOpen: boolean = currentOpenId !== loc.id;
    setOpenBuildingId(shouldOpen ? loc.id : null);

    // (3) 지도 이동 로직
    if (window.google && mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: loc.lat, lng: loc.lng });
      mapInstanceRef.current.setZoom(17);
    }
    
    // (4) 커뮤니티 게시물 로드 트리거
    if (shouldOpen) {
        fetchPostsForBuilding(loc.id);
        setCommunityTab('recommend'); // Auto-switch to recommended tab
    } else {
        setRecommendedPosts([]);
    }
  }, [openBuildingId, fetchPostsForBuilding]); 


  // =========================================================================
  // Life Cycles & Google Maps 로직
  // =========================================================================

  // (1) 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setCurrentLocation({ lat: 36.6343, lng: 127.4891 }) // 위치 정보 실패 시 대체 위치
      );
    } else {
      setCurrentLocation({ lat: 36.6343, lng: 127.4891 }); 
    }
  }, []);

  // (2) Google Maps 스크립트 로드
  useEffect(() => {
    if (window.google) {
        setIsMapLoaded(true);
        return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&language=en&region=US&libraries=places`; 
    script.async = true;
    script.defer = true;
    
    script.onload = () => setIsMapLoaded(true);
    script.onerror = () => console.error("Google Maps API Script failed to load.");

    document.head.appendChild(script);

    return () => {
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
    };
  }, []);
  
  // (3) 지도 인스턴스 및 초기 마커 생성
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || mapInstanceRef.current) return;

    // 지도 인스턴스 생성
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: CHUNGBUK_CENTER,
      zoom: 15,
      disableDefaultUI: true, 
      zoomControl: true,
    });
    mapInstanceRef.current = mapInstance; 
    
    // 마커 생성 (모든 장소)
    DUMMY_LOCATIONS.forEach((loc: LocationData) => {
      const marker = new window.google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map: mapInstance,
        title: loc.name,
        visible: true 
      });
      
      // 마커 클릭 이벤트 리스너 등록
      marker.addListener('click', () => {
        handleBuildingSelect(loc); 
      });
      allMarkersRef.current[loc.id] = marker; 
    });

  }, [isMapLoaded, handleBuildingSelect]);

  // (4) 현재 위치 마커 생성 및 업데이트
  useEffect(() => {
      // 지도가 생성되었고, 위치 정보가 업데이트되었을 때 실행
      if (!mapInstanceRef.current || !currentLocation) return;
      
      // 기존 마커가 있으면 제거 (이전 위치 마커)
      if (currentMarkerRef.current) {
          currentMarkerRef.current.setMap(null);
      }

      // 새 마커 생성 및 인스턴스 저장
      const marker = new window.google.maps.Marker({
          position: currentLocation,
          map: mapInstanceRef.current,
          icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" },
          title: "Current Location"
      });
      
      currentMarkerRef.current = marker; // 마커 인스턴스 저장

  }, [currentLocation]); 

  // (4) 마커 가시성 제어 (필터링 또는 검색 시 실행)
  useEffect(() => {
    if (!isMapLoaded) return;
    
    // 필터링된 ID만 보이도록 설정
    Object.keys(allMarkersRef.current).forEach((id: string) => {
        const marker = allMarkersRef.current[parseInt(id)];
        const isVisible = filteredLocationIds.has(parseInt(id));
        marker.setVisible(isVisible);
    });
    
  }, [isMapLoaded, filteredLocationIds]);

  // 지도가 로드되지 않을 때
  if (!isMapLoaded) return <div className="p-4 text-center font-bold">Loading map...</div>;


  // =========================================================================
  // 4. JSX 렌더링 (와이어프레임 UI)
  // =========================================================================

  return (
    <div className="app-container font-sans">
      {/* Tailwind CSS와 사용자 정의 스타일 로드 */}
      <script src="https://cdn.tailwindcss.com"></script>
      
      {/* =================================== */}
      {/* 1. 좌측 사이드바 (와이어프레임 UI) */}
      {/* =================================== */}
      <div className="sidebar">
        
        {/* --- 헤더 --- */}
        <div className="flex justify-between items-center mb-2 border-b pb-3">
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-blue-600"/> Campus Navigator
            </h1>
            {/* 언어 설정 드롭다운 */}
            <select 
                className='custom-select w-28 h-8 text-sm'
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
            >
                <option value="en">🌐 English (Base)</option>
                <option value="mn">🇲🇳 Mongolian</option>
                <option value="zh">🇨🇳 Chinese</option>
                <option value="vi">🇻🇳 Vietnamese</option>
            </select>
        </div>
        
        {/* --- 검색 및 카테고리 --- */}
        <div>
          <h2 className="section-title">Location Search</h2>
          <div className="input-wrapper">
            <span className="icon"><Search className="w-5 h-5"/></span>
            <input
              type="text"
              placeholder="Search Building or Classroom"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="input-wrapper mt-2">
            <select
              className='custom-select'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.slice(1).map((cat: string) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* --- 목적지 정보 패널 --- */}
        <div className="destination-panel">
          <h2 className="text-lg font-bold text-gray-800 mb-2 border-b pb-2">
            Selected Location
          </h2>
          <div className='info'>
            {selectedBuilding ? (
                <>
                    <p className="font-bold text-xl text-blue-600">
                        {selectedBuilding.name}
                    </p>
                    <button 
                        className="route-btn" 
                        onClick={() => handleBuildingSelect(selectedBuilding)}
                    >
                        View Info
                    </button>
                </>
            ) : (
                <p className="text-sm text-gray-500">Select a building from the list.</p>
            )}
          </div>
        </div>
        
        {/* --- 장소 목록(아코디언) --- */}
        <div className="flex-grow flex flex-col">
          <h2 className="section-title flex justify-between items-center">
             <span>Location List ({filteredLocations.length})</span>
          </h2>
          <div className="location-list overflow-y-auto">
            {filteredLocations.length === 0 ? (
                <p className='text-center text-gray-500 text-sm p-4 border rounded-lg bg-gray-50'>No results found.</p>
            ) : (
                filteredLocations.map((loc: LocationData) => (
                  <div className={`accordion-item ${openBuildingId === loc.id ? 'active' : ''}`} key={loc.id}>
                    <div className="accordion-header" onClick={() => handleBuildingSelect(loc)}>
                      <span className='flex items-center text-gray-800'>
                         <MapPin className="w-4 h-4 mr-2 text-red-500"/> {loc.nameKo} ({loc.category})
                      </span>
                      <span>{openBuildingId === loc.id ? <ChevronUp className="w-4 h-4 text-blue-500"/> : <ChevronDown className="w-4 h-4 text-gray-400"/>}</span>
                    </div>
                    
                    {/* 아코디언 콘텐츠(상세 정보) */}
                    {openBuildingId === loc.id && (
                      <div className="accordion-content">
                        <p className='text-sm text-gray-600 mb-4 border-b pb-4'>{loc.description}</p>
                        
                        
                        {/* --- 커뮤니티 추천 탭 --- */}
                        <div className="community-tabs mb-2">
                            <button 
                              className={`tab-btn ${communityTab === 'recommend' ? 'active' : ''}`}
                              onClick={() => setCommunityTab('recommend')}
                            >
                              <MessageCircle className="w-4 h-4 inline mr-1"/> Recommended Route/Info ({isLoadingPosts ? '...' : recommendedPosts.length})
                            </button>
                            <button 
                              className={`tab-btn ${communityTab === 'board' ? 'active' : ''}`}
                              onClick={() => setCommunityTab('board')}
                            >
                              Full Board
                            </button>
                        </div>

                        {/* --- 추천 게시물 목록 --- */}
                        {communityTab === 'recommend' && (
                          <>
                            <div className="post-list-container">
                              {isLoadingPosts ? (
                                <p className="text-sm text-gray-500 p-2 text-center">Loading posts...</p>
                              ) : recommendedPosts.length === 0 ? (
                                <p className="text-sm text-gray-500 p-2 text-center border rounded-lg bg-white">No recommended routes/tips for this location.</p>
                              ) : (
                                <div className="post-list">
                                  {recommendedPosts.map((post: PostData) => (
                                    <div 
                                        className="post-item" 
                                        key={post.id} 
                                        onClick={() => handlePostClick(post.id)}
                                    >
                                      <span className='truncate'>{post.title}</span>
                                      <span className="likes ml-2"><Heart className="w-3 h-3 text-red-500 inline mr-1"/> {post.likes}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            {/* --- 정보 공유 버튼 --- */}
                            <button 
                                onClick={() => handleSharePost(loc.name)}
                                className='share-btn w-full mt-3 text-sm flex items-center justify-center'
                            >
                                <Plus className="w-4 h-4 mr-1"/> Share Info for this Building
                            </button>
                          </>
                        )}
                        
                        {communityTab === 'board' && (
                           <p className="text-sm text-gray-500 p-2 text-center border rounded-lg bg-white">Navigate to the full board to view all posts.</p>
                        )}

                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>

      </div>

      {/* =================================== */}
      {/* 2. 우측 지도 영역 */}
      {/* =================================== */}
      <div className="map-container">
        {/* 지도가 렌더링될 DOM 요소 */}
        <div id="map" ref={mapRef} style={{ width: '100%', height: '100%' }}>
            {!isMapLoaded && (
                <div className="flex items-center justify-center h-full text-xl font-semibold text-gray-600">
                    Loading map...
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Map;