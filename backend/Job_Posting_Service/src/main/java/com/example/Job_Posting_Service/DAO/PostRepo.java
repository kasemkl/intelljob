package com.example.Job_Posting_Service.DAO;

import com.example.Job_Posting_Service.BaseClasses.GenericRepo;
import com.example.Job_Posting_Service.Model.JobPost;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepo extends GenericRepo<JobPost, Long> {

    List<JobPost> findByCompanyId(Long companyId);
    List<JobPost> findByLocationId(Long LocationId);

    // البحث عن المنشورات حسب الفئة
    @Query("SELECT j FROM JobPost j JOIN j.categories c WHERE c.id = :categoryId")
    List<JobPost> findByCategoryId(@Param("categoryId") Long categoryId);
    }


