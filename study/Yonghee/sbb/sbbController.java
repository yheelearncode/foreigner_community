package com.mysite.sbb;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class sbbController {
    @GetMapping("/sbb")
    @ResponseBody
    public String sbb() {
        return "this is sbb page";
    }

    @GetMapping("/")
    public String root() {
        return "redirect:/question/list";
    }
}
