package com.mysite.sbb;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
//
//import com.mysite.sbb.question.QuestionService; // 5번 자료에서 QuestionService로 변경
//
@SpringBootTest
class SbbApplicationTests {

    @Autowired
    private QuestionRepository/*Service*/ questionRepository;//Service;

    @Test
    void testJpa() {
    	Question q1 = new Question();
    	q1.setSubject("SBB?");
    	q1.setContent("what is SBB?");
    	q1.setCreateDate(LocalDateTime.now());
    	this.questionRepository.save(q1);
    	
    	Question q2 = new Question();
    	q2.setSubject("SB Model?");
    	q2.setContent("Is ID Auto?");
    	q2.setCreateDate(LocalDateTime.now());
    	this.questionRepository.save(q2);
//        for (int i = 1; i <= 300; i++) {
//            String subject = String.format("테스트 데이터입니다:[%03d]", i);
//            String content = "내용 없음 ";
//            this.questionService.create(subject, content);
//        }
    }
}