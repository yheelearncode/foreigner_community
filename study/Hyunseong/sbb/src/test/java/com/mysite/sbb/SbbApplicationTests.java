package com.mysite.sbb;

// (기존 import문 생략)
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.mysite.sbb.question.QuestionService; // 5번 자료에서 QuestionService로 변경

@SpringBootTest
class SbbApplicationTests {

    @Autowired
    private QuestionService questionService; // 5번 자료에서 QuestionService로 변경

//    @Test
//    void testJpa() {
//        for (int i = 1; i <= 300; i++) {
//            String subject = String.format("테스트 데이터입니다:[%03d]", i);
//            String content = "내용 없음 ";
//            this.questionService.create(subject, content);
//        }
//    }
}