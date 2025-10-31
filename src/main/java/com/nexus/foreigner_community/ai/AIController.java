package com.nexus.foreigner_community.ai;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;
import com.google.cloud.translate.*;
import com.google.cloud.translate.Translate.TranslateOption;

@Controller
public class AIController {
	public String get_title() {
		String original_title = "Where is the Software Engineering building?";
    	String original_body = "I'm currently in the Central Library.\nHow do I get to the Software Engineering building from here?";
    	
    	return original_title;
	}
	
	@GetMapping("/ai")
	public String aiHello(Model model) throws IOException {
    	String projectId = "foreigner-community-nexus";
    	
    	Translate translate = TranslateOptions.newBuilder().setProjectId(projectId).build().getService();
    	
    	String original_title = "Where is the Software Engineering building?";
    	String original_body = "I'm currently in the Central Library.\nHow do I get to the Software Engineering building from here?";
    	
    	model.addAttribute("title", original_title);
    	model.addAttribute("body", original_body);
    	
    	Detection detectedLang = translate.detect(original_body);
    	model.addAttribute("detection", "Detected as " + detectedLang.getLanguage() + ", Translated as mn");
    	
		TranslateOption sourceLang = TranslateOption.sourceLanguage(detectedLang.getLanguage());
		TranslateOption targetLang = TranslateOption.targetLanguage("mn");
		
		Translation translated_title = translate.translate(original_title, sourceLang, targetLang);
		Translation translated_body = translate.translate(original_body, sourceLang, targetLang);
		
		model.addAttribute("title", translated_title.getTranslatedText());
		model.addAttribute("body", translated_body.getTranslatedText());
        
		return "ai";
    }
}