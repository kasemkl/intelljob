package com.example.Job_Posting_Service.BaseClasses;

import com.example.Job_Posting_Service.Model.JobPost;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenericRepo<T, ID> extends JpaRepository<T,ID> {

    @Modifying
    @Transactional
    @Query("DELETE FROM Requirement r WHERE r.jobPost.id = :jobPostId")
    void deleteByJobPostId(@Param("jobPostId") Long jobPostId);
}
