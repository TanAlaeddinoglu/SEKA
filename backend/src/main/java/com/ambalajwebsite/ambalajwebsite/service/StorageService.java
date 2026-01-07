package com.ambalajwebsite.ambalajwebsite.service;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class StorageService {

    private final MinioClient minioClient;
    private final String bucket;
    private final Integer urlExpirySeconds;

    public StorageService(MinioClient minioClient,
                          @Value("${minio.bucket}") String bucket,
                          @Value("${minio.url-expiry-seconds}") Integer urlExpirySeconds) {
        this.minioClient = minioClient;
        this.bucket = bucket;
        this.urlExpirySeconds = urlExpirySeconds;
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

    public String presign(String objectKey) throws Exception {
        return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .bucket(bucket)
                        .method(Method.GET)
                        .object(objectKey)
                        .expiry(urlExpirySeconds)
                        .build()
        );
    }
}
