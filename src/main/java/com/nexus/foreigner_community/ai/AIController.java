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
		String original_title = "Is Everyone Else Secretly a Genius? A Serious Question About Balancing the Intense Academic Workload vs. Making Local Friends.";
		String original_body = "Hi everyone,\r\n"
				+ "\r\n"
				+ "I'm an international student currently in my second year, and I need a serious reality check, or maybe just some practical advice.\r\n"
				+ "\r\n"
				+ "I feel like I'm constantly running behind. The academic workload at this university is (honestly) much more intense than I expected. I spend the vast majority of my time in the library, completing assignments, and preparing for quizzes or midterms. If I'm not studying, I'm feeling guilty that I should be studying.\r\n"
				+ "\r\n"
				+ "My main problem is this: I really want to join student clubs, go to campus events, and actually make friends with local students (not just other international students in the same situation). But I am finding it almost impossible.\r\n"
				+ "\r\n"
				+ "It seems like all the \"good\" clubs require a huge time commitment (multiple meetings a week, weekend events, etc.) that I just can't afford if I want to keep my grades up. By the time I finish my schoolwork, I'm too exhausted to be social.\r\n"
				+ "\r\n"
				+ "Meanwhile, it looks like all the local students are managing just fine. They're in three clubs, have an active social life, and still seem to be doing well in class.\r\n"
				+ "\r\n"
				+ "This leads to my main questions:\r\n"
				+ "\r\n"
				+ "What am I missing? Is there some secret time-management technique that everyone knows except me?\r\n"
				+ "\r\n"
				+ "How do you actually make friends with local students? It feels like many people already have their established friend groups, and it's difficult to break in, especially when I'm always stressed about academics.\r\n"
				+ "\r\n"
				+ "Are there any \"low-commitment\" ways to get involved in campus life? (I'm looking for things that are more \"casual\" than \"resume-building.\")\r\n"
				+ "\r\n"
				+ "Realistically, how many hours a week do you spend studying versus socializing? I need to know if my current 90% study / 10% social ratio is normal or if I'm doing this all wrong.\r\n"
				+ "\r\n"
				+ "I came here to get a good education, but also to have a new cultural experience and meet people. Right now, I'm only succeeding at the first part.\r\n"
				+ "\r\n"
				+ "Any honest advice on how to find a better balance would be greatly appreciated. Thanks for reading this long post.";
		
		model.addAttribute("title", original_title);
		model.addAttribute("body", original_body);
		
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
		        client.models.generateContent("gemini-2.5-flash", "Make Summary for title:["+original_title+"], body:["+original_body+"] as english", null);

		model.addAttribute("ai", response.text());
		
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