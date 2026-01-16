package ru.safronov.jobsearch.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/{id}")
    public VacancyDto getVacancyById(@PathVariable Long id) {
        return vacancyService.getVacancyById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VacancyDto createVacancy(@RequestBody @Valid VacancyDto dto) {
        return vacancyService.createVacancy(dto);
    }

    @PutMapping("/{id}")
    public VacancyDto updateVacancy(@RequestBody @Valid VacancyDto dto,
                                    @PathVariable Long id) {
        return vacancyService.updateVacancy(id, dto);
    }

    @DeleteMapping("/{id}")
    public VacancyDto deleteVacancy(@PathVariable Long id) {
        return vacancyService.deleteVacancy(id);
    }
}
