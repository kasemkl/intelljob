from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Country, City
from .serializers import CountrySerializer, CitySerializer
from .utils import verify_jwt  # JWT verification helper
from django.core.cache import cache

class CountryListView(APIView):
    """
    Handles listing all countries and creating a new country.
    """
    def get(self, request):
        # JWT validation
        token = request.headers.get("Authorization")
        if token:
            verify_jwt(token.split(" ")[1])  # Verify the token

        cache_key = 'all_countries'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)

        countries = Country.objects.all()
        serializer = CountrySerializer(countries, many=True)
        # Cache for 1 hour as location data rarely changes
        cache.set(cache_key, serializer.data, 3600)
        return Response(serializer.data)

    def post(self, request):
        # JWT validation
        token = request.headers.get("Authorization")
        if token:
            verify_jwt(token.split(" ")[1])  # Verify the token

        serializer = CountrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CountryDetailView(APIView):
    """
    Handles retrieving, updating, or deleting a specific country by its ID.
    """
    def get(self, request, pk):
        # JWT validation
        token = request.headers.get("Authorization")
        if token:
            verify_jwt(token.split(" ")[1])  # Verify the token

        country = get_object_or_404(Country, pk=pk)
        serializer = CountrySerializer(country)
        return Response(serializer.data)


class CityListView(APIView):
    """
    Handles listing all cities or filtering by country, and creating a new city.
    """
    def get(self, request):
        # JWT validation
        token = request.headers.get("Authorization")
        if token:
            verify_jwt(token.split(" ")[1])  # Verify the token

        country_id = request.query_params.get('country')
        cache_key = f'cities_by_country_{country_id}' if country_id else 'all_cities'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)

        if country_id:
            cities = City.objects.filter(country_id=country_id)
        else:
            cities = City.objects.all()
            
        serializer = CitySerializer(cities, many=True)
        # Cache for 1 hour
        cache.set(cache_key, serializer.data, 3600)
        return Response(serializer.data)

    def post(self, request):
        # JWT validation
        token = request.headers.get("Authorization")
        if token:
            verify_jwt(token.split(" ")[1])  # Verify the token

        serializer = CitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CityDetailView(APIView):
    """
    Handles retrieving, updating, or deleting a specific city by its ID.
    """
    def get(self, request, pk):
        # JWT validation
        token = request.headers.get("Authorization")
        if token:
            verify_jwt(token.split(" ")[1])  # Verify the token

        city = get_object_or_404(City, pk=pk)
        serializer = CitySerializer(city)
        return Response(serializer.data)
