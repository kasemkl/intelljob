package com.example.Job_Posting_Service.Services;
import com.example.Job_Posting_Service.DAO.PostRepo;
import com.example.Job_Posting_Service.Exceptions.ResourceNotFoundException;
import com.example.Job_Posting_Service.Model.JobPost;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
@Service
public class JobPostService {

    @Autowired
    private PostRepo jobPostRepository;

    // إنشاء منشور جديد
    public JobPost createPost(JobPost jobPost) {
        jobPost.setCreatedAt(LocalDateTime.now());
        return jobPostRepository.save(jobPost);
    }

    // تحديث منشور
    public JobPost updatePost(Integer postId, JobPost updatedPost) {
        JobPost existingPost = jobPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        // تحقق مما إذا كانت الفترة الزمنية أقل من 24 ساعة
        LocalDateTime now = LocalDateTime.now();
        if (existingPost.getCreatedAt().plusDays(1).isBefore(now)) {
            throw new RuntimeException("Post cannot be edited after 24 hours of creation.");
        }

        // تحديث المعلومات
        existingPost.setDescription(updatedPost.getDescription());
        existingPost.setLocation(updatedPost.getLocation());
        existingPost.setStatus(updatedPost.getStatus());
        existingPost.setSalaryRange(updatedPost.getSalaryRange());
        existingPost.setRequirements(updatedPost.getRequirements());
        existingPost.setUpdatedAt(now); // تحديث وقت التعديل

        return jobPostRepository.save(existingPost);
    }


    // حذف منشور
    public void deletePost(Integer postId) {
        jobPostRepository.deleteById(postId);
    }
}

