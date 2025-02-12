package com.example.Job_Posting_Service.DAO;

import com.example.Job_Posting_Service.BaseClasses.GenericRepo;
import com.example.Job_Posting_Service.Model.Category;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepo extends GenericRepo<Category,Long> {
}
