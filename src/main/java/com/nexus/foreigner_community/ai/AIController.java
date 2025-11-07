package com.nexus.foreigner_community.ai;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;
import com.google.cloud.translate.*;
import com.google.cloud.translate.Translate.TranslateOption;

@Controller
public class AIController {
    @GetMapping("/ai")
    public String aiHello(Model model) throws IOException {
    	String projectId = "foreigner-community-nexus";
    	
    	Translate translate = TranslateOptions.newBuilder().setProjectId(projectId).build().getService();
    	
    	// TODO: 페이지 내용 인식
    	
    	String text = "Hello!";

    	model.addAttribute("original", text);
		
    	Detection detectedLang = translate.detect(text); 
		
		model.addAttribute("lang", "Detected Language: " + detectedLang);
		
		TranslateOption sourceLang = TranslateOption.sourceLanguage(detectedLang.getLanguage());
		TranslateOption targetLang = TranslateOption.targetLanguage("mn");
		
		Translation translation = translate.translate(text, sourceLang, targetLang);
		
		model.addAttribute("translated", translation.getTranslatedText());
        
		return "ai";
    }
}