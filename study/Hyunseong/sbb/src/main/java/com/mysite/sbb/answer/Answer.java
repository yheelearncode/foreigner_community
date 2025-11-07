package com.mysite.sbb.answer;

import java.time.LocalDateTime;
import com.mysite.sbb.question.Question;
import com.mysite.sbb.user.SiteUser; // 6번 자료에서 추가
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createDate;

    @ManyToOne
    private Question question;

    // 6번 자료에서 추가된 속성
    @ManyToOne
    private SiteUser author;

    // 6번 자료에서 추가된 속성
    private LocalDateTime modifyDate;
}