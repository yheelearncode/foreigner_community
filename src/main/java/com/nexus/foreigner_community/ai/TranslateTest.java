package com.nexus.foreigner_community.ai;

import java.io.IOException;
import com.google.cloud.translate.*;

public class TranslateTest {
	public static void authenticateImplicitWithAdc() throws IOException {
		String project = "foreigner-community-nexus";
	  
		Translate translate = TranslateOptions.newBuilder().setProjectId(project).build().getService();
	
		Translation translation = translate.translate("새가 알에서 나오려고 투쟁하는 것처럼, 우리도 하나의 세계를 깨고 태어나야 한다.");
		System.out.printf("Translated Text:\n\t%s\n", translation.getTranslatedText());
	}
}