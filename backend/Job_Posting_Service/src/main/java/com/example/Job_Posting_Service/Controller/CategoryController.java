package com.example.Job_Posting_Service.Controller;



import com.example.Job_Posting_Service.BaseClasses.BaseController;

import com.example.Job_Posting_Service.Model.Category;

import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController

@RequestMapping("/categories")

@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})

public class CategoryController extends BaseController<Category, Long> {

    

    @PostMapping("/bulk")

    public List<Category> createCategories(@RequestBody List<Category> categories) {

        return categories.stream()

                .map(category -> super.create(category))

                .toList();

    }

}


