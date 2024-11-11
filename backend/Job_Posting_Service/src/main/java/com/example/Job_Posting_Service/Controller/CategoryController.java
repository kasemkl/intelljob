package com.example.Job_Posting_Service.Controller;

import com.example.Job_Posting_Service.BaseClasses.BaseController;
import com.example.Job_Posting_Service.Model.Category;
import com.example.Job_Posting_Service.Services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categories")
public class CategoryController extends BaseController<Category, Long> {


}