package com.mysite.sbb;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class RecapCh1Controller {
    @GetMapping("/recapCh1")
    @ResponseBody
    public String recapCh1() {return "1장 완료!";}
}
