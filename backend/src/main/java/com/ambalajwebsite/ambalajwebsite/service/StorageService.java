package com.ambalajwebsite.ambalajwebsite.service;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;

@Service
public class StorageService {

    private static final Logger log = LoggerFactory.getLogger(StorageService.class);

    private final MinioClient minioClient;          // always internal endpoint (minio:9000)
    private final String bucket;
    private final Integer urlExpirySeconds;
    private final String publicEndpoint;            // browser endpoint (localhost:9000)

    public StorageService(
            MinioClient minioClient,
            @Value("${minio.bucket}") String bucket,
            @Value("${minio.url-expiry-seconds:3600}") Integer urlExpirySeconds,
            @Value("${minio.public-endpoint:http://localhost:9000}") String publicEndpoint
    ) {
        this.minioClient = minioClient;
        this.bucket = bucket;
        this.urlExpirySeconds = urlExpirySeconds;
        this.publicEndpoint = publicEndpoint;
    }

    public void upload(String objectKey, MultipartFile file) throws Exception {
        try (InputStream is = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectKey)
                            .stream(is, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
        } catch (IOException e) {
            throw new IllegalStateException("Failed to read upload for " + objectKey, e);
        }
    }

    public void delete(String objectKey) throws Exception {
        minioClient.removeObject(
                RemoveObjectArgs.builder()
                        .bucket(bucket)
                        .object(objectKey)
                        .build()
        );
    }

    /**
     * Generate presigned URL using internal MinIO endpoint (minio:9000),
     * then rewrite host/port to public endpoint (localhost:9000) so the browser can access it.
     */
    public String presign(String objectKey) throws Exception {
        String presigned = minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .bucket(bucket)
                        .method(Method.GET)
                        .object(objectKey)
                        .expiry(urlExpirySeconds)
                        .build()
        );

        String rewritten = rewriteBase(presigned, publicEndpoint);

        if (log.isDebugEnabled()) {
            try {
                URI u = URI.create(presigned);
                URI r = URI.create(rewritten);
                log.debug(
                        "Presign ok objectKey={} internalHost={} internalPort={} -> publicHost={} publicPort={}",
                        objectKey, u.getHost(), u.getPort(), r.getHost(), r.getPort()
                );
            } catch (Exception ignored) {
            }
        }

        return rewritten;
    }

    private String rewriteBase(String url, String base) {
        if (base == null || base.isBlank()) return url;

        URI u = URI.create(url);
        URI b = URI.create(base);

        String rebuilt = b.getScheme() + "://" + b.getAuthority() + u.getRawPath();
        if (u.getRawQuery() != null) rebuilt += "?" + u.getRawQuery();
        return rebuilt;
    }
}
