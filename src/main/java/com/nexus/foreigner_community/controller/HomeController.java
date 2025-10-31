package com.nexus.foreigner_community.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("name", "Yonghee");
        return "index";
    }

    @GetMapping("/about")
    public String about(Model model) {
        return "about";
    }


}