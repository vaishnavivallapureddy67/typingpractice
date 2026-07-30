import os
import secrets
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from database import engine, Base, get_db
import models
import schemas
import auth

from sqlalchemy import text

# Auto-create Database Tables on startup
Base.metadata.create_all(bind=engine)

# Safe column migration for pre-existing Render PostgreSQL tables
try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS google_sub VARCHAR;"))
        conn.commit()
except Exception as e:
    print("[DB Migration Notice]:", e)

app = FastAPI(
    title="TypingTutor Web API",
    description="FastAPI Backend for TypingTutor Web Application",
    version="1.0.0"
)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc: Exception):
    import traceback
    traceback.print_exc()
    res = JSONResponse(status_code=500, content={"detail": f"Server Error: {str(exc)}"})
    origin = request.headers.get("origin", "*")
    res.headers["Access-Control-Allow-Origin"] = origin
    res.headers["Access-Control-Allow-Credentials"] = "true"
    return res

# CORS Setup for Vercel Frontend
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
origins = [
    "https://typingpractice-alpha.vercel.app",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:8080",
]
if allowed_origins_env and allowed_origins_env != "*":
    for origin in allowed_origins_env.split(","):
        o = origin.strip()
        if o and o not in origins:
            origins.append(o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "TypingTutor FastAPI Backend",
        "documentation": "/docs",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

# AUTHENTICATION ENDPOINTS

@app.post("/api/auth/register", response_model=schemas.Token)
def register(user_in: schemas.UserRegister, db: Session = Depends(get_db)):
    try:
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
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Registration Error: {str(e)}")

@app.post("/api/auth/login", response_model=schemas.Token)
def login(login_in: schemas.UserLogin, db: Session = Depends(get_db)):
    clean_ident = login_in.identifier.strip().lower()
    user = db.query(models.User).filter(
        (models.User.email == clean_ident) | (models.User.username == clean_ident)
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email/username or password.")

    if not auth.verify_password(login_in.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email/username or password.")

    token = auth.create_access_token({"sub": str(user.id), "username": user.username, "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

# GOOGLE OAUTH ENDPOINTS
@app.get("/api/auth/google/config")
def get_google_config():
    return {"client_id": os.getenv("GOOGLE_CLIENT_ID", "")}

@app.post("/api/auth/google", response_model=schemas.Token)
def google_auth(req: schemas.GoogleAuthRequest, db: Session = Depends(get_db)):
    # 1. Verify Google ID Token
    google_data = auth.verify_google_id_token(req.token)
    email = google_data["email"].strip().lower()
    sub = google_data["sub"]
    name = google_data["name"]

    # 2. Check if User Exists
    user = db.query(models.User).filter(
        (models.User.email == email) | (models.User.google_sub == sub)
    ).first()

    # 3. Create Account if New User
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
            password_hash=auth.get_password_hash(secrets.token_urlsafe(16)),
            google_sub=sub,
            xp=0, level=1, streak_count=0, badges=[]
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not user.google_sub:
        user.google_sub = sub
        db.commit()

    # 4. Return Normal JWT Access Token
    token = auth.create_access_token({"sub": str(user.id), "username": user.username, "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

# FORGOT & RESET PASSWORD ENDPOINTS

@app.post("/api/auth/forgot-password")
def forgot_password(req: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        return {"status": "success", "message": "If an account with this email exists, we've sent a password reset link."}

    reset_token = auth.create_reset_token(email)
    msg = auth.send_reset_password_email(email, reset_token)

    return {
        "status": "success",
        "message": "If an account with this email exists, we've sent a password reset link.",
        "details": msg
    }

@app.post("/api/auth/reset-password")
def reset_password(req: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    # 1. Verify Reset Token
    email = auth.verify_reset_token(req.token)

    # 2. Find User
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    # 3. Update Password Hash
    user.password_hash = auth.get_password_hash(req.new_password)
    db.commit()

    return {"status": "success", "message": "Password reset successful! You can now sign in with your new password."}

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return current_user

# PROGRESS ENDPOINTS

@app.post("/api/progress/stage")
def save_stage_progress(
    progress_in: schemas.StageProgressCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user:
        return {"status": "guest_mode_saved"}

    current_user.xp += 20
    current_user.level = (current_user.xp // 100) + 1

    prog_record = models.LessonProgress(
        user_id=current_user.id,
        category=progress_in.category,
        module_id=progress_in.moduleId,
        lesson_id=progress_in.lessonId,
        difficulty=progress_in.difficulty,
        stars=progress_in.stars,
        wpm=progress_in.wpm,
        accuracy=progress_in.accuracy,
        cpm=progress_in.cpm,
        completed=True
    )
    db.add(prog_record)
    db.commit()

    return {"status": "success", "new_xp": current_user.xp, "level": current_user.level}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
