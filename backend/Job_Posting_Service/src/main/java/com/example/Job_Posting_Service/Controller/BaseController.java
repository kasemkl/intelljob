package com.example.Job_Posting_Service.Controller;

import com.example.Job_Posting_Service.Services.GenericService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

public abstract class BaseController<T,ID> {

    @Autowired
    protected GenericService<T, ID> service;

    @GetMapping
    public List<T> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Optional<T> getById(@PathVariable ID id) {
        return service.findById(id);
    }

    @PostMapping
    public T create(@RequestBody T entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public T update(@PathVariable ID id, @RequestBody T entity) {
        if (service.findById(id).isPresent()) {
            return service.save(entity);
        } else {
            throw new RuntimeException("Entity not found with id: " + id);
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable ID id) {
        service.deleteById(id);
    }
}

