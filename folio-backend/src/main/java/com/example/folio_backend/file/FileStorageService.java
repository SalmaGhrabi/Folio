package com.example.folio_backend.file;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import static java.io.File.separator;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileStorageService {

    @Value("${application.file.upload.photos-output-path:./uploads}")
    private String fileUploadPath;
    public String saveFile(
            @NonNull MultipartFile sourceFile,
            @NonNull Integer userId) {
        final String fileUploadSubPath = "users" + separator + userId;
        return uploadFile(sourceFile,fileUploadSubPath);
    }

    private String uploadFile(
            @NonNull MultipartFile sourceFile,
            @NonNull String fileUploadSubPath) {
        final String finalUploadPath = fileUploadPath + separator + fileUploadSubPath;
        File targetFolder = new File(finalUploadPath);
        if(!targetFolder.exists()){
            boolean folderCreated = targetFolder.mkdirs();
            if(!folderCreated){
                log.warn("Failed to create the target folder");
                return null;
            }
        }
        final String fileExtension = getFileExtension(sourceFile.getOriginalFilename())
                .replaceAll("[^a-z0-9]", "");
        final String fileName = UUID.randomUUID() + (fileExtension.isBlank() ? "" : "." + fileExtension);
        String targetFilePath = finalUploadPath + separator + fileName;
        Path targetPath = Paths.get(targetFilePath);
        try (java.io.InputStream inputStream = sourceFile.getInputStream()){
            Files.copy(inputStream, targetPath);
            log.info("Successfully saved the file to the target folder : {}", targetFilePath);
            return targetFilePath;
        } catch (IOException e) {
            log.error("Failed to save the file", e);
        }
        return null;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex == -1) {
            return "";
        }
        return fileName.substring(lastDotIndex + 1).toLowerCase();
    }
}
