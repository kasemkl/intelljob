package com.example.Job_Posting_Service.DAO;

import com.example.Job_Posting_Service.BaseClasses.GenericRepo;
import com.example.Job_Posting_Service.Model.Requirement;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RequirementRepo extends GenericRepo<Requirement,Long> {

}