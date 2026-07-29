from pydantic import BaseModel, Field, ConfigDict
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
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: Optional[int] = None
    full_name: str = Field(default="", alias="fullName")
    username: str
    email: str
    xp: Optional[int] = 0
    level: Optional[int] = 1
    streak_count: Optional[int] = Field(default=0, alias="streakCount")
    badges: Optional[List[str]] = []
    created_at: Optional[datetime] = None

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
