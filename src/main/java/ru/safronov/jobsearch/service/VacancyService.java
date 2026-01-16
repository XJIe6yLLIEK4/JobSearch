package ru.safronov.jobsearch.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.safronov.jobsearch.dto.VacancyDto;
import ru.safronov.jobsearch.mapper.VacancyMapper;
import ru.safronov.jobsearch.model.Vacancy;
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

    public VacancyDto getVacancyById(Long id) {
        return mapper.toDto(repository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("Vacancy id: " + id + " not found")));
    }

    @Transactional
    public VacancyDto createVacancy(VacancyDto dto) {
        if (dto.getId() != null) {
            throw new IllegalArgumentException("id must be null for POST");
        }
        return mapper.toDto(repository.save(mapper.toEntity(dto)));
    }

    @Transactional
    public VacancyDto updateVacancy(Long id, VacancyDto dto) {
        Vacancy entity = repository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("Vacancy id: " + id + " not found"));
        entity.setCompanyName(dto.getCompanyName());
        entity.setVacancyName(dto.getVacancyName());
        entity.setDescription(dto.getDescription());
        return mapper.toDto(entity);
    }

    @Transactional
    public VacancyDto deleteVacancy(Long id) {
        Vacancy entity = repository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("Vacancy id: " + id + " not found"));
        repository.delete(entity);
        return mapper.toDto(entity);
    }
}
