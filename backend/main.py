from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow requests from your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/sudoku")
def get_sudoku():
    # Replace this with your puzzle generation logic
    puzzle = [[0 for _ in range(9)] for _ in range(9)]
    return {"puzzle": puzzle}