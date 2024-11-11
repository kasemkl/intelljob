from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Application
from .serializers import ApplicationSerializer, ApplicationStatusUpdateSerializer
import requests
from django.conf import settings


# Helper function to verify job exists in Job Posting Service
def is_valid_job(job_id):
    response = requests.get(f"{settings.JOB_POSTING_SERVICE_URL}/api/job/{job_id}/")
    return response.status_code == 200

class ApplyForJobView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        job_id = request.data.get("job_id")
        job_seeker_id = request.user.id  # Extracted from JWT

        # Verify the job exists
        if not is_valid_job(job_id):
            return Response({"error": "Job does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Create the application
        application_data = {
            "job_id": job_id,
            "job_seeker_id": job_seeker_id,
            "status": "submitted",
        }
        serializer = ApplicationSerializer(data=application_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, application_id):
        try:
            application = Application.objects.get(id=application_id, job_seeker_id=request.user.id)
            serializer = ApplicationSerializer(application)
            return Response(serializer.data)
        except Application.DoesNotExist:
            return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)

class UpdateApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated]  # Only accessible by companies

    def put(self, request, application_id):
        try:
            application = Application.objects.get(id=application_id)
            if request.user.role != "company":
                return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
            
            serializer = ApplicationStatusUpdateSerializer(application, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Application status updated"})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Application.DoesNotExist:
            return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)


def is_valid_job(job_id):
    """Verify if the job ID exists in the Job Posting Service."""
    response = requests.get(f"{settings.JOB_POSTING_SERVICE_URL}/api/job/{job_id}/")
    return response.status_code == 200

def get_user_role(user_id):
    """Retrieve the user's role from the User Management Service."""
    response = requests.get(f"{settings.USER_MANAGEMENT_SERVICE_URL}/api/users/{user_id}/role/")
    if response.status_code == 200:
        return response.json().get("role")
    return None
