//package com.mysite.sbb.user;
//
//import java.util.Optional; // 6번 자료에서 추가
//import com.mysite.sbb.DataNotFoundException; // 6번 자료에서 추가
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import lombok.RequiredArgsConstructor;
//
//@RequiredArgsConstructor
//@Service
//public class UserService {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    public SiteUser create(String username, String email, String password) {
//        SiteUser user = new SiteUser();
//        user.setUsername(username);
//        user.setEmail(email);
//        user.setPassword(passwordEncoder.encode(password));
//        this.userRepository.save(user);
//        return user;
//    }
//
//    // 6번 자료에서 추가된 메서드
//    public SiteUser getUser(String username) {
//        Optional<SiteUser> siteUser = this.userRepository.findByUsername(username);
//        if (siteUser.isPresent()) {
//            return siteUser.get();
//        } else {
//            throw new DataNotFoundException("siteuser not found");
//        }
//    }
//}