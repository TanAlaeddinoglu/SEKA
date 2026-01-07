package com.ambalajwebsite.ambalajwebsite.service;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StorageServiceTest {

    @Mock
    private MinioClient minioClient;

    @Test
    void upload_callsPutObject() throws Exception {
        StorageService service = new StorageService(minioClient, "bucket", 3600);
        MockMultipartFile file = new MockMultipartFile("file", "a.png", "image/png", "data".getBytes());

        service.upload("obj-key", file);

        ArgumentCaptor<PutObjectArgs> captor = ArgumentCaptor.forClass(PutObjectArgs.class);
        verify(minioClient).putObject(captor.capture());
        assertEquals("bucket", captor.getValue().bucket());
        assertEquals("obj-key", captor.getValue().object());
    }

    @Test
    void delete_callsRemoveObject() throws Exception {
        StorageService service = new StorageService(minioClient, "bucket", 3600);

        service.delete("obj-key");

        ArgumentCaptor<RemoveObjectArgs> captor = ArgumentCaptor.forClass(RemoveObjectArgs.class);
        verify(minioClient).removeObject(captor.capture());
        assertEquals("bucket", captor.getValue().bucket());
    }

    @Test
    void presign_returnsUrl() throws Exception {
        StorageService service = new StorageService(minioClient, "bucket", 3600);
        when(minioClient.getPresignedObjectUrl(org.mockito.ArgumentMatchers.any(GetPresignedObjectUrlArgs.class)))
                .thenReturn("url");

        String result = service.presign("obj-key");

        assertEquals("url", result);
    }
}
