package com.zara.interpreter.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Forwards all non-API, non-static routes to React's index.html
 * so that client-side routing works correctly after deployment.
 */
@Controller
public class SpaController {

    @RequestMapping(value = {
        "/",
        "/{path:[^\\.]*}",
        "/{path:[^\\.]*}/{subpath:[^\\.]*}"
    })
    public String forward(HttpServletRequest request) {
        return "forward:/index.html";
    }
}
