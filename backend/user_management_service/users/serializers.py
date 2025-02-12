from rest_framework import serializers
from .models import User, Skill, Experience, Education, JobSeeker, Location, Company, Language, Certification

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'first_name', 'last_name', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=validated_data['role'],
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'is_staff')

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('id', 'name', 'level')

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ('id', 'position', 'company', 'years', 'description', 'start_date', 'end_date')

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ('id', 'institution', 'degree', 'start_date', 'end_date')

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ('id', 'name', 'proficiency')

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ('id', 'name', 'date_obtained')

class JobSeekerSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, required=False)
    experience = ExperienceSerializer(many=True, required=False)
    education = EducationSerializer(many=True, required=False)
    languages = LanguageSerializer(many=True, required=False)
    certifications = CertificationSerializer(many=True, required=False)
    awards = serializers.JSONField(required=False)
    companies_worked_at = serializers.JSONField(required=False)

    class Meta:
        model = JobSeeker
        fields = [
            'user', 'profile_id', 'skills', 'experience', 'education',
            'linkedin_url', 'languages', 'certifications', 'awards',
            'companies_worked_at'
        ]

    def create(self, validated_data):
        skills_data = validated_data.pop('skills', [])
        experience_data = validated_data.pop('experience', [])
        education_data = validated_data.pop('education', [])
        languages_data = validated_data.pop('languages', [])
        certifications_data = validated_data.pop('certifications', [])

        job_seeker = JobSeeker.objects.create(**validated_data)

        # Create related objects
        for skill_data in skills_data:
            skill = Skill.objects.create(**skill_data)
            job_seeker.skills.add(skill)

        for exp_data in experience_data:
            experience = Experience.objects.create(**exp_data)
            job_seeker.experience.add(experience)

        for edu_data in education_data:
            education = Education.objects.create(**edu_data)
            job_seeker.education.add(education)

        for lang_data in languages_data:
            language = Language.objects.create(**lang_data)
            job_seeker.languages.add(language)

        for cert_data in certifications_data:
            certification = Certification.objects.create(**cert_data)
            job_seeker.certifications.add(certification)

        return job_seeker

    def update(self, instance, validated_data):
        # Update many-to-many relationships
        if 'skills' in validated_data:
            instance.skills.clear()
            for skill_data in validated_data.pop('skills'):
                skill = Skill.objects.create(**skill_data)
                instance.skills.add(skill)

        if 'experience' in validated_data:
            instance.experience.clear()
            for exp_data in validated_data.pop('experience'):
                experience = Experience.objects.create(**exp_data)
                instance.experience.add(experience)

        if 'education' in validated_data:
            instance.education.clear()
            for edu_data in validated_data.pop('education'):
                education = Education.objects.create(**edu_data)
                instance.education.add(education)

        if 'languages' in validated_data:
            instance.languages.clear()
            for lang_data in validated_data.pop('languages'):
                language = Language.objects.create(**lang_data)
                instance.languages.add(language)

        if 'certifications' in validated_data:
            instance.certifications.clear()
            for cert_data in validated_data.pop('certifications'):
                certification = Certification.objects.create(**cert_data)
                instance.certifications.add(certification)

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = ('id', 'user', 'profile_id', 'industry', 'company_size', 'location_id')

class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'profile_picture', 'role', 'is_active', 'is_staff')

