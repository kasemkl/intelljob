from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Country, City
from .serializers import CountrySerializer, CitySerializer

class CountryListView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        countries = Country.objects.all()
        serializer = CountrySerializer(countries, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CountrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CountryDetailView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        country = get_object_or_404(Country, pk=pk)
        serializer = CountrySerializer(country)
        return Response(serializer.data)

class CityListView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        country_id = request.query_params.get('country', None)
        if country_id:
            cities = City.objects.filter(country_id=country_id)
        else:
            cities = City.objects.all()
        serializer = CitySerializer(cities, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CityDetailView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        city = get_object_or_404(City, pk=pk)
        serializer = CitySerializer(city)
        return Response(serializer.data)
