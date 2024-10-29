package com.example.Job_Posting_Service.DAO;

import com.example.Job_Posting_Service.Model.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepo extends JpaRepository<JobPost,Integer> {

}
