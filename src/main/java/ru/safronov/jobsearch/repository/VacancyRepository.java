package ru.safronov.jobsearch.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.safronov.jobsearch.model.Vacancy;

@Repository
public interface VacancyRepository extends JpaRepository<Vacancy, Long> {
}
