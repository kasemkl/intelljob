import requests

BASE_URL = "http://localhost:8000/api"  # Adjust if your URL is different

# Data to be added
countries = [
    {"name": "United States"},
    {"name": "United Kingdom"},
    {"name": "Canada"}
]

cities = [
    {"name": "New York", "country": 1},
    {"name": "Los Angeles", "country": 1},
    {"name": "Chicago", "country": 1},
    {"name": "London", "country": 2},
    {"name": "Manchester", "country": 2},
    {"name": "Birmingham", "country": 2},
    {"name": "Toronto", "country": 3},
    {"name": "Vancouver", "country": 3},
    {"name": "Montreal", "country": 3}
]

def add_locations():
    # Add countries
    print("Adding countries...")
    for country in countries:
        response = requests.post(f"{BASE_URL}/countries/", json=country)
        if response.status_code == 201:
            print(f"Added country: {country['name']}")
        else:
            print(f"Failed to add country {country['name']}: {response.text}")

    # Add cities
    print("\nAdding cities...")
    for city in cities:
        response = requests.post(f"{BASE_URL}/cities/", json=city)
        if response.status_code == 201:
            print(f"Added city: {city['name']}")
        else:
            print(f"Failed to add city {city['name']}: {response.text}")

if __name__ == "__main__":
    add_locations() 