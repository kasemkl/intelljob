from django.core.management.base import BaseCommand
from users.models import Location

class Command(BaseCommand):
    help = 'Populate the database with initial locations'

    def handle(self, *args, **kwargs):
        locations = [
            {'city': 'New York', 'country': 'USA'},
            {'city': 'Los Angeles', 'country': 'USA'},
            {'city': 'London', 'country': 'UK'},
            {'city': 'Paris', 'country': 'France'},
            {'city': 'Berlin', 'country': 'Germany'},
            {'city': 'Tokyo', 'country': 'Japan'},
            {'city': 'Sydney', 'country': 'Australia'},
            {'city': 'Toronto', 'country': 'Canada'},
            {'city': 'Dubai', 'country': 'UAE'},
            {'city': 'Singapore', 'country': 'Singapore'},
        ]

        for location_data in locations:
            Location.objects.get_or_create(
                city=location_data['city'],
                country=location_data['country']
            )

        self.stdout.write(self.style.SUCCESS('Successfully populated locations')) 