package ru.safronov.jobsearch;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.safronov.jobsearch.exception.ApiError;

@RestControllerAdvice
public class GlobalErrorHandler {

    // 400: ошибки валидации DTO (@Valid)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiError handleValidation(MethodArgumentNotValidException ex) {
        return new ApiError(ex.getBindingResult().getFieldError().getDefaultMessage());
    }

    // 400: кривой JSON / не смогли распарсить тело запроса
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ApiError handleBadJson(HttpMessageNotReadableException ex) {
        return new ApiError(ex.getMessage());
    }

    // 404: сущность не найдена
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(EntityNotFoundException.class)
    public ApiError handleNotFound(EntityNotFoundException ex) {
        return new ApiError(ex.getMessage());
    }

    // 409: конфликт (например, нарушение уникальности)
    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ApiError handleConflict(DataIntegrityViolationException ex) {
        return new ApiError(ex.getMessage());
    }

    // 500: всё остальное
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ApiError handleAny(Exception ex) {
        return new ApiError(ex.getMessage());
    }
}
