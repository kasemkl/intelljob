from django.db import models
import requests
from django.conf import settings
from django.core.cache import cache

class Application(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    job_id = models.IntegerField()
    job_seeker_id = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    applied_at = models.DateTimeField(auto_now_add=True)
    similarity_score = models.FloatField(null=True, blank=True)

    def get_job_seeker_details(self):
        cache_key = f'jobseeker_details_{self.job_seeker_id}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data

        try:
            # First get user details
            user_response = requests.get(
                f"{settings.USER_MANAGEMENT_SERVICE_URL}/users/{self.job_seeker_id}/"
            )
            if user_response.status_code != 200:
                return None

            user_data = user_response.json()
            
            # Then get job seeker profile details
            jobseeker_response = requests.get(
                f"{settings.USER_MANAGEMENT_SERVICE_URL}/jobseekers/{self.job_seeker_id}/"
            )
            
            if jobseeker_response.status_code == 200:
                jobseeker_data = jobseeker_response.json()
                combined_data = {
                    "user": {
                        "first_name": user_data.get("first_name"),
                        "last_name": user_data.get("last_name"),
                        "email": user_data.get("email"),
                        "profile_picture": user_data.get("profile_picture"),
                    },
                    "skills": jobseeker_data.get("skills", []),
                    "experience": jobseeker_data.get("experience", []),
                    "education": jobseeker_data.get("education", []),
                    "languages": jobseeker_data.get("languages", []),
                    "certifications": jobseeker_data.get("certifications", []),
                    "linkedin_url": jobseeker_data.get("linkedin_url"),
                    "awards": jobseeker_data.get("awards", []),
                    "companies_worked_at": jobseeker_data.get("companies_worked_at", [])
                }
                # Cache for 5 minutes
                cache.set(cache_key, combined_data, 300)
                return combined_data
            
            basic_data = {
                "user": {
                    "first_name": user_data.get("first_name"),
                    "last_name": user_data.get("last_name"),
                    "email": user_data.get("email"),
                    "profile_picture": user_data.get("profile_picture"),
                }
            }
            cache.set(cache_key, basic_data, 300)
            return basic_data

        except Exception as e:
            print(f"Error fetching job seeker details: {str(e)}")
            return None

    def get_job_details(self):
        cache_key = f'job_details_{self.job_id}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data

        try:
            response = requests.get(
                f"{settings.JOB_POSTING_SERVICE_URL}/jobPostService/{self.job_id}"
            )
            if response.status_code == 200:
                job_data = response.json()
                # Cache for 5 minutes
                cache.set(cache_key, job_data, 300)
                return job_data
            return None
        except Exception as e:
            print(f"Error fetching job details: {str(e)}")
            return None

    class Meta:
        ordering = ['-applied_at']

    def __str__(self):
        return f"Application {self.id} for Job {self.job_id} by User {self.job_seeker_id}"

