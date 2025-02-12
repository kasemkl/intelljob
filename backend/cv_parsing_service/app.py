from fastapi import FastAPI , UploadFile, File
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
from sklearn.metrics.pairwise import cosine_similarity
from typing import Optional, List
import spacy
import sys , fitz
import pickle
import numpy as np
import base64
from fastapi.middleware.cors import CORSMiddleware
import aiohttp


# Initialize FastAPI app
app = FastAPI()
# Load Sentence Transformer model
model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')  # Use 'cuda' if GPU is available
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
# Helper function to generate embeddings
def generate_embedding(text: str):
    embedding = model.encode(text)
    return pickle.dumps(embedding)  # Serialize embedding for database storage

# Helper function to calculate similarity
def calculate_similarity(job_embedding : bytes, applicant_embedding : bytes):
    # Deserialize embeddings
    jobSeeker_vector = pickle.loads(applicant_embedding)
    job_vector = pickle.loads(job_embedding)
    
    # Calculate cosine similarity
    similarity = cosine_similarity(
            np.array(jobSeeker_vector).reshape(1, -1),
            np.array(job_vector).reshape(1, -1)
        )[0][0]    
    # Convert to percentage
    similarity_percentage = (similarity + 1) * 50
    return similarity_percentage

# Request body schema
class EmbeddingRequest(BaseModel):
    text: str

class SimilarityRequest(BaseModel):
    jobSeeker_embedding: bytes
    job_embedding: bytes

# API endpoint to generate embeddings
@app.post("/generate-embedding/")
def get_embedding(request: EmbeddingRequest):
    embedding = generate_embedding(request.text)
    embedding_base64 = base64.b64encode(embedding).decode('utf-8')
    return {"embedding": embedding_base64}  

# API endpoint to calculate similarity
@app.post("/calculate-similarity/")
def get_similarity(request: SimilarityRequest):
    # Calculate similarity
    similarity = calculate_similarity(
        base64.b64decode(request.jobSeeker_embedding),
        base64.b64decode(request.job_embedding)
    )
    # Convert similarity to a native Python float
    similarity_percentage = float(similarity)
    return {"similarity_percentage": similarity_percentage}

# Load the trained spaCy model
try:
    nlp = spacy.load('C:/Users/kmak9/Desktop/intelljob/backend/model-best')
except OSError as e:
    print(f"Error loading model: {e}")
    raise

def extract_text_from_pdf(pdf_file):
    """
    Extract text from a PDF file, handling encoding errors gracefully.
    """
    text = ""
    pdf_file.seek(0)
    try:
        with fitz.open(stream=pdf_file.read(), filetype="pdf") as pdf:
            for page in pdf:
                try:
                    text += page.get_text("text")
                except UnicodeDecodeError:
                    print("Warning: Encoding error encountered while reading a PDF page.")
                    continue
    except Exception as e:
        print(f"Error reading PDF: {e}")
        raise HTTPException(status_code=400, detail="Failed to process the PDF file")
    return text

class CVInput(BaseModel):
    text: str

class CVOutput(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    linkedIn_Link: Optional[str] = None
    university: List[str] = []
    skills: List[str] = []
    degree: List[str] = []
    language: List[str] = []
    certification: List[str] = []
    worked_as: List[str] = []
    year_of_experience: List[str] = []
    year_of_graduation: List[str] = []
    awards: List[str] = []
    companies_work_at: List[str] = []

def process_entities(doc) -> dict:
    """
    Process spaCy entities and return structured data
    """
    entities = {
        "name": None,
        "email": None,
        "location": None,
        "linkedIn_Link": None,
        "university": [],
        "skills": [],
        "degree": [],
        "language": [],
        "certification": [],
        "worked_as": [],
        "year_of_experience": [],
        "year_of_graduation": [],
        "awards": [],
        "companies_work_at": []
    }
    
    # Process each entity
    for ent in doc.ents:
        if ent.label_ == "NAME":
            entities["name"] = ent.text
        elif ent.label_ == "EMAIL ADDRESS":
            entities["email"] = ent.text
        elif ent.label_ == "LOCATION":
            entities["location"] = ent.text
        elif ent.label_ == "LINKEDIN LINK":
            entities["linkedIn_Link"] = ent.text
        elif ent.label_ == "UNIVERSITY":
            entities["university"].append(ent.text)
        elif ent.label_ == "SKILLS":
            entities["skills"].append(ent.text)
        elif ent.label_ == "DEGREE":
            entities["degree"].append(ent.text)
        elif ent.label_ == "LANGUAGE":
            entities["language"].append(ent.text)
        elif ent.label_ == "CERTIFICATION":
            entities["certification"].append(ent.text)
        elif ent.label_ == "WORKED AS":
            entities["worked_as"].append(ent.text)
        elif ent.label_ == "YEARS OF EXPERIENCE":
            entities["year_of_experience"].append(ent.text)
        elif ent.label_ == "YEAR OF GRADUATION":
            entities["year_of_graduation"].append(ent.text)
        elif ent.label_ == "AWARDS":
            entities["awards"].append(ent.text)
        elif ent.label_ == "COMPANIES WORKED AT":
            entities["companies_work_at"].append(ent.text)
    
    return entities

@app.post("/extract-data", response_model=CVOutput)
async def extract_data_from_text(input: CVInput):
    try:
        doc = nlp(input.text)
        return process_entities(doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing text: {str(e)}")

@app.post("/extract-data-from-pdf", response_model=CVOutput)
async def extract_data_from_pdf(file: UploadFile = File(...)):
    try:
        # Extract text from PDF
        pdf_text = extract_text_from_pdf(file.file)
        if not pdf_text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the PDF")
        
        # Process the text with spaCy
        doc = nlp(pdf_text)
        
        # Extract and return entities
        return process_entities(doc)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing PDF: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
