# Generated by Django 5.1.2 on 2024-11-09 11:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_experience_company_experience_description'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='company',
            name='location',
        ),
        migrations.AddField(
            model_name='company',
            name='location_id',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.DeleteModel(
            name='Location',
        ),
    ]