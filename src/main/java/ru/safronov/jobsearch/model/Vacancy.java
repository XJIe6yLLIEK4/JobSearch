package ru.safronov.jobsearch.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vacancies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Vacancy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;
    @Column(name = "company_name", nullable = false)
    private String companyName;
    @Column (name = "vacancy_name",  nullable = false)
    private String vacancyName;
    @Column (columnDefinition = "text")
    private String description;
}
