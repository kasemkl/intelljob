package com.example.Job_Posting_Service.BaseClasses;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public abstract class GenericService<T, ID> {

    @Autowired
    private GenericRepo<T, ID> repository1;

    public List<T> findAll() {
        return repository1.findAll();
    }



    public Optional<T> findById(ID id) {
        return repository1.findById(id);
    }

    public T save(T entity) {
        return repository1.save(entity);
    }

    public T update(T entity, ID id) {
        // تحقق أولاً إذا كان الكائن موجودًا في قاعدة البيانات
        Optional<T> existingEntityOpt = repository1.findById(id);
        if (existingEntityOpt.isPresent()) {

            T existingEntity = existingEntityOpt.get();

            // نسخ الحقول من الكائن الجديد إلى الكائن القديم، باستثناء "id"
            BeanUtils.copyProperties(entity, existingEntity, "id");

            // حفظ الكائن المعدل
            return repository1.save(existingEntity);
        } else {
            throw new EntityNotFoundException("Entity not found with ID: " + id);
        }
    }



    public void deleteById(ID id) {
        repository1.deleteById(id);
    }


}
