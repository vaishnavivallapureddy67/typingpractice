from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserRegister(BaseModel):
    fullName: str
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    identifier: str
    password: str
    rememberMe: Optional[bool] = True

class GoogleAuthRequest(BaseModel):
    token: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class UserResponse(BaseModel):
    id: int
    fullName: str
    username: str
    email: str
    xp: int
    level: int
    streakCount: int
    badges: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

class StageProgressCreate(BaseModel):
    category: str
    moduleId: int
    lessonId: str
    difficulty: str
    stars: int
    wpm: float
    accuracy: float
    cpm: float
    charsTyped: Optional[int] = 50

class SummaryStatsResponse(BaseModel):
    best_wpm: float
    best_cpm: float
    best_accuracy: float
    completed_lessons: int
    total_stars: int

class WeeklyReportResponse(BaseModel):
    wpmTrend: str
    accuracyTrend: str
    lessonsCompleted: str
    weakKeysFocus: str
