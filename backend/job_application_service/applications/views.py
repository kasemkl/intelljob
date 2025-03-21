from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from .models import Application
from .serializers import ApplicationSerializer, ApplicationStatusUpdateSerializer
import requests
from django.conf import settings
from .utils import verify_jwt  # Import the JWT validation helper function
from django.core.cache import cache
from django.db.models import Q
import json


class ApplyForJobView(APIView):
    def post(self, request):
        # Validate JWT and extract user info
        
        token = request.headers.get("Authorization")
        if not token:
            return Response({"error": "Authorization token missing"}, status=status.HTTP_401_UNAUTHORIZED)

        token = token.split(" ")[1]  # Extract token from "Bearer <token>"
        user_data = verify_jwt(token)
        user_id = user_data["user_id"]
        user_role = user_data["role"]

        # Ensure the user is a job seeker
        if user_role != "job_seeker":
            return Response({"error": "Only job seekers can apply for jobs"}, status=status.HTTP_403_FORBIDDEN)

        # Extract job_id from request data
        job_id = request.data.get("job_id")
        if not job_id:
            return Response({"error": "Job ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if already applied
        if self.has_already_applied(user_id, job_id):
            return Response({"error": "You have already applied for this job"}, status=status.HTTP_400_BAD_REQUEST)

        # Verify the job exists and is still open
        job_status = self.verify_job_status(job_id)
        if not job_status.get('exists'):
            return Response({"error": "Job does not exist"}, status=status.HTTP_404_NOT_FOUND)
      
        # Calculate similarity score (assuming you have this logic)
        similarity_score = request.data.get("similarity_score")

        # Create the application
        application_data = {
            "job_id": job_id,
            "job_seeker_id": user_id,
            "status": "submitted",
            "similarity_score": similarity_score,
        }
        serializer = ApplicationSerializer(data=application_data)
        if serializer.is_valid():
            serializer.save()

            # Send notification via HTTP request
           
        job_title=request.data.get('job_title')
        print(job_status)
        notification_data = {
                    "user_id": job_status.get('company_id'),
                    "message": f"A new application has been submitted for {job_status.get('title')}.",
                    "role":"company"
                }
        print(notification_data)
        notification_response = requests.post(
                    f"{settings.NOTIFICATION_SERVICE_URL}notifications/notifications/",
                    json=notification_data
                )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        ##return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        # Validate JWT and extract user info
        token = request.headers.get("Authorization")
        if not token:
            return Response({"error": "Authorization token missing"}, status=status.HTTP_401_UNAUTHORIZED)

        token = token.split(" ")[1]  # Extract token from "Bearer <token>"
        user_data = verify_jwt(token)
        user_role = user_data["role"]

        # # Ensure the user is a job seeker
        # if user_role != "job_seeker":
        #     return Response({"error": "Only job seekers can view job applications"}, status=status.HTTP_403_FORBIDDEN)

        # Get job_id from query parameters
        # job_id = request.query_params.get("job_id")
        # if not job_id:
        #     return Response({"error": "Job ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        # # Verify the job exists
        # job_status = self.verify_job_status(job_id)
        # if not job_status.get('exists'):
        #     return Response({"error": "Job does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Retrieve applications for the given job_id
        applications = Application.objects.all()
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def has_already_applied(self, job_seeker_id, job_id):
        return Application.objects.filter(job_seeker_id=job_seeker_id, job_id=job_id).exists()

    def verify_job_status(self, job_id):
        try:
            response = requests.get(f"{settings.JOB_POSTING_SERVICE_URL}/jobPostService/{job_id}")
            if response.status_code == 200:
                job_data = response.json()
                print('posttttttttttt',job_data)
                return {'exists': True, 'is_open': job_data.get('status') == 'ACTIVE','company_id':job_data.get('companyId'),'title':job_data.get('title')}
            return {'exists': False, 'is_open': False}
        except Exception:
            return {'exists': False, 'is_open': False}


class ApplicationStatusView(APIView):
    def get(self, request, application_id):
        # Validate JWT and extract user info
        token = request.headers.get("Authorization")
        if not token:
            return Response({"error": "Authorization token missing"}, status=status.HTTP_401_UNAUTHORIZED)

        token = token.split(" ")[1]
        user_data = verify_jwt(token)
        user_id = user_data["user_id"]

        # Retrieve the application
        try:
            application = Application.objects.get(id=application_id)
            serializer = ApplicationSerializer(application)
            return Response(serializer.data)
        except Application.DoesNotExist:
            return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)


class UpdateApplicationStatusView(APIView):
    def put(self, request, application_id):
        # Validate JWT and extract user info
        token = request.headers.get("Authorization")
        if not token:
            return Response({"error": "Authorization token missing"}, status=status.HTTP_401_UNAUTHORIZED)
        print("hellllooooo")
        token = token.split(" ")[1]
        user_data = verify_jwt(token)
        user_id = user_data["user_id"]
        user_role = user_data["role"]

        # Ensure the user is a company representative
        if user_role != "company":
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        # Update the application status
        try:
            application = Application.objects.get(id=application_id)
            serializer = ApplicationStatusUpdateSerializer(application, data=request.data)
            print(application.job_seeker_id)
            if serializer.is_valid():
                serializer.save()

                # Retrieve job details
            job_details = application.get_job_details()
            if not job_details:
                    return Response({"error": "Job details not found"}, status=status.HTTP_404_NOT_FOUND)

                # Send notification to the job seeker
            notification_data = {
                    "user_id": application.job_seeker_id,
                    "message": f"Your application status for job ID {job_details['title']} has been updated to {application.status}.",
                    "role": "job_seeker"
                }
            notification_response = requests.post(
                    f"http://localhost:8000/api/notifications/notifications/",
                    json=notification_data
                )
            return Response({"message": "Application status updated"}, status=status.HTTP_200_OK)
            ##return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Application.DoesNotExist:
            return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)


