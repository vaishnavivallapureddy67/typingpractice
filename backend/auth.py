import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Optional, Dict
import requests
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
import models

SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_typingtutor_jwt_key_2026_change_me_in_prod")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

# Email SMTP Settings (Gmail, SendGrid, Mailgun, etc.)
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://typingpractice-alpha.vercel.app")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    return pwd_context.verify(pwd_bytes, hashed_password)

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    return pwd_context.hash(pwd_bytes)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[models.User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            return None
    except JWTError:
        return None

    user = db.query(models.User).filter(models.User.username == username).first()
    return user

# GOOGLE OAUTH TOKEN VERIFICATION
def verify_google_id_token(token_str: str) -> Dict[str, str]:
    """
    Verifies Google ID Token or Access Token via Google OAuth APIs.
    Returns payload containing 'sub', 'email', 'name', 'picture'.
    """
    # 1. Try Google UserInfo API (for OAuth Access Tokens)
    try:
        resp = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {token_str}"},
            timeout=5
        )
        if resp.status_code == 200:
            data = resp.json()
            if data.get("email"):
                return {
                    "sub": data.get("sub"),
                    "email": data.get("email"),
                    "name": data.get("name", data.get("email", "").split("@")[0]),
                    "picture": data.get("picture", "")
                }
    except Exception:
        pass

    # 2. Try google.oauth2.id_token verification (for ID Tokens)
    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests

        request = google_requests.Request()
        id_info = id_token.verify_oauth2_token(
            token_str, request, GOOGLE_CLIENT_ID if GOOGLE_CLIENT_ID else None
        )
        return {
            "sub": id_info.get("sub"),
            "email": id_info.get("email"),
            "name": id_info.get("name", id_info.get("email", "").split("@")[0]),
            "picture": id_info.get("picture", "")
        }
    except Exception:
        pass

    # 3. Fallback to Google TokenInfo endpoint
    try:
        resp = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token_str}", timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            return {
                "sub": data.get("sub"),
                "email": data.get("email"),
                "name": data.get("name", data.get("email", "").split("@")[0]),
                "picture": data.get("picture", "")
            }
    except Exception:
        pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid Google OAuth credentials. Could not verify account with Google."
    )

# PASSWORD RESET TOKEN & EMAIL FUNCTIONS
def create_reset_token(email: str) -> str:
    """Generates a secure 15-minute JWT reset token for password recovery."""
    expire = datetime.utcnow() + timedelta(minutes=15)
    payload = {"sub": email, "type": "reset_password", "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_reset_token(token_str: str) -> str:
    """Verifies password reset token signature & expiration, returning the email."""
    try:
        payload = jwt.decode(token_str, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "reset_password":
            raise HTTPException(status_code=400, detail="Invalid reset token type.")
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=400, detail="Invalid token payload.")
        return email
    except JWTError:
        raise HTTPException(status_code=400, detail="Password reset token has expired or is invalid.")

def send_reset_password_email(to_email: str, reset_token: str) -> str:
    """Sends password reset email via SMTP, or logs reset link to console if SMTP is not configured."""
    reset_url = f"{FRONTEND_URL}/#reset-password?token={reset_token}"

    if SMTP_USER and SMTP_PASSWORD:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = "Password Reset - TypingTutor Web"
            msg["From"] = f"TypingTutor <{SMTP_USER}>"
            msg["To"] = to_email

            text_content = f"Hello,\n\nYou requested a password reset for TypingTutor. Click the link below to set a new password:\n{reset_url}\n\nThis link expires in 15 minutes."
            html_content = f"""
            <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #4F46E5;">TypingTutor Password Reset</h2>
                <p>Hello,</p>
                <p>You requested a password reset for your TypingTutor account. Click the button below to set a new password:</p>
                <p style="text-align: center; margin: 25px 0;">
                    <a href="{reset_url}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
                </p>
                <p style="font-size: 0.85em; color: #666;">Or copy and paste this URL into your browser:<br><a href="{reset_url}">{reset_url}</a></p>
                <p style="font-size: 0.8em; color: #999;">This link will expire in 15 minutes. If you did not request this, please ignore this email.</p>
            </div>
            """
            msg.attach(MIMEText(text_content, "plain"))
            msg.attach(MIMEText(html_content, "html"))

            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)

            return "Password reset link sent to your email inbox!"
        except Exception as err:
            print(f"[Email Error] Could not send via SMTP: {err}")

    print(f"\n==========================================")
    print(f"🔑 PASSWORD RESET TOKEN GENERATED FOR: {to_email}")
    print(f"🔗 RESET URL: {reset_url}")
    print(f"==========================================\n")
    return f"Reset token generated! (Check server logs or email link: {reset_url})"
