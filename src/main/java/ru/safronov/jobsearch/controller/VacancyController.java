package ru.safronov.jobsearch.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.safronov.jobsearch.dto.VacancyDto;
import ru.safronov.jobsearch.service.VacancyService;

import java.util.Collection;

@RestController
@RequestMapping("/vacancy")
@RequiredArgsConstructor
public class VacancyController {
    private final VacancyService vacancyService;

    @GetMapping
    public Collection<VacancyDto> getAllVacancy() {
        return vacancyService.getAllVacancy();
    }

    @PostMapping
    public VacancyDto createVacancy(@RequestBody @Valid VacancyDto dto) {
        return vacancyService.createVacancy(dto);
    }
}
