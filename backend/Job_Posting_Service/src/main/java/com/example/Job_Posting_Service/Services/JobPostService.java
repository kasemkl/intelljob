package com.example.Job_Posting_Service.Services;

import com.example.Job_Posting_Service.BaseClasses.GenericRepo;
import com.example.Job_Posting_Service.BaseClasses.GenericService;
import com.example.Job_Posting_Service.DAO.PostRepo;
import com.example.Job_Posting_Service.Model.Category;
import com.example.Job_Posting_Service.Model.JobPost;
import com.example.Job_Posting_Service.Model.Requirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class JobPostService extends GenericService<JobPost,Long> {

    @Autowired
    private GenericRepo<Requirement, Long> requirementRepo;

    @Autowired
    private GenericRepo<Category, Long> categoryRepo;


    @Override
    public JobPost save(JobPost jobPost) {

        JobPost newJobPost = new JobPost();

        newJobPost.setDescription(jobPost.getDescription());
        newJobPost.setCompanyId(jobPost.getCompanyId());
        newJobPost.setLocation(jobPost.getLocation());
        newJobPost.setStatus(jobPost.getStatus());
        newJobPost.setSalaryRange(jobPost.getSalaryRange());
        newJobPost.setTitle(jobPost.getTitle());
        newJobPost.setPostDate(jobPost.getPostDate());
        newJobPost.setCreatedAt(LocalDateTime.now());



        if (jobPost.getCategories().isEmpty()) {
            throw new IllegalArgumentException("Job Post must have at least one category.");
        }

        // التحقق من وجود الفئات في قاعدة البيانات
        List<Category> validCategories = new ArrayList<>();
        for (Category category : jobPost.getCategories()) {
            // تحقق إذا كانت الفئة موجودة في قاعدة البيانات
            Optional<Category> existingCategory = categoryRepo.findById(category.getId());
            if (existingCategory.isPresent()) {
                validCategories.add(existingCategory.get());
            } else {
                // يمكن هنا التعامل مع الفئات غير الموجودة حسب الحاجة، إما بإرجاع خطأ أو إضافتها
                throw new IllegalArgumentException("Category with ID " + category.getId() + " does not exist.");
            }
        }

        // تعيين الفئات الصحيحة التي تم التحقق منها إلى JobPost
        newJobPost.setCategories(validCategories);

        super.save(newJobPost);

        for (Requirement requirement : jobPost.getRequirements()) {
            requirement.setJobPost(newJobPost);
            requirementRepo.save(requirement);
        }

        return newJobPost;
    }




    @Override
    public JobPost update(JobPost newjobPost, Long jobPostId) {
        // البحث عن الـ JobPost باستخدام الـ ID

        Optional<JobPost> existingJobPostOpt = super.findById(jobPostId);

        if (existingJobPostOpt.isEmpty()) {
            throw new IllegalArgumentException("FROM SERVICE : Job Post with ID " + jobPostId + " does not exist.");
        }

        // الحصول على الـ JobPost الحالي
        JobPost existingJobPost = existingJobPostOpt.get();

        // التحقق من أن مدة التعديل لم تتجاوز 24 ساعة من تاريخ النشر
        LocalDate postDate = existingJobPost.getPostDate();
        LocalDateTime currentDate = LocalDateTime.now();
        if (existingJobPost.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Job Post can only be modified within 24 hours of posting.");
        }

        // تحديث الحقول الخاصة بـ JobPost
        existingJobPost.setDescription(newjobPost.getDescription());
        existingJobPost.setCompanyId(newjobPost.getCompanyId());
        existingJobPost.setLocation(newjobPost.getLocation());
        existingJobPost.setStatus(newjobPost.getStatus());
        existingJobPost.setSalaryRange(newjobPost.getSalaryRange());
        existingJobPost.setTitle(newjobPost.getTitle());
        existingJobPost.setUpdatedAt(LocalDateTime.now());
          // تحديث تاريخ الإنشاء أو إبقائه كما هو إذا كان التاريخ القديم هو المهم

        // التحقق من وجود الفئات
        if (newjobPost.getCategories().isEmpty()) {
            throw new IllegalArgumentException("Job Post must have at least one category.");
        }

        // التحقق من وجود الفئات في قاعدة البيانات
        List<Category> validCategories = new ArrayList<>();
        for (Category category : newjobPost.getCategories()) {
            Optional<Category> existingCategory = categoryRepo.findById(category.getId());
            if (existingCategory.isPresent()) {
                validCategories.add(existingCategory.get());
            } else {
                throw new IllegalArgumentException("Category with ID " + category.getId() + " does not exist.");
            }
        }

        // تعيين الفئات الصحيحة إلى الـ JobPost الحالي
        existingJobPost.setCategories(validCategories);

        // حفظ الـ JobPost المعدل
        super.save(existingJobPost);


        // تحديث المتطلبات (Requirements)
        requirementRepo.deleteByJobPostId(jobPostId);

        for (Requirement requirement : newjobPost.getRequirements()) {
            requirement.setJobPost(existingJobPost);
            requirementRepo.save(requirement);
        }

        return existingJobPost;
    }


}





