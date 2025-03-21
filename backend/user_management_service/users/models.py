from django.db import models

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin



class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        account = self.model(email=email, **extra_fields)
        account.set_password(password)
        account.save(using=self._db)
        return account

    def create_superuser(self, email, password=None, **extra_fields):
        account= self.create_user(email, password, **extra_fields)
        account.is_staff=True
        account.is_superuser=True
        account.type=1
        account.save()
        return account


class User(AbstractBaseUser):
    ROLE_CHOICES = [

        ('job_seeker', 'Job Seeker'),

        ('company', 'Company'),
        ('admin', 'Admin'),
    ]
    id = models.AutoField(primary_key=True)
    email = models.CharField(unique=True, max_length=60)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    creation_date = models.DateTimeField(auto_now_add=True)
    date_of_birth = models.DateField(null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)  # New field for photo
    role = models.CharField(max_length=50, choices=ROLE_CHOICES) 
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser=models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    objects = UserManager()
    def __str__(self):
        return self.email
    
    def has_perm(self, perm, obj=None):
        return self.is_superuser
    def has_module_perms(self, app_label):
        return self.is_superuser



class Skill(models.Model):

    name = models.CharField(max_length=255)

    level = models.IntegerField()  # Level can be stored as a percentage (0-100) or rank (1-10)



    def __str__(self):

        return f"{self.name} (Level: {self.level})"



class Experience(models.Model):

    position = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    years = models.IntegerField()  # Total years of experience
    description = models.TextField(null=True, blank=True)
    start_date = models.DateField()

    end_date = models.DateField()



    def __str__(self):

        return f"{self.position} ({self.start_date} - {self.end_date})"



class Education(models.Model):

    institution = models.CharField(max_length=255)

    degree = models.CharField(max_length=255)  # Added degree field

    start_date = models.DateField(null=True, blank=True)

    end_date = models.DateField(null=True, blank=True)



    def __str__(self):

        return f"{self.degree} from {self.institution} ({self.start_date} - {self.end_date})"

class Language(models.Model):
    name = models.CharField(max_length=100)
    proficiency = models.CharField(max_length=50)  # e.g., Native, Intermediate, etc.

    def __str__(self):
        return f"{self.name} - {self.proficiency}"

class Certification(models.Model):
    name = models.CharField(max_length=255)
    date_obtained = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name


class JobSeeker(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    profile_id = models.CharField(max_length=100)

    skills = models.ManyToManyField(Skill, blank=True)  # Made optional

    experience = models.ManyToManyField(Experience, blank=True)  # Made optional

    education = models.ManyToManyField(Education, blank=True)  # Made optional

    linkedin_url = models.CharField(max_length=255, null=True, blank=True)
    languages = models.ManyToManyField(Language, blank=True)
    certifications = models.ManyToManyField(Certification, blank=True)
    awards = models.JSONField(default=list, blank=True)  # Store as JSON array
    companies_worked_at = models.JSONField(default=list, blank=True)  # Store as JSON array



class Location(models.Model):  # Renamed to Location for clarity

    city = models.CharField(max_length=255)

    country = models.CharField(max_length=255)



    def __str__(self):

        return f"{self.city}, {self.country}"



class Company(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    profile_id = models.CharField(max_length=100)

    industry = models.CharField(max_length=255, null=True, blank=True)  # Made optional

    company_size = models.IntegerField(null=True, blank=True)  # Made optional

    location_id = models.IntegerField(null=True, blank=True)  # Made optional with SET_NULL



    def __str__(self):

        return f"{self.user.first_name} {self.user.last_name} - {self.industry or 'N/A'} ({self.location or 'No location'})"





