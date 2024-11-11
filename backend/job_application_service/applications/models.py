from django.db import models

class Application(models.Model):
    job_id = models.IntegerField()             # References Job Post ID in Job Posting Service
    job_seeker_id = models.IntegerField()      # References User ID in User Management Service
    status = models.CharField(
        max_length=20,
        choices=[('submitted', 'Submitted'), ('reviewed', 'Reviewed'), ('rejected', 'Rejected'), ('accepted', 'Accepted')],
        default='submitted'
    )
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application {self.id} for Job {self.job_id} by User {self.job_seeker_id}"
