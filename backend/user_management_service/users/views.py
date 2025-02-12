from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from .models import User, JobSeeker, Company, Skill, Experience, Language, Certification, Education
from .serializers import UserSerializer, JobSeekerSerializer, CompanySerializer,UserProfileSerializer,UserRegistrationSerializer   

from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny 
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from django.conf import settings
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.cache import cache

User = get_user_model()


class RegisterView(APIView):
    """
    View to register a new user.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Create JobSeeker or Company profile based on the role
            role = serializer.validated_data.get("role")
            if role == "job_seeker":
                JobSeeker.objects.create(user=user, profile_id=f"jobseeker_{user.id}")
            elif role == "company":
                Company.objects.create(user=user, profile_id=f"company_{user.id}")

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "user": UserProfileSerializer(user).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListCreateView(APIView):
    """
    View to list and create users.
    """
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):
    """
    View to retrieve, update, and delete a user.
    """
    # permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return User.objects.get(id=pk)
        except User.DoesNotExist:
            return None

    def get(self, request, pk):
        cache_key = f'user_details_{pk}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        user = self.get_object(pk)
        if user is None:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user)
        cache.set(cache_key, serializer.data, settings.USER_CACHE_TTL)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        user = self.get_object(pk)
        if user is None:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Invalidate cache
            cache.delete(f'user_details_{pk}')
            cache.delete(f'jobseeker_profile_{pk}')
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id):
        user = self.get_object(user_id)
        if user is None:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# JobSeeker Views
class JobSeekerListCreateView(APIView):
    def get(self, request):
        job_seekers = JobSeeker.objects.all()
        serializer = JobSeekerSerializer(job_seekers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = JobSeekerSerializer(data=request.data)
        if serializer.is_valid():
            job_seeker = serializer.save()
            return Response(JobSeekerSerializer(job_seeker).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JobSeekerDetailView(APIView):
    # permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return JobSeeker.objects.get(user_id=pk)
        except JobSeeker.DoesNotExist:
            return None

    def get(self, request, pk):
        cache_key = f'jobseeker_profile_{pk}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        job_seeker = self.get_object(pk)
        if job_seeker is None:
            return Response({"error": "Job Seeker not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = JobSeekerSerializer(job_seeker)
        cache.set(cache_key, serializer.data, settings.PROFILE_CACHE_TTL)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        job_seeker = self.get_object(pk)    
        if job_seeker is None:
            return Response({"error": "Job Seeker not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = JobSeekerSerializer(job_seeker, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Company Views
class CompanyListCreateView(APIView):
    """
    View to list and create companies.
    """
    def get(self, request):
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyDetailViewByCompanyId(APIView):
    """
    View to retrieve, update, and delete a company.
    """
    # permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            
            return Company.objects.get(id=pk)
        except Company.DoesNotExist:
            return None

    def get(self, request, pk):
        
        company = self.get_object(pk)
        if company is None:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        company = self.get_object(pk)
        if company is None:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CompanySerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        company = self.get_object(pk)
        if company is None:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

        company.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CompanyDetailViewByUserId(APIView):
    """
    View to retrieve, update, and delete a company.
    """
    # permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            
            return Company.objects.get(user_id=pk)
        except Company.DoesNotExist:
            return None

    def get(self, request, pk):
        
        company = self.get_object(pk)
        if company is None:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        company = self.get_object(pk)
        if company is None:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CompanySerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        company = self.get_object(pk)
        if company is None:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

        company.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Change Password View
class ChangePasswordView(APIView):
    """
    View to change user password.
    """
    permission_classes = [IsAuthenticated]

    def get_object(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    def put(self, request, pk):
        user = self.get_object(pk)
        if user is None:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        new_password = request.data.get('new_password')
        if new_password:
            user.password = make_password(new_password)
            user.save()
            return Response({'detail': 'Password updated successfully.'}, status=status.HTTP_200_OK)
        return Response({'detail': 'New password not provided.'}, status=status.HTTP_400_BAD_REQUEST)

class ParseCVView(APIView):
    """
    View to parse CV and update JobSeeker profile
    """
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def _determine_skill_level(self, skill_name: str, cv_data: dict) -> int:
        """
        Determine skill level based on various factors in the CV
        Returns a level between 1-5
        """
        # Default level is 3 (intermediate)
        default_level = 3
        
        # If the skill appears multiple times in the CV, it might indicate higher proficiency
        skill_lower = skill_name.lower()
        
        # Check if skill appears in work experience
        appears_in_experience = any(
            skill_lower in exp.lower() 
            for exp in cv_data.get('worked_as', [])
        )
        
        # Check if skill appears in certifications
        appears_in_certifications = any(
            skill_lower in cert.lower() 
            for cert in cv_data.get('certification', [])
        )
        
        # Adjust level based on appearances
        level = default_level
        if appears_in_experience:
            level += 1
        if appears_in_certifications:
            level += 1
            
        # Ensure level stays within 1-5 range
        return max(1, min(5, level))

    def post(self, request):
        if not hasattr(request.user, 'jobseeker'):
            return Response(
                {"error": "Only job seekers can upload CVs"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get the CV file from request
        cv_file = request.FILES.get('cv')
        if not cv_file:
            return Response(
                {"error": "No CV file provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Send CV to parsing service
        files = {'file': cv_file}
        response = requests.post(
            'http://localhost:8005/extract-data-from-pdf',
            files=files
        )

        if response.status_code != 200:
            return Response(
                {"error": "Failed to parse CV"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        cv_data = response.json()
        job_seeker = request.user.jobseeker

        # Update JobSeeker profile with parsed data
        try:
            # Update skills with determined levels
            for skill_name in cv_data.get('skills', []):
                skill_level = self._determine_skill_level(skill_name, cv_data)
                skill, _ = Skill.objects.get_or_create(
                    name=skill_name,
                    defaults={'level': skill_level}
                )
                # If skill already existed, update its level
                if skill.level == 0:  # Only update if it was at default level
                    skill.level = skill_level
                    skill.save()
                job_seeker.skills.add(skill)

            # Update languages
            for lang_name in cv_data.get('language', []):
                language, _ = Language.objects.get_or_create(
                    name=lang_name,
                    defaults={'proficiency': 'Not specified'}
                )
                job_seeker.languages.add(language)

            # Update certifications
            for cert_name in cv_data.get('certification', []):
                cert, _ = Certification.objects.get_or_create(name=cert_name)
                job_seeker.certifications.add(cert)

            # Update education if university info is present
            for uni in cv_data.get('university', []):
                education, _ = Education.objects.get_or_create(
                    institution=uni,
                    defaults={
                        'degree': cv_data.get('degree', [''])[0],
                        'start_date': None,  # You might want to parse these from the CV
                        'end_date': None
                    }
                )
                job_seeker.education.add(education)

            # Update other fields
            if cv_data.get('linkedIn_Link'):
                job_seeker.linkedin_url = cv_data['linkedIn_Link']
            
            job_seeker.awards = cv_data.get('awards', [])
            job_seeker.companies_worked_at = cv_data.get('companies_work_at', [])
            job_seeker.save()

            return Response({
                "message": "CV parsed and profile updated successfully",
                "data": cv_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Failed to update profile: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )