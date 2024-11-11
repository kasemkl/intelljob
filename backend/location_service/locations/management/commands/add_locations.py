from django.core.management.base import BaseCommand
from locations.models import Country, City

class Command(BaseCommand):
    help = 'Adds sample countries and cities to the database'

    def handle(self, *args, **options):
        # Add countries
        self.stdout.write('Adding countries...')
        countries = {
            'United States': {'code': 'US'},
            'United Kingdom': {'code': 'GB'},
            'Canada': {'code': 'CA'},
        }

        for country_name, data in countries.items():
            country, created = Country.objects.update_or_create(
                name=country_name,
                defaults={'code': data['code']}
            )
            countries[country_name] = country
            if created:
                self.stdout.write(self.style.SUCCESS(f'Added country: {country_name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Updated country: {country_name}'))

        # Add cities
        self.stdout.write('\nAdding cities...')
        cities = [
            ('New York', 'United States'),
            ('Los Angeles', 'United States'),
            ('Chicago', 'United States'),
            ('London', 'United Kingdom'),
            ('Manchester', 'United Kingdom'),
            ('Birmingham', 'United Kingdom'),
            ('Toronto', 'Canada'),
            ('Vancouver', 'Canada'),
            ('Montreal', 'Canada'),
        ]

        for city_name, country_name in cities:
            city, created = City.objects.update_or_create(
                name=city_name,
                country=countries[country_name],
                defaults={}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Added city: {city_name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Updated city: {city_name}')) 