package com.ambalajwebsite.ambalajwebsite.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.errors.MinioException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Qualifier;

@Configuration
public class MinioConfig {

    private static final Logger log = LoggerFactory.getLogger(MinioConfig.class);

    @Value("${minio.endpoint}")
    private String endpoint;

    @Value("${minio.access-key}")
    private String accessKey;

    @Value("${minio.secret-key}")
    private String secretKey;

    @Value("${minio.bucket}")
    private String bucket;

    @Bean
    public MinioClient minioClient() {
        log.debug("MinIO internal endpoint: {}", endpoint);
        return MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }

    @Bean
    public MinioClient minioPublicClient(
            @Value("${minio.public-endpoint:}") String publicEndpoint
    ) {
        String endpointToUse = publicEndpoint == null || publicEndpoint.isBlank()
                ? endpoint
                : publicEndpoint;
        log.debug("MinIO public endpoint: {}", endpointToUse);
        return MinioClient.builder()
                .endpoint(endpointToUse)
                .credentials(accessKey, secretKey)
                .build();
    }

    @Bean
    public CommandLineRunner minioBucketInitializer(@Qualifier("minioClient") MinioClient client) {
        return args -> {
            try {
                boolean exists = client.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
                if (!exists) {
                    client.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
                    log.info("Created MinIO bucket {}", bucket);
                }
            } catch (MinioException e) {
                log.error("MinIO error ensuring bucket {}", bucket, e);
                throw new IllegalStateException("Unable to initialize MinIO bucket " + bucket, e);
            } catch (Exception e) {
                log.error("Error ensuring MinIO bucket {}", bucket, e);
                throw new IllegalStateException("Unable to initialize MinIO bucket " + bucket, e);
            }
        };
    }
}
