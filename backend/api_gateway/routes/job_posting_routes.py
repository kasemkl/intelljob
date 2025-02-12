from fastapi import APIRouter, Depends, Request, Path,HTTPException
from auth import verify_jwt
from services import SERVICES
import requests

router = APIRouter()

@router.get("/")
def list_job_posts(request: Request, authorization: str = Depends(verify_jwt)):
    headers = {"Authorization": f"Bearer {authorization}"}
    response = requests.get(f"{SERVICES['job_posting']}jobPostService", headers=headers)
    return response.json()  

@router.post("/")
async def create_job_post(request: Request, authorization: str = Depends(verify_jwt)):
    headers = {"Authorization": f"Bearer {authorization}"}
    body = await request.json()
    response = requests.post(f"{SERVICES['job_posting']}jobPostService", json=body, headers=headers)
    return response.json()

@router.get("/{id}/")
def get_job_post_by_id(id: int, request: Request, authorization: str = Depends(verify_jwt)):
    headers = {"Authorization": f"Bearer {authorization}"}
    response = requests.get(f"{SERVICES['job_posting']}jobPostService/{id}", headers=headers)
    return response.json()

@router.put("/{id}/")
async def update_job_post_by_id(id: int, request: Request, authorization: str = Depends(verify_jwt)):
    headers = {"Authorization": f"Bearer {authorization}"}
    body = await request.json()
    response = requests.put(f"{SERVICES['job_posting']}jobPostService/{id}", json=body, headers=headers)
    return response.json()

@router.delete("/{id}/")
def delete_job_post_by_id(id: int, request: Request, authorization: str = Depends(verify_jwt)):
    headers = {"Authorization": f"Bearer {authorization}"}
    response = requests.delete(f"{SERVICES['job_posting']}jobPostService/{id}", headers=headers)
    return response.json()

@router.get("/location/{location_id}/")
def get_jobs_by_location(location_id: int, request: Request, authorization: str = Depends(verify_jwt)):
    headers = {"Authorization": f"Bearer {authorization}"}
    response = requests.get(f"{SERVICES['job_posting']}jobPostService/getByLocationId/{location_id}", headers=headers)
    return response.json()

@router.get("/company/{company_id}/")
def get_jobs_by_company(company_id: int, request: Request, authorization: str = Depends(verify_jwt)):
    headers = {"Authorization": f"Bearer {authorization}"}
    response = requests.get(f"{SERVICES['job_posting']}jobPostService/getByCompanyId/{company_id}", headers=headers)
    return response.json()

@router.get("/category/{category_id}/")
def get_jobs_by_category(category_id: int, request: Request, authorization: str = Depends(verify_jwt)):
    headers = {"Authorization": f"Bearer {authorization}"}
    response = requests.get(f"{SERVICES['job_posting']}jobPostService/getByCategory/{category_id}", headers=headers)
    return response.json()

# Route to list all categories
@router.get("/categories/list")
def list_categories(request: Request):
    """
    Fetch all categories from the backend service.
    """
    response = requests.get(f"{SERVICES['job_posting']}categories")
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()

# Route to create a new category
@router.post("/categories/")
async def create_category(request: Request, authorization: str = Depends(verify_jwt)):
    """
    Create a new category.
    """
    headers = {"Authorization": f"Bearer {authorization}"}
    body = await request.json()
    response = requests.post(f"{SERVICES['job_posting']}categories", json=body, headers=headers)
    if response.status_code != 201:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()

# Route to fetch category details
@router.get("/categories/detail/{id}")
def get_category_by_id(
    id: int = Path(..., description="The ID of the category, must be an integer"),
    authorization: str = Depends(verify_jwt)
):
    """
    Fetch a specific category by its ID.
    """
    headers = {"Authorization": f"Bearer {authorization}"}
    response = requests.get(f"{SERVICES['job_posting']}categories/{id}", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()

# Route to update a category by ID
@router.put("/categories/detail/{id}")
async def update_category_by_id(
    request: Request,
    id: int = Path(..., description="The ID of the category to update"),
    authorization: str = Depends(verify_jwt)
):
    """
    Update a specific category by ID.
    """
    headers = {"Authorization": f"Bearer {authorization}"}
    body = await request.json()
    response = requests.put(f"{SERVICES['job_posting']}categories/{id}", json=body, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()

# Route to delete a category by ID
@router.delete("/categories/detail/{id}")
def delete_category_by_id(
    id: int = Path(..., description="The ID of the category to delete"),
    authorization: str = Depends(verify_jwt)
):
    """
    Delete a specific category by ID.
    """
    headers = {"Authorization": f"Bearer {authorization}"}
    response = requests.delete(f"{SERVICES['job_posting']}categories/{id}", headers=headers)
    if response.status_code != 204:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return {"message": "Category deleted successfully"}

# Bulk creation of categories
@router.post("/categories/bulk")
async def bulk_create_categories(request: Request, authorization: str = Depends(verify_jwt)):
    """
    Bulk create categories.
    """
    headers = {"Authorization": f"Bearer {authorization}"}
    body = await request.json()
    response = requests.post(f"{SERVICES['job_posting']}categories/bulk", json=body, headers=headers)
    if response.status_code != 201:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()