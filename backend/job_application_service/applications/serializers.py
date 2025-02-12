from rest_framework import serializers
from .models import Application

class SkillSerializer(serializers.Serializer):
    name = serializers.CharField()
    level = serializers.IntegerField()

class ExperienceSerializer(serializers.Serializer):
    position = serializers.CharField()
    company = serializers.CharField()
    years = serializers.IntegerField()
    description = serializers.CharField()
    start_date = serializers.DateField()
    end_date = serializers.DateField()

class EducationSerializer(serializers.Serializer):
    institution = serializers.CharField()
    degree = serializers.CharField()
    start_date = serializers.DateField()
    end_date = serializers.DateField()

class LanguageSerializer(serializers.Serializer):
    name = serializers.CharField()
    proficiency = serializers.CharField()

class CertificationSerializer(serializers.Serializer):
    name = serializers.CharField()
    date_obtained = serializers.DateField()

class JobSeekerDetailsSerializer(serializers.Serializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.CharField(source='user.email')
    profile_picture = serializers.ImageField(source='user.profile_picture', required=False)
    skills = SkillSerializer(many=True, required=False)
    experience = ExperienceSerializer(many=True, required=False)
    education = EducationSerializer(many=True, required=False)
    languages = LanguageSerializer(many=True, required=False)
    certifications = CertificationSerializer(many=True, required=False)
    linkedin_url = serializers.URLField(required=False)
    awards = serializers.JSONField(required=False)
    companies_worked_at = serializers.JSONField(required=False)

class JobDetailsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    companyName = serializers.CharField(source='company_name', required=False)
    location = serializers.CharField(required=False)
    salaryRange = serializers.CharField(source='salary_range', required=False)
    jobType = serializers.CharField(source='job_type', required=False)
    description = serializers.CharField(required=False)
    requirements = serializers.CharField(required=False)
    status = serializers.CharField(required=False)

class ApplicationSerializer(serializers.ModelSerializer):
    job_seeker_details = JobSeekerDetailsSerializer(source='get_job_seeker_details', read_only=True)
    job_details = JobDetailsSerializer(source='get_job_details', read_only=True)
    
    class Meta:
        model = Application
        fields = ['id', 'job_id', 'job_seeker_id', 'status', 'applied_at', 'job_seeker_details', 'job_details','similarity_score']
        
class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status']
