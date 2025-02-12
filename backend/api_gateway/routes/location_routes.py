from fastapi import APIRouter, Depends, Request
from auth import verify_jwt
from services import SERVICES
import requests
import aiohttp
import asyncio

router = APIRouter()

async def fetch_data(session: aiohttp.ClientSession, url: str, headers: dict = None):
    async with session.get(url, headers=headers) as response:
        return await response.json()

@router.get("/countries/")
async def list_countries(request: Request, authorization: str = Depends(verify_jwt)):
    headers = {"Authorization": f"Bearer {authorization}"}
    
    async with aiohttp.ClientSession() as session:
        response = await fetch_data(
            session,
            f"{SERVICES['location']}countries/",
            headers=headers
        )
        return response

@router.get("/cities/")
async def list_cities(request: Request, authorization: str = Depends(verify_jwt)):
    headers = {"Authorization": f"Bearer {authorization}"}
    query_params = request.query_params
    
    async with aiohttp.ClientSession() as session:
        response = await fetch_data(
            session,
            f"{SERVICES['location']}cities/",
            headers=headers
        )
        return response

@router.get("/countries/{pk}/")
async def get_country_by_id(pk: int, request: Request, authorization: str = Depends(verify_jwt)):
    headers = {"Authorization": f"Bearer {authorization}"}
    
    async with aiohttp.ClientSession() as session:
        response = await fetch_data(
            session,
            f"{SERVICES['location']}countries/{pk}/",
            headers=headers
        )
        return response

@router.get("/cities/{pk}/")
async def get_city_by_id(pk: int, request: Request, authorization: str = Depends(verify_jwt)):
    headers = {"Authorization": f"Bearer {authorization}"}
    
    async with aiohttp.ClientSession() as session:
        response = await fetch_data(
            session,
            f"{SERVICES['location']}cities/{pk}/",
            headers=headers
        )
        return response

@router.post("/countries/")
async def create_country(request: Request, authorization: str = Depends(verify_jwt)):
    headers = {"Authorization": f"Bearer {authorization}"}
    body = await request.json()
    response = requests.post(f"{SERVICES['location']}countries/", json=body, headers=headers)
    return response.json()

@router.post("/cities/")
async def create_city(request: Request, authorization: str = Depends(verify_jwt)):
    headers = {"Authorization": f"Bearer {authorization}"}
    body = await request.json()
    response = requests.post(f"{SERVICES['location']}cities/", json=body, headers=headers)
    return response.json()