class ApplicationListView(APIView):
    def get(self, request):
        token = request.headers.get("Authorization")
        if not token:
            return Response({"error": "Authorization token missing"}, 
                          status=status.HTTP_401_UNAUTHORIZED)

        token = token.split(" ")[1]
        user_data = verify_jwt(token)
        user_id = user_data["user_id"]
        user_role = user_data["role"]

        # Use select_related for better performance
        applications = Application.objects.all()

        if user_role == "job_seeker":
            applications = applications.filter(job_seeker_id=user_id)
        elif user_role == "company":
            # Cache company jobs
            cache_key = f'company_jobs_{user_id}'
            company_jobs = cache.get(cache_key)
            
            if not company_jobs:
                company_jobs = self.get_company_jobs(user_id)
                cache.set(cache_key, company_jobs, 300)  # Cache for 5 minutes
                
            applications = applications.filter(job_id__in=company_jobs)
        else:
            return Response({"error": "Invalid user role"}, 
                          status=status.HTTP_403_FORBIDDEN)

        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

    def get_company_jobs(self, user_id):
        try:
            response = requests.get(
                f"{settings.JOB_POSTING_SERVICE_URL}/jobPostService/getByCompanyId/{user_id}"
            )
            if response.status_code == 200:
                jobs = response.json()
                return [job["id"] for job in jobs]
            return []
        except Exception:
            return []


class JobSeekerApplicationsView(APIView):
    def get(self, request, job_seeker_id):
        # Validate JWT and extract user info
        print(request.headers)
        token = request.headers.get("Authorization")
        if not token:
            return Response({"error": "Authorization token missing"}, status=status.HTTP_401_UNAUTHORIZED)

        token = token.split(" ")[1]
        user_data = verify_jwt(token)

        # # Ensure the requesting user matches the job seeker or is an admin
        # if str(user_data["user_id"]) != str(job_seeker_id) and user_data["role"] != "admin":
        #     return Response({"error": "Not authorized to view these applications"}, status=status.HTTP_403_FORBIDDEN)

        applications = Application.objects.filter(job_seeker_id=job_seeker_id)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)


class JobApplicationsView(APIView):
    def get(self, request, job_id):
        # Validate JWT and extract user info
        token = request.headers.get("Authorization")
        if not token:
            return Response({"error": "Authorization token missing"}, status=status.HTTP_401_UNAUTHORIZED)

        token = token.split(" ")[1]
        user_data = verify_jwt(token)
        user_id = user_data["user_id"]

        # Verify if the job exists
        job_status = self.verify_job_status(job_id)
        if not job_status.get("exists"):
            return Response({"error": "Job does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # # Verify if the user has permission to view these applications
        # if not self.has_permission_to_view(user_id, job_id):
        #     return Response({"error": "Not authorized to view these applications"}, status=status.HTTP_403_FORBIDDEN)

        applicat = Application.objects.filter(job_id=job_id)
        serializer = ApplicationSerializer(applicat, many=True)
        return Response(serializer.data)

    def verify_job_status(self, job_id):
        try:
            response = requests.get(f"{settings.JOB_POSTING_SERVICE_URL}/jobPostService/{job_id}")
            if response.status_code == 200:
                return {"exists": True, "company_id": response.json().get("company_id")}
            return {"exists": False, "company_id": None}
        except Exception:
            return {"exists": False, "company_id": None}

    def has_permission_to_view(self, user_id, job_id):
        try:
            # Check if user is admin
            user_response = requests.get(f"{settings.USER_MANAGEMENT_SERVICE_URL}/users/{user_id}")
            if user_response.status_code == 200:
                user_data = user_response.json()
                if user_data.get("role") == "admin":
                    return True

                # Check if user is the company that posted the job
                job_response = requests.get(f"{settings.JOB_POSTING_SERVICE_URL}/jobPostService/{job_id}")
                if job_response.status_code == 200:
                    job_data = job_response.json()
                    return str(job_data.get("company_id")) == str(user_id)

            return False
        except Exception:
            return False


class ApplicationsByLocationView(APIView):
    def get(self, request):
        token = request.headers.get("Authorization")
        if not token:
            return Response(
                {"error": "Authorization token missing"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        token = token.split(" ")[1]
        user_data = verify_jwt(token)
        
        # Get location parameters
        city = request.query_params.get('city')
        country = request.query_params.get('country')
        radius = request.query_params.get('radius', 50)  # Default 50km radius
        
        try:
            # Get all applications
            applications = Application.objects.all()
            
            # If location parameters are provided, filter by location
            if city and country:
                # Get jobs within radius from job posting service
                response = requests.get(
                    f"{settings.JOB_POSTING_SERVICE_URL}/jobPostService/by-location",
                    params={
                        'city': city,
                        'country': country,
                        'radius': radius
                    }
                )
                
                if response.status_code == 200:
                    jobs_in_radius = response.json()
                    job_ids = [job['id'] for job in jobs_in_radius]
                    applications = applications.filter(job_id__in=job_ids)
                else:
                    return Response(
                        {"error": "Error fetching jobs by location"}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            
            serializer = ApplicationSerializer(applications, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


