package com.example.sbb.question;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import com.example.sbb.DataNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class QuestionService {
	
	private final QuestionRepository questionRepository;
	
	public Page<Question> getList(int page) {
		Pageable pageable = PageRequest.of(page, 10);
		return this.questionRepository.findAll(pageable);
	}
	
	public List<Question> getList() {
		return this.questionRepository.findAll();
	}
	
	public Question getQuestion(Integer id) {
		Optional<Question> question = this.questionRepository.findById(id);
		if (question.isPresent()) {
			return question.get();
		} else {
			throw new DataNotFoundException("question not found");
		}
	}
	
	public void create(String subject, String content) {
		Question q = new Question();
		q.setSubject(subject);
		q.setContent(content);
		q.setCreateDate(LocalDateTime.now());
		this.questionRepository.save(q);
	}
}