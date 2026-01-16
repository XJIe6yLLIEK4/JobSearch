package ru.safronov.jobsearch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VacancyDto {
    private Long id;
    @NotBlank(message = "Название компании должно быть заполнено")
    private String companyName;
    @NotBlank(message = "Название вакансии должно быть заполнено")
    private String vacancyName;
    @Size(max = 1000, message = "Описание должно быть меньше 1000 символов")
    private String description;
}
