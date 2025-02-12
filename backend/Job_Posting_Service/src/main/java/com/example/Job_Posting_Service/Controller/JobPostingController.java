package com.example.Job_Posting_Service.Controller;

import com.example.Job_Posting_Service.BaseClasses.BaseController;
import com.example.Job_Posting_Service.BaseClasses.GenericRepo;
import com.example.Job_Posting_Service.DAO.PostRepo;
import com.example.Job_Posting_Service.Model.JobPost;
import com.example.Job_Posting_Service.Services.JobPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/jobPostService")
public class JobPostingController extends BaseController<JobPost, Long> {


    @Autowired
    PostRepo jobPostRepo;

    @GetMapping("/getByLocationId/{id}")
    public List<JobPost> findByLocationId(@PathVariable("id") Long id) {
        return jobPostRepo.findByLocationId(id);

    }

    @GetMapping("/getByCompanyId/{id}")
    public List<JobPost> getByCompanyId(@PathVariable("id") Long id) {
        return jobPostRepo.findByCompanyId(id);
    }
    @GetMapping("/getByCategory/{id}")
    public List<JobPost> getByCategoryId(@PathVariable("id") Long id) {
        return jobPostRepo.findByCategoryId(id);
    }

}





