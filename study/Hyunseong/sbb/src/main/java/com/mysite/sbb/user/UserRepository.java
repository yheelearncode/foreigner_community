//package com.mysite.sbb.user;
//
//import java.util.Optional; // 6번 자료에서 추가
//import org.springframework.data.jpa.repository.JpaRepository;
//
//public interface UserRepository extends JpaRepository<SiteUser, Long> {
//    // 6번 자료에서 추가
//    Optional<SiteUser> findByUsername(String username);
//}