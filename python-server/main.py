import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel

# LangChain components - UPDATED IMPORTS
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter # <-- CORRECTED IMPORT
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# --- CONFIGURATION ---
# ... existing code ...
UPLOADS_DIR = "temp_uploads"
# ... existing code ...
CHROMA_DIR = "chroma_db"
# ... existing code ...
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

# --- FastAPI App Initialization ---
app = FastAPI(
    title="Python RAG Server",
    description="A server for processing documents and retrieving information using RAG.",
)

# --- Pydantic Models for Request/Response ---
class ProcessResponse(BaseModel):
# ... existing code ...
    collection_id: str
    chunks_indexed: int
    filename: str

class RetrieveRequest(BaseModel):
# ... existing code ...
    collection_id: str
    question: str
    top_k: int = 3

class Source(BaseModel):
# ... existing code ...
    id: str
    filename: str
    page_number: int
    score: float
    text_snippet: str

class RetrieveResponse(BaseModel):
# ... existing code ...
    sources: list[Source]

class GetTextResponse(BaseModel):
    text: str

# --- Helper Functions ---
def get_vector_store(collection_name: str):
# ... existing code ...
    """Initializes and returns a Chroma vector store."""
    # Ensure the persistence directory exists
    persist_directory = os.path.join(CHROMA_DIR, collection_name)
    
    # Initialize embeddings
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    
    # Initialize ChromaDB
    vector_store = Chroma(
        collection_name=collection_name,
        embedding_function=embeddings,
        persist_directory=persist_directory,
    )
    return vector_store

# --- API Endpoints ---
@app.post("/process/", response_model=ProcessResponse, status_code=201)
async def process_pdf(file: UploadFile = File(...)):
# ... existing code ...
    """
    Processes an uploaded PDF file, chunks it, creates embeddings, and stores them.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDFs are accepted.")

    # Create a unique collection ID based on the filename and current time
    collection_id = f"rag_{os.path.splitext(file.filename)[0]}_{int(os.path.getmtime(UPLOADS_DIR) if os.path.exists(UPLOADS_DIR) else 0)}"
    
    # Ensure the temporary uploads directory exists
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    file_path = os.path.join(UPLOADS_DIR, file.filename)

    # Save the uploaded file temporarily
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 1. Load the document
        loader = PyPDFLoader(file_path)
        documents = loader.load()

        # 2. Split the document into chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = text_splitter.split_documents(documents)

        if not chunks:
            raise HTTPException(status_code=404, detail="Could not extract any text from the PDF.")

        # 3. Create vector store and add documents
        vector_store = get_vector_store(collection_id)
        vector_store.add_documents(chunks)
        vector_store.persist() # Save to disk

        return ProcessResponse(
            collection_id=collection_id,
            chunks_indexed=len(chunks), 
            filename=file.filename,
        )
    finally:
        # Clean up the uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)


@app.post("/retrieve/", response_model=RetrieveResponse)
async def retrieve_chunks(request: RetrieveRequest):
# ... existing code ...
    """
    Retrieves the most relevant document chunks for a given question.
    """
    try:
        # Initialize the existing vector store
        vector_store = get_vector_store(request.collection_id)
        
        # Perform similarity search
        results = vector_store.similarity_search_with_score(
            query=request.question,
            k=request.top_k,
        )

        # Format the results
        sources = []
        for i, (doc, score) in enumerate(results):
            sources.append(Source(
                id=f"chunk_{i}", # Simple ID
                filename=doc.metadata.get("source", "Unknown"),
                page_number=doc.metadata.get("page", 0) + 1, # Page numbers are often 0-indexed
                score=score,
                text_snippet=doc.page_content,
            ))
        
        return RetrieveResponse(sources=sources)

    except Exception as e:
        # This can happen if the collection_id doesn't exist
        print(f"Error retrieving chunks: {e}")
        raise HTTPException(status_code=404, detail=f"Collection '{request.collection_id}' not found or error during retrieval.")

@app.get("/get-text/{collection_id}", response_model=GetTextResponse)
async def get_full_text(collection_id: str):
    """
    Retrieves the full original text for a given collection.
    This is a simplified example and assumes the original file is accessible
    or that the text is stored elsewhere. For this implementation, we'll
    re-load and re-process the file, which is inefficient but functional.
    
    A better approach would be to store the full text in a database or file
    and retrieve it directly.
    """
    # This is a workaround: we need to find the original file.
    # Since we don't store it, we can't easily retrieve the full text.
    # Let's assume for now that we can't implement this without bigger changes.
    # We will return the text from the vector store instead.
    try:
        vector_store = get_vector_store(collection_id)
        # This is not ideal as it fetches all chunks and joins them,
        # but it's the best we can do without storing the original text.
        all_docs = vector_store.get(include=["documents"])
        full_text = "\n\n".join(all_docs['documents'])
        return GetTextResponse(text=full_text)
    except Exception as e:
        print(f"Error getting full text: {e}")
        raise HTTPException(status_code=404, detail=f"Could not retrieve full text for collection '{collection_id}'.")

# Health check endpoint
@app.get("/health")
def health_check():
# ... existing code ...
    return {"status": "ok"}