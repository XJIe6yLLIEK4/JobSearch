package ru.safronov.jobsearch.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.safronov.jobsearch.dto.VacancyDto;
import ru.safronov.jobsearch.mapper.VacancyMapper;
import ru.safronov.jobsearch.repository.VacancyRepository;

import java.util.Collection;

@Service
@RequiredArgsConstructor
public class VacancyService {
    private final VacancyRepository repository;
    private final VacancyMapper mapper;

    public Collection<VacancyDto> getAllVacancy() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    public VacancyDto createVacancy(VacancyDto dto) {
        return mapper.toDto(repository.save(mapper.toEntity(dto)));
    }
}
