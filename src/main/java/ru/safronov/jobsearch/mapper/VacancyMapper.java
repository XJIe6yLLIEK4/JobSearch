package ru.safronov.jobsearch.mapper;

import org.mapstruct.Mapper;
import ru.safronov.jobsearch.dto.VacancyDto;
import ru.safronov.jobsearch.model.Vacancy;

@Mapper(componentModel = "spring")
public interface VacancyMapper {

    VacancyDto toDto(Vacancy vacancy);

    Vacancy toEntity(VacancyDto dto);
}
