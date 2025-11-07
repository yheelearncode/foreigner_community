package com.nexus.foreigner_community.ai;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;
import java.util.HashMap;
import java.io.IOException;

import com.google.cloud.translate.*;
import com.google.cloud.translate.Translate.TranslateOption;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

@Controller
public class AIController {
	
	@Autowired
    private PostDataService sharedService;
	
	@GetMapping("/ai")
	public String aiHello(Model model) throws IOException {
		String original_title = "Where is the Software Engineering building?";
		String original_body = "I'm currently in the Central Library.\nHow do I get to the Software Engineering building from here?";
		
		// Google Cloud Translation API
		String projectId = "foreigner-community-nexus";
		
		Translate translate = TranslateOptions.newBuilder().setProjectId(projectId).build().getService();
		
		Detection detectedLang = translate.detect(original_body);
		model.addAttribute("detection", "Detected as " + detectedLang.getLanguage() + ", Translated as mn");
		
		TranslateOption sourceLang = TranslateOption.sourceLanguage(detectedLang.getLanguage());
		TranslateOption targetLang = TranslateOption.targetLanguage("mn");
		
		Translation translated_title = translate.translate(original_title, sourceLang, targetLang);
		Translation translated_body = translate.translate(original_body, sourceLang, targetLang);
		
		// Google Gemini API
		Client client = Client.builder().apiKey("AIzaSyDLAZXnAFO33wylYCx4cHs0XCXMwyoNxhg").build();
		
		GenerateContentResponse response =
		        client.models.generateContent("gemini-2.5-flash", "How does AI work?", null);


		// Set original & translated post data
		Map<String, String> box = new HashMap<>();
		
		box.put("original_title", original_title);
		box.put("original_body", original_body);
		box.put("translated_title", translated_title.getTranslatedText());
		box.put("translated_body", translated_body.getTranslatedText());
		
		sharedService.setData(box);
        
		return "ai";
    }
}