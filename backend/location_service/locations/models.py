from django.db import models

# Create your models here.

class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=3, unique=True)  # ISO 3166-1 alpha-3 code
    
    class Meta:
        verbose_name_plural = "countries"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class City(models.Model):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='cities')
    
    class Meta:
        verbose_name_plural = "cities"
        ordering = ['name']
        unique_together = ['name', 'country']
    
    def __str__(self):
        return f"{self.name}, {self.country.name}"
