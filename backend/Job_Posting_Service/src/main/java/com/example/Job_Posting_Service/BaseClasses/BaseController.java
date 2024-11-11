package com.example.Job_Posting_Service.BaseClasses;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public abstract class BaseController<T,ID> {

  @Autowired
  protected GenericService <T,ID> service1;

    @GetMapping
    public List<T> getAll() {
        return service1.findAll();
    }

    @GetMapping("/{id}")
    public Optional<T> getById(@PathVariable ID id) {
        return service1.findById(id);
    }


    @PostMapping
    public T create(@RequestBody T entity) {
        return service1.save(entity);
    }

    @PutMapping("/{id}")
    public T update(@PathVariable ID id, @RequestBody T entity) {
        if (service1.findById(id).isPresent()) {
            return service1.update(entity,id);
        } else {
            throw new RuntimeException("FROM CONTROLLER :Entity not found with id: " + id);
        }
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable ID id) {
        service1.deleteById(id);
    }

}

