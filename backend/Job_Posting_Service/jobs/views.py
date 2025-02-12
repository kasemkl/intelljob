from django.core.cache import cache

class JobPostDetailView(APIView):
    def get(self, request, pk):
        cache_key = f'job_post_{pk}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        job_post = self.get_object(pk)
        if job_post is None:
            return Response({"error": "Job post not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = JobPostSerializer(job_post)
        # Cache for 5 minutes
        cache.set(cache_key, serializer.data, 300)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CompanyJobsView(APIView):
    def get(self, request, company_id):
        cache_key = f'company_jobs_{company_id}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        jobs = JobPost.objects.filter(company_id=company_id)
        serializer = JobPostSerializer(jobs, many=True)
        # Cache for 5 minutes
        cache.set(cache_key, serializer.data, 300)
        return Response(serializer.data, status=status.HTTP_200_OK) 