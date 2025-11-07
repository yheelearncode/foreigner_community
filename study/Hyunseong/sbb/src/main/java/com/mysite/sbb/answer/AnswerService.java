package com.mysite.sbb.answer;

import java.time.LocalDateTime;
import java.util.Optional; // 6번 자료에서 추가

import com.mysite.sbb.DataNotFoundException; // 6번 자료에서 추가
import com.mysite.sbb.question.Question;
import com.mysite.sbb.user.SiteUser;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AnswerService {

    private final AnswerRepository answerRepository;

    // 6번 자료에서 SiteUser 매개변수 추가
    public void create(Question question, String content, SiteUser author) {
        Answer answer = new Answer();
        answer.setContent(content);
        answer.setCreateDate(LocalDateTime.now());
        answer.setQuestion(question);
        answer.setAuthor(author); // 6번 자료에서 추가
        this.answerRepository.save(answer);
    }

    // 6번 자료에서 추가된 메서드 (조회)
    public Answer getAnswer(Integer id) {
        Optional<Answer> answer = this.answerRepository.findById(id);
        if (answer.isPresent()) {
            return answer.get();
        } else {
            throw new DataNotFoundException("answer not found");
        }
    }

    // 6번 자료에서 추가된 메서드 (수정)
    public void modify(Answer answer, String content) {
        answer.setContent(content);
        answer.setModifyDate(LocalDateTime.now());
        this.answerRepository.save(answer);
    }

    // 6번 자료에서 추가된 메서드 (삭제)
    public void delete(Answer answer) {
        this.answerRepository.delete(answer);
    }
}