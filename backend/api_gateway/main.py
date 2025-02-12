from fastapi import FastAPI, Request
from auth import verify_jwt
from routes.job_application_routes import router as job_application_router
from routes.job_posting_routes import router as job_posting_router
from routes.location_routes import router as location_router
from routes.user_management_routes import router as user_management_router
from fastapi.middleware.cors import CORSMiddleware
import jwt
import asyncio
import aiohttp

app = FastAPI()
SECRET_KEY = 'django-insecure-#z6n0_zv*#dkjj36z0$*-cbji9o6w4wwbw^@(&2ea%594$4zw_'

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure connection pooling
app.state.http_client = None

@app.on_event("startup")
async def startup_event():
    # Create a shared aiohttp ClientSession for the application
    app.state.http_client = aiohttp.ClientSession()

@app.on_event("shutdown")
async def shutdown_event():
    # Close the shared ClientSession
    if app.state.http_client:
        await app.state.http_client.close()

# Middleware for JWT Authentication
# @app.middleware("http")
# async def authenticate_request(request: Request, call_next):
#     token = request.headers.get("Authorization")
#     if token:
#         try:
#             token = token.split(" ")[1]  # Extract Bearer token
#             user_data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
#             request.state.user_id = user_data.get("user_id")  # Use .get() for safer access
#         except (jwt.InvalidTokenError, KeyError):
#             # If token is invalid or missing required claims, continue without setting user_id
#             pass
#     response = await call_next(request)
#     return response

# Include routers from different route files
app.include_router(user_management_router, prefix="/api/users", tags=["User Management"])
app.include_router(job_posting_router, prefix="/api/jobs", tags=["Job Posting"])
app.include_router(location_router, prefix="/api/locations", tags=["Location Service"])
app.include_router(job_application_router, prefix="/api/applications", tags=["Job Applications"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8004, reload=True)
