package com.example.Job_Posting_Service.Controller;

import com.example.Job_Posting_Service.Model.JobPost;
import com.example.Job_Posting_Service.Services.JobPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/jobPostService")
public class JobPostingController {


    @Autowired
    private JobPostService jobPostService;

    // إنشاء منشور جديد
    @PostMapping
    public ResponseEntity<JobPost> createPost(@RequestBody JobPost jobPost) {
        JobPost createdPost = jobPostService.createPost(jobPost);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    // تحديث منشور
    @PutMapping("/{postId}")
    public ResponseEntity<JobPost> updatePost(@PathVariable Integer postId, @RequestBody JobPost updatedPost) {
        JobPost post = jobPostService.updatePost(postId, updatedPost);
        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    // حذف منشور
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Integer postId) {
        jobPostService.deletePost(postId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}



