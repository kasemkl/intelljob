from fastapi import APIRouter, Depends, Request
from auth import verify_jwt
from services import SERVICES
import requests

router = APIRouter()

@router.post("/register/")
def register_user(request: Request):
    response = requests.post(f"{SERVICES['user_management']}register/", json=request.json())
    return response.json()

@router.get("/")
def list_users(request: Request, authorization: str = Depends(verify_jwt)):
    response = requests.get(f"{SERVICES['user_management']}users/")
    return response.json()

@router.get("/{pk}/")
def get_user(pk: int, request: Request, authorization: str = Depends(verify_jwt)):
    response = requests.get(f"{SERVICES['user_management']}users/{pk}/")
    return response.json()

@router.put("/{pk}/")
def update_user(pk: int, request: Request, authorization: str = Depends(verify_jwt)):
    response = requests.put(f"{SERVICES['user_management']}users/{pk}/", json=request.json())
    return response.json()

@router.post("/jobseekers/")
def create_job_seeker(request: Request, authorization: str = Depends(verify_jwt)):
    response = requests.post(f"{SERVICES['user_management']}jobseekers/", json=request.json())
    return response.json()

@router.get("/jobseekers/")
def list_job_seekers(request: Request, authorization: str = Depends(verify_jwt)):
    response = requests.get(f"{SERVICES['user_management']}jobseekers/")
    return response.json()

@router.get("/jobseekers/{pk}/")
def get_job_seeker(pk: int, request: Request, authorization: str = Depends(verify_jwt)):
    response = requests.get(f"{SERVICES['user_management']}jobseekers/{pk}/")
    return response.json()

@router.get("/companies/")
def list_companies(request: Request, authorization: str = Depends(verify_jwt)):
    response = requests.get(f"{SERVICES['user_management']}companies/")
    return response.json()

@router.get("/companies/{company_id}/")
def get_company_by_id(company_id: int, request: Request, authorization: str = Depends(verify_jwt)):
    response = requests.get(f"{SERVICES['user_management']}companiesByCompanyId/{company_id}/")
    return response.json()

@router.get("/companies/user/{user_id}/")
def get_company_by_user_id(user_id: int, request: Request, authorization: str = Depends(verify_jwt)):
    response = requests.get(f"{SERVICES['user_management']}companiesByUserId/{user_id}/")
    return response.json()

@router.put("/change-password/{pk}/")
def change_password(pk: int, request: Request, authorization: str = Depends(verify_jwt)):
    response = requests.put(f"{SERVICES['user_management']}users/change-password/{pk}/", json=request.json())
    return response.json()
