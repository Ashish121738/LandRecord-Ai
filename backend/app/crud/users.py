from typing import Optional

from sqlalchemy.orm import Session

from app.models.user import User, UserRole


def create_user(
    db: Session,
    name: str,
    email: str,
    password_hash: str,
    role: str = UserRole.CITIZEN,
) -> User:
    user = User(name=name, email=email, password_hash=password_hash, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()