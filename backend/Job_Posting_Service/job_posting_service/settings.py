CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}

# Cache timeouts
JOB_POST_CACHE_TTL = 300  # 5 minutes
COMPANY_JOBS_CACHE_TTL = 300  # 5 minutes 