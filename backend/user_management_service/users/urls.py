# user_management/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserListCreateView,
    UserDetailView,
    JobSeekerListCreateView,
    JobSeekerDetailView,
    CompanyListCreateView,
    CompanyDetailViewByUserId,
    CompanyDetailViewByCompanyId,
    ChangePasswordView,
    RegisterView,
    ParseCVView,
)

urlpatterns = [
    # User Endpoints
    path('users/', UserListCreateView.as_view(), name='user-list-create'),  # List all users or create a new user
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),  # Retrieve, update, or delete a specific user by ID

    # Job Seeker Endpoints
    path('jobseekers/', JobSeekerListCreateView.as_view(), name='jobseeker-list-create'),  # List all job seekers or create a new job seeker
    path('jobseekers/<int:pk>/', JobSeekerDetailView.as_view(), name='jobseeker-detail'),  # Retrieve, update, or delete a specific job seeker by ID

    # Company Endpoints
    path('companies/', CompanyListCreateView.as_view(), name='company-list-create'),  # List all companies or create a new company
    path('companiesByUserId/<int:pk>/', CompanyDetailViewByUserId.as_view(), name='company-detail-by-user-id'),  # Retrieve, update, or delete a specific company by ID
    path('companiesByCompanyId/<int:pk>/', CompanyDetailViewByCompanyId.as_view(), name='company-detail-by-company-id'),  # Retrieve, update, or delete a specific company by ID

    # Password and Registration
    path('users/change-password/<int:pk>/', ChangePasswordView.as_view(), name='change-password'),  # Endpoint to change the password of a user
    path('register/', RegisterView.as_view(), name='register'),  # Register a new user

    # JWT Authentication
    # path('login/', TokenObtainPairView.as_view(), name='login'),  # Obtain JWT token pair (access and refresh tokens)
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh JWT access token

    path('parse-cv/', ParseCVView.as_view(), name='parse-cv'),
]
