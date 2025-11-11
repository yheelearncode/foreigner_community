package com.nexus.CampusMap.service;

import com.nexus.CampusMap.entity.Event;
import com.nexus.CampusMap.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;

    // ✅ 절대 경로 사용
    private final String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/uploads/";

    public List<Event> getAllEvents() {
        return eventRepository.findAllByOrderByCreatedAtDesc();
    }

    public Event createEvent(Event event, MultipartFile imageFile) {
        // 이미지 업로드 처리
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageUrl = saveImage(imageFile);
                event.setImageUrl(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("이미지 저장 실패: " + e.getMessage());
            }
        }
        
        return eventRepository.save(event);
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("이벤트를 찾을 수 없습니다."));
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    // 이미지 저장 메서드
    private String saveImage(MultipartFile file) throws IOException {
        // ✅ 업로드 디렉토리 생성
        File uploadDirFile = new File(uploadDir);
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs();
            System.out.println("✅ 업로드 디렉토리 생성: " + uploadDir);
        }

        // 파일명 생성 (UUID + 원본 확장자)
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".") 
            ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
            : ".jpg";
        String savedFilename = UUID.randomUUID().toString() + extension;

        // ✅ 파일 저장
        Path filePath = Paths.get(uploadDir + savedFilename);
        Files.write(filePath, file.getBytes());
        
        System.out.println("✅ 이미지 저장 완료: " + filePath.toString());
        System.out.println("✅ 반환 URL: /uploads/" + savedFilename);

        // URL 반환
        return "/uploads/" + savedFilename;
    }
}