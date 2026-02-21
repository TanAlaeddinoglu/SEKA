package com.ambalajwebsite.ambalajwebsite.service;

import com.ambalajwebsite.ambalajwebsite.exceptions.RateLimitExceededException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ContactMailRateLimiter {

    private static final String UNKNOWN_CLIENT_KEY = "unknown";

    private final int maxRequests;
    private final long windowMillis;
    private final long blockMillis;

    private final Map<String, ClientWindow> clientWindows = new ConcurrentHashMap<>();

    public ContactMailRateLimiter(
            @Value("${app.mail.contact.rate-limit.max-requests:5}") int maxRequests,
            @Value("${app.mail.contact.rate-limit.window-seconds:60}") long windowSeconds,
            @Value("${app.mail.contact.rate-limit.block-seconds:180}") long blockSeconds
    ) {
        this.maxRequests = Math.max(maxRequests, 1);
        this.windowMillis = Math.max(windowSeconds, 1) * 1000;
        this.blockMillis = Math.max(blockSeconds, 1) * 1000;
    }

    public void validate(String clientKey) {
        String key = (clientKey == null || clientKey.isBlank()) ? UNKNOWN_CLIENT_KEY : clientKey.trim();
        long now = System.currentTimeMillis();
        ClientWindow window = clientWindows.computeIfAbsent(key, ignored -> new ClientWindow());

        synchronized (window) {
            if (window.blockedUntilMillis > now) {
                long retryAfter = (window.blockedUntilMillis - now + 999) / 1000;
                throw new RateLimitExceededException(
                        "Cok fazla mail gonderim denemesi yapildi. Lutfen daha sonra tekrar deneyin.",
                        retryAfter
                );
            }

            prune(window.requestTimes, now - windowMillis);
            if (window.requestTimes.size() >= maxRequests) {
                window.blockedUntilMillis = now + blockMillis;
                throw new RateLimitExceededException(
                        "Kisa surede cok fazla mail gonderildi. Lutfen daha sonra tekrar deneyin.",
                        blockMillis / 1000
                );
            }

            window.requestTimes.addLast(now);
        }
    }

    private void prune(Deque<Long> requestTimes, long threshold) {
        while (!requestTimes.isEmpty() && requestTimes.peekFirst() < threshold) {
            requestTimes.pollFirst();
        }
    }

    private static final class ClientWindow {
        private final Deque<Long> requestTimes = new ArrayDeque<>();
        private long blockedUntilMillis;
    }
}
