package com.example.Job_Posting_Service.DAO;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GenericRepository<T, ID> extends JpaRepository<T,ID> {
}
