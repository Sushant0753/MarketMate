from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail, Message
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from marshmallow import Schema, fields, validate, ValidationError
from dotenv import load_dotenv
import re
import os

load_dotenv()

app = Flask(__name__)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_TOKEN_EXPIRATION', 3600))

# Mail Configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
app.config['MAIL_USE_SSL'] = False

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
mail = Mail(app)
jwt = JWTManager(app)

# Updated CORS Configuration
CORS(app, resources={r"/*": {
    "origins": [
        "http://localhost:3000",  # Common React default port
        "http://localhost:5173",  # Vite default port
        "http://127.0.0.1:5173"   # Sometimes localhost is different from 127.0.0.1
    ],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": [
        "Content-Type", 
        "Authorization", 
        "Access-Control-Allow-Credentials"
    ],
    "supports_credentials": True
}})

# Add CORS handling middleware
@app.after_request
def add_cors_headers(response):
    # If the request origin is allowed, set the appropriate CORS headers
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:5173", 
        "http://127.0.0.1:5173"
    ]
    origin = request.headers.get('Origin')
    
    if origin in allowed_origins:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Access-Control-Allow-Credentials'
    
    return response

# Handle OPTIONS requests for CORS preflight
@app.route('/signup', methods=['OPTIONS'])
@app.route('/login', methods=['OPTIONS'])
@app.route('/profile', methods=['OPTIONS'])
@app.route('/send_email', methods=['OPTIONS'])
def handle_options():
    response = jsonify({'message': 'CORS preflight successful'})
    response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin')
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Access-Control-Allow-Credentials'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


# Validation Schemas
class UserSchema(Schema):
    email = fields.Email(required=True, validate=[
        validate.Length(min=5, max=150, 
        error='Email must be between 5 and 150 characters')
    ])
    password = fields.Str(required=True, validate=[
        validate.Length(min=8, error='Password must be at least 8 characters'),
        validate.Regexp(
            r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$',
            error='Password must include letters, numbers, and special characters'
        )
    ])

class EmailCampaignSchema(Schema):
    recipients = fields.List(
        fields.Email(), 
        required=True, 
        validate=validate.Length(min=1, error='At least one recipient is required')
    )
    subject = fields.Str(
        required=True, 
        validate=validate.Length(min=1, max=200, error='Subject must be between 1 and 200 characters')
    )
    body = fields.Str(
        required=True, 
        validate=validate.Length(min=10, max=5000, error='Body must be between 10 and 5000 characters')
    )

# User model
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)

# Validation helper function
def validate_input(schema_cls, data):
    schema = schema_cls()
    try:
        validated_data = schema.load(data)
        return None  # Return None if validation succeeds
    except ValidationError as err:
        # Return specific error messages, not the input values
        return {
            key: messages[0] if messages else f"Invalid {key}"
            for key, messages in err.messages.items()
        }

# Signup Endpoint
@app.route('/signup', methods=['POST'])
def signup():
    # Validate input
    validation_errors = validate_input(UserSchema, request.json)
    if validation_errors:
        return jsonify({"errors": validation_errors}), 400

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    # Hash password and save user
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    # Generate access token
    access_token = create_access_token(identity=email)

    return jsonify({
        "message": "Signup successful", 
        "access_token": access_token
    }), 201

# Login Endpoint
@app.route('/login', methods=['POST'])
def login():
    # Log the incoming request data
    print("Incoming Login Request:", request.json)

    # Validate input
    validation_errors = validate_input(UserSchema, request.json)
    if validation_errors:
        print("Validation Errors:", validation_errors)
        return jsonify({"errors": validation_errors}), 400

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    # Generate access token
    access_token = create_access_token(identity=email)

    return jsonify({
        "message": "Login successful", 
        "access_token": access_token
    }), 200

# Send Email Endpoint (Protected)
@app.route('/send_email', methods=['POST'])
@jwt_required()  # Requires a valid JWT token
def send_email():
    # Validate input
    validation_errors = validate_input(EmailCampaignSchema, request.json)
    if validation_errors:
        return jsonify({"errors": validation_errors}), 400

    # Get current user
    current_user_email = get_jwt_identity()
    
    data = request.get_json()
    recipients = data.get('recipients')  
    subject = data.get('subject')
    body = data.get('body')

    try:
        # Personalize the email body with sender information
        personalized_body = f"{body}\n\nSent by: {current_user_email}"
        
        msg = Message(
            subject=subject, 
            recipients=recipients, 
            body=personalized_body
        )
        mail.send(msg)
        
        return jsonify({
            "message": "Emails sent successfully", 
            "recipients": recipients
        }), 200
    except Exception as e:
        return jsonify({
            "message": f"Failed to send email: {str(e)}"
        }), 500

# Profile Endpoint (Protected)
@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    return jsonify({
        "email": user.email,
        "is_verified": user.is_verified
    }), 200

# Initialize tables
with app.app_context():
    db.create_all()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')