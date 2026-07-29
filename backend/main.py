import os
import secrets
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import engine, Base, get_db
import models
import schemas
import auth

# 1. Auto-create Database Tables & perform safe schema migrations on startup
Base.metadata.create_all(bind=engine)

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS google_sub VARCHAR;"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS badges JSON DEFAULT '[]';"))
        conn.commit()
    except Exception as e:
        print("[DB Migration Log]:", e)

app = FastAPI(
    title="TypingTutor Web API",
    description="FastAPI Backend for TypingTutor Web Application",
    version="1.0.0"
)

# 2. Universal CORS Setup for Vercel Frontend & Local Dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "TypingTutor Web Backend API",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

# AUTHENTICATION ENDPOINTS

@app.post("/api/auth/register", response_model=schemas.Token)
def register(user_in: schemas.UserRegister, db: Session = Depends(get_db)):
    clean_username = user_in.username.strip().lower()
    clean_email = user_in.email.strip().lower()

    if db.query(models.User).filter(models.User.username == clean_username).first():
        raise HTTPException(status_code=400, detail="Username already taken. Please choose another.")
    if db.query(models.User).filter(models.User.email == clean_email).first():
        raise HTTPException(status_code=400, detail="Email address already registered. Please sign in.")

    new_user = models.User(
        full_name=user_in.fullName.strip(),
        username=clean_username,
        email=clean_email,
        password_hash=auth.get_password_hash(user_in.password),
        xp=0,
        level=1,
        streak_count=0,
        badges=[]
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = auth.create_access_token({"sub": str(new_user.id), "username": new_user.username, "email": new_user.email})
    return {"access_token": token, "token_type": "bearer", "user": new_user}

@app.post("/api/auth/login", response_model=schemas.Token)
def login(login_in: schemas.UserLogin, db: Session = Depends(get_db)):
    clean_ident = login_in.identifier.strip().lower()
    user = db.query(models.User).filter(
        (models.User.email == clean_ident) | (models.User.username == clean_ident)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/username or password."
        )

    if not auth.verify_password(login_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/username or password."
        )

    token = auth.create_access_token({"sub": str(user.id), "username": user.username, "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

# GOOGLE OAUTH ENDPOINTS

@app.get("/api/auth/google/config")
def get_google_config():
    return {"client_id": os.getenv("GOOGLE_CLIENT_ID", "")}

@app.post("/api/auth/google", response_model=schemas.Token)
def google_auth(req: schemas.GoogleAuthRequest, db: Session = Depends(get_db)):
    google_data = auth.verify_google_id_token(req.token)
    email = google_data["email"].strip().lower()
    sub = google_data["sub"]
    name = google_data["name"]

    if not email:
        raise HTTPException(status_code=400, detail="Could not retrieve verified email from Google.")

    user = db.query(models.User).filter(
        (models.User.email == email) | (models.User.google_sub == sub)
    ).first()

    if not user:
        base_username = email.split('@')[0]
        username = base_username
        counter = 1
        while db.query(models.User).filter(models.User.username == username).first():
            username = f"{base_username}{counter}"
            counter += 1

        user = models.User(
            full_name=name,
            username=username,
            email=email,
            password_hash=auth.get_password_hash(secrets.token_urlsafe(32)),
            google_sub=sub,
            xp=0, level=1, streak_count=0, badges=[]
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not user.google_sub:
        user.google_sub = sub
        db.commit()

    token = auth.create_access_token({"sub": str(user.id), "username": user.username, "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

# PASSWORD RESET ENDPOINTS

@app.post("/api/auth/forgot-password")
def forgot_password(req: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    user = db.query(models.User).filter(models.User.email == clean_email).first()
    if user:
        reset_token = auth.create_reset_token(clean_email)
        msg = auth.send_reset_password_email(clean_email, reset_token)
        return {"message": msg}
    return {"message": "If an account exists with this email, a reset link has been sent."}

@app.post("/api/auth/reset-password")
def reset_password(req: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    email = auth.verify_reset_token(req.token)
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    user.password_hash = auth.get_password_hash(req.new_password)
    db.commit()
    return {"message": "Password reset successfully! Please sign in with your new password."}
