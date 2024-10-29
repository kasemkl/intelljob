package com.example.Job_Posting_Service.Services;

import com.example.Job_Posting_Service.DAO.GenericRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

public class GenericService<T, ID> {

    @Autowired
    protected GenericRepository<T, ID> repository;

    public List<T> findAll() {
        return repository.findAll();
    }

    public Optional<T> findById(ID id) {
        return repository.findById(id);
    }

    public T save(T entity) {
        return repository.save(entity);
    }

    public void deleteById(ID id) {
        repository.deleteById(id);
    }
}
