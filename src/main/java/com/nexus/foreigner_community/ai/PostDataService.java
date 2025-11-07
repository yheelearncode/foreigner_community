package com.nexus.foreigner_community.ai;

import org.springframework.stereotype.Service;

@Service
public class PostDataService {
    private Object post;

    public void setData(Object data) {
        this.post = data;
    }

    public Object getData() {
        return this.post;
    }
}
