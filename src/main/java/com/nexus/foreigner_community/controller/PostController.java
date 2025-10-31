package com.nexus.foreigner_community.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/posts")
public class PostController {

    @GetMapping
    public String posts(Model model) {
        model.addAttribute("title", "게시판");
        return "posts/list";
    }

    @GetMapping("/{id}")
    public String postDetail(@PathVariable Long id, Model model) {
        model.addAttribute("title", "게시글 상세");
        model.addAttribute("postId", id);
        return "posts/detail";
    }

    @GetMapping("/write")
    public String writePost(Model model) {
        model.addAttribute("title", "글쓰기");
        return "posts/write";
    }
}