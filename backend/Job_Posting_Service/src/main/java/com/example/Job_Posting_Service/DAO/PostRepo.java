package com.example.Job_Posting_Service.DAO;

import com.example.Job_Posting_Service.BaseClasses.GenericRepo;
import com.example.Job_Posting_Service.Model.JobPost;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepo extends GenericRepo<JobPost, Long> {

    }


