package com.inventory.system.controller;

import com.inventory.system.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    @Autowired
    FileStorageService fileStorageService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);

        Map<String, String> response = new HashMap<>();
        response.put("fileName", fileName);
        response.put("message", "File uploaded successfully");

        return ResponseEntity.ok(response);
    }
}
