package com.nexus.foreigner_community.ai;

import java.util.Map;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class TranslationStateController {
	@GetMapping("/change-translation-state")
	public Map<String, Object> getNewData() {
		Map<String, Object> response = new java.util.HashMap<>();

        response.put("title", "");
        response.put("body", "");

        return response;
    }
}
