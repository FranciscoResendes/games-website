from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/sudoku")
def get_sudoku():
    premade_board = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]
    return {"puzzle": premade_board}

def create_sudoku(fixed_cells=30):
    board = [[0] * 9 for _ in range(9)]

    for num in range(0,9):
        board[num] = list(range(1, 10))
        random.shuffle(board[num])

    return board

def isBoardValid(board):
    def isValidRow(row):
        if (set(row) == set(range(1,10))):
            return True
        return False
    
    def isValidColumn(col):
        column = [board[row][col] for row in range(9)]
        if (set(column) == set(range(1,10))):
            return True
        return False
    

    for row in board:
        if not isValidRow(row):
            return False
    for col in range(0,9):
        if not isValidColumn(col):
            return False

    return True