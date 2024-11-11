from django.urls import path
from .views import CountryListView, CountryDetailView, CityListView, CityDetailView

urlpatterns = [
    path('countries/', CountryListView.as_view(), name='country-list'),
    path('countries/<int:pk>/', CountryDetailView.as_view(), name='country-detail'),
    path('cities/', CityListView.as_view(), name='city-list'),
    path('cities/<int:pk>/', CityDetailView.as_view(), name='city-detail'),
] 