package com.mysite.sbb.user;

import lombok.Getter;

@Getter
public enum UserRole {
    ADMIN("ROLE_ADMIN"),
    USER("ROLE_USER");

    UserRole(String value) {
        this.value = value;
    }

    private String value;
}

/*파일 생성 groovy로 되어서 문제였음 (패키지 -> 우클릭 enum으로 하니까 왠지 모르겠는데 그루비 파일 만들어짐) java로 해야함.*/
