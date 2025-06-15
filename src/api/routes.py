"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash


api = Blueprint('api', __name__)


# Allow CORS requests to this API
CORS(api)


@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        raise APIException('Email and password are required', status_code=400)

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        raise APIException('Email is already taken', status_code=409)

    hashed_password = generate_password_hash(password)
    new_user = User(email=email, password=hashed_password, is_active=True)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully", "user_id": new_user.id}), 201


@api.route('/login', methods=['POST'])
def handle_signin():
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        raise APIException('Email and password are required', status_code=400)

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        raise APIException('Invalid credentials', status_code=401)

    access_token = create_access_token(identity=user.id)

    return jsonify({"token": access_token, "user_id": user.id}), 200
