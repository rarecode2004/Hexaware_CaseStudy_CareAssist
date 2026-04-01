package com.hexaware.careassist_claims.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimDocumentDTO {

    private int documentId;

    @NotNull
    @Min(1)
    private Integer claimId;

    @NotBlank
    @Size(min = 3, max = 100)
    private String fileName;

    @NotBlank
    @Size(min = 5, max = 300)
    private String filePath;
    
    
    private byte[] data;
}


