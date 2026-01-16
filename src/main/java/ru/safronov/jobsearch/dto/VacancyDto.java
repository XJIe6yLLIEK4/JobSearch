package ru.safronov.jobsearch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VacancyDto {
    private Long id;
    private String companyName;
    private String vacancyName;
    private String description;
}
