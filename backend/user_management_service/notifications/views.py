from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notification
from users.models import Company,JobSeeker,User
from .serializers import NotificationSerializer

class NotificationAPIView(APIView):
    # permission_classes = [IsAuthenticated]  # Uncomment if authentication is required

    def get(self, request):
        # Fetch notifications for the authenticated user
        notifications = Notification.objects.filter(user=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            # Extract role and user_id from the request data
            role = request.data.get('role')
            user_id = request.data.get('user_id')
            message = request.data.get('message')

            if not role or not user_id or not message:
                return Response(
                    {"error": "Role, user_id, and message are required in the request data."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Fetch the user_id based on the role
            if role == 'company':
                try:
                    company = Company.objects.get(id=user_id)
                    user_id = company.user.id
                except Company.DoesNotExist:
                    return Response(
                        {"error": "Company not found."},
                        status=status.HTTP_404_NOT_FOUND
                    )
            elif role == 'job_seeker':
                try:
                    ##job_seeker = JobSeeker.objects.get(id=user_id)
                    user_id = user_id
                except JobSeeker.DoesNotExist:
                    return Response(
                        {"error": "Job Seeker not found."},
                        status=status.HTTP_404_NOT_FOUND
                    )
            else:
                return Response(
                    {"error": "Invalid role. Must be 'company' or 'job_seeker'."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create the notification
            notification = Notification.objects.create(user_id=user_id, message=message)

            serializer = NotificationSerializer(notification)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk=None):
        try:
            # Ensure the notification ID is provided
            if not pk:
                return Response({"error": "Notification ID is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch the notification by ID and ensure it belongs to the user
            notification = Notification.objects.get(id=pk, user=request.user)

            # Update the notification (e.g., mark as read)
            serializer = NotificationSerializer(notification, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Notification.DoesNotExist:
            return Response({"detail": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)