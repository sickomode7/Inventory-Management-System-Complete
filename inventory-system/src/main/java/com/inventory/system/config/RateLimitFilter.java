package com.inventory.system.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Order(1)
public class RateLimitFilter implements Filter {

    private final Map<String, AtomicInteger> requestCountsPerIpAddress = new ConcurrentHashMap<>();
    private final Map<String, Long> requestWindowStartTimes = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_MINUTE = 100;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        String clientIpAddress = httpServletRequest.getRemoteAddr();

        long currentTime = System.currentTimeMillis();
        requestWindowStartTimes.putIfAbsent(clientIpAddress, currentTime);
        requestCountsPerIpAddress.putIfAbsent(clientIpAddress, new AtomicInteger(0));

        long startTime = requestWindowStartTimes.get(clientIpAddress);
        if (currentTime - startTime > 60000) {
            requestWindowStartTimes.put(clientIpAddress, currentTime);
            requestCountsPerIpAddress.get(clientIpAddress).set(0);
        }

        if (requestCountsPerIpAddress.get(clientIpAddress).incrementAndGet() > MAX_REQUESTS_PER_MINUTE) {
            httpServletResponse.setStatus(HttpStatus.TOO_MANY_REQUESTS);
            httpServletResponse.getWriter().write("Too many requests");
            return;
        }

        chain.doFilter(request, response);
    }

    // Helper to avoid import collision or missing import
    private static class HttpStatus {
        static final int TOO_MANY_REQUESTS = 429;
    }
}
