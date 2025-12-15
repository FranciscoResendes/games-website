from fastapi import Request
from pydantic import BaseModel
from typing import List, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
# Pydantic model for board input
class BoardRequest(BaseModel):
    board: List[List[int]]

# Helper to get possible candidates for a cell
def get_candidates(board, row, col):
    if board[row][col] != 0:
        return []
    candidates = set(range(1, 10))
    # Remove numbers in the same row
    candidates -= set(board[row])
    # Remove numbers in the same column
    candidates -= set(board[i][col] for i in range(9))
    # Remove numbers in the same 3x3 box
    box_row = row - row % 3
    box_col = col - col % 3
    for i in range(box_row, box_row + 3):
        for j in range(box_col, box_col + 3):
            candidates.discard(board[i][j])
    return list(candidates)

# Find a naked single and explain it
def find_naked_single_hint(board):
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                candidates = get_candidates(board, row, col)
                if len(candidates) == 1:
                    value = candidates[0]
                    explanation = (
                        f"Cell ({row+1},{col+1}) can only be {value} because "
                        f"{value} is missing from its row, column, and 3x3 box."
                    )
                    return {"row": row, "col": col, "value": value, "explanation": explanation}
    return None



app = FastAPI()

@app.post("/api/sudoku/hint")
async def sudoku_hint(req: BoardRequest):
    board = req.board
    hint = find_naked_single_hint(board)
    if hint:
        return {"hint": hint}
    else:
        return {"hint": None, "explanation": "No naked single found. Try a more advanced technique!"}


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
    
    def isValidBox(box_row, box_col, board):
        initial_row_idx = box_row - (box_row % 3)
        initial_col_idx = box_col - (box_col % 3)
        current_box = []

        for i in range(initial_row_idx, initial_row_idx + 3):
            for j in range(initial_col_idx, initial_col_idx + 3):
                    current_box.append(board[i][j])
        if (set(current_box) == set(range(1,10))):
            return True
        return False

    for row in board:
        if not isValidRow(row):
            return False
    for col in range(0,9):
        if not isValidColumn(col):
            return False
    for row in range(0, 9, 3):
        for col in range(0, 9, 3):
            if not isValidBox(row, col, board):
                return False

    return True
