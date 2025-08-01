package com.encryptify.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


    @Controller
    public class FrontendController {
        @RequestMapping(value = {"/{path:[^\\.]*}", "/**/{path:[^\\.]*}", "/"})
        public String redirect() {
            return "forward:/index.html";
        }
    }
