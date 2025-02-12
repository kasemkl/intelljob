from django.urls import path
from .views import (
    ApplyForJobView, 
    ApplicationStatusView, 
    UpdateApplicationStatusView,
    JobSeekerApplicationsView,
    JobApplicationsView,
    ApplicationsByLocationView,
)

urlpatterns = [
    path('apply/', ApplyForJobView.as_view(), name='apply_for_job'),
    path('application/<int:application_id>/', ApplicationStatusView.as_view(), name='application_status'),
    path('application/<int:application_id>/update/', UpdateApplicationStatusView.as_view(), name='update_application_status'),
    path('job-seeker/<int:job_seeker_id>/applications/', JobSeekerApplicationsView.as_view(), name='job_seeker_applications'),
    path('job/<int:job_id>/applications/', JobApplicationsView.as_view(), name='job_applications'),
    path('applications/by-location', ApplicationsByLocationView.as_view(), name='applications-by-location'),
]
