package com.example.Job_Posting_Service.Controller;

import com.example.Job_Posting_Service.BaseClasses.BaseController;
import com.example.Job_Posting_Service.Model.JobPost;
import com.example.Job_Posting_Service.Services.JobPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/jobPostService")
public class JobPostingController extends BaseController<JobPost, Long> {



}





