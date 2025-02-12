from fastapi import APIRouter, Depends, Request
from auth import verify_jwt
from services import SERVICES
import requests
import asyncio
import aiohttp
from typing import List

router = APIRouter()

async def fetch_data(session: aiohttp.ClientSession, url: str, headers: dict):
    async with session.get(url, headers=headers) as response:
        return await response.json()

@router.post("/apply/")
async def apply_for_job(request: Request, authorization: str = Depends(verify_jwt)):
    """
    Forward the token and request to the job applications service.
    """
    headers = {"Authorization": f"Bearer {authorization}"}
    body = await request.json()
    response = requests.post(f"{SERVICES['job_applications']}apply/", json=body, headers=headers)
    return response.json()

@router.get("/{application_id}/")
async def get_application_status(application_id: int, request: Request, authorization: str = Depends(verify_jwt)):
    """
    Forward the token and request to get application status.
    """
    headers = {"Authorization": f"Bearer {authorization}"}
    response = requests.get(f"{SERVICES['job_applications']}application/{application_id}/", headers=headers)
    return response.json()

@router.put("/{application_id}/update/")
async def update_application_status(application_id: int, request: Request, authorization: str = Depends(verify_jwt)):
    """
    Forward the token and request to update application status.
    """
    headers = {"Authorization": f"Bearer {authorization}"}
    body = await request.json()
    response = requests.put(
        f"{SERVICES['job_applications']}application/{application_id}/update/", 
        json=body, 
        headers=headers
    )
    return response.json()

@router.get("/job-seeker/{job_seeker_id}/")
async def get_job_seeker_applications(job_seeker_id: int, authorization: str = Depends(verify_jwt)):
    """
    Forward the token and request to get job seeker applications.
    """
    headers = {"Authorization": f"Bearer {authorization}"}
    response = requests.get(
        f"{SERVICES['job_applications']}job-seeker/{job_seeker_id}/applications/", 
        headers=headers
    )
    return response.json()

@router.get("/job/{job_id}/")
async def get_job_applications(job_id: int, authorization: str = Depends(verify_jwt)):
    """
    Fetch job applications and related data in parallel
    """
    headers = {"Authorization": f"Bearer {authorization}"}
    
    async with aiohttp.ClientSession() as session:
        # Fetch applications and job details in parallel
        tasks = [
            fetch_data(
                session,
                f"{SERVICES['job_applications']}job/{job_id}/applications/",
                headers
            ),
            fetch_data(
                session,
                f"{SERVICES['job_posting']}jobPostService/{job_id}",
                headers
            )
        ]
        
        results = await asyncio.gather(*tasks)
        applications, job_details = results

        return {
            "applications": applications,
            "job_details": job_details
        }
