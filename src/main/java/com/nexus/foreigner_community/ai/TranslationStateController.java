package com.nexus.foreigner_community.ai;

import java.util.Map;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
public class TranslationStateController {
	
	@Autowired
    private PostDataService sharedService;
	
	@GetMapping("/change-translation-state")
	public Map<String, String> getNewData() {
		Map<String, String> data = (Map<String, String>) sharedService.getData();
		
		return data;
    }
}
