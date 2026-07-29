from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak_count = Column(Integer, default=0)
    badges = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    progress_records = relationship("LessonProgress", back_populates="user", cascade="all, delete-orphan")
    language_stats = relationship("LanguageStat", back_populates="user", cascade="all, delete-orphan")
    daily_goals = relationship("DailyGoal", back_populates="user", cascade="all, delete-orphan")

class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String, nullable=False, index=True)
    module_id = Column(Integer, nullable=False)
    lesson_id = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    stars = Column(Integer, default=1)
    wpm = Column(Float, default=0.0)
    accuracy = Column(Float, default=100.0)
    cpm = Column(Float, default=0.0)
    completed = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="progress_records")

class LanguageStat(Base):
    __tablename__ = "language_stats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String, nullable=False, index=True)
    best_wpm = Column(Float, default=0.0)
    best_cpm = Column(Float, default=0.0)
    best_accuracy = Column(Float, default=0.0)
    attempts = Column(Integer, default=0)

    user = relationship("User", back_populates="language_stats")

class DailyGoal(Base):
    __tablename__ = "daily_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(String, nullable=False, index=True)  # YYYY-MM-DD
    lessons_completed = Column(Integer, default=0)
    chars_typed = Column(Integer, default=0)
    mins_practiced = Column(Integer, default=0)

    user = relationship("User", back_populates="daily_goals")
