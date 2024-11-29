from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate
import os
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

app = Flask(__name__)
CORS(app)
load_dotenv()

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Mail Configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
app.config['MAIL_USE_SSL'] = False

#Gemini Config
app.config['API_KEY'] = os.getenv('API_KEY')
genai.configure(api_key=app.config['API_KEY'])

mail = Mail(app)
db = SQLAlchemy(app)
model = genai.GenerativeModel("gemini-1.5-flash-8b")

# User model
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Route to create tables
with app.app_context():
    db.create_all()

# Signup Endpoint
@app.route('/signup', methods=['POST'])
def signup():
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

    return jsonify({"message": "Signup successful"}), 201

# Login Endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful"}), 200



# Send Email Endpoint
@app.route('/send_email', methods=['POST'])
def send_email():
    data = request.get_json()
    recipients = data.get('recipients')  
    subject = data.get('subject')
    body = data.get('body')

    if not recipients or not subject or not body:
        return jsonify({"message": "Invalid input"}), 400

    try:
        msg = Message(subject=subject, recipients=recipients, body=body)
        mail.send(msg)
        return jsonify({"message": "Emails sent successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Failed to send email: {str(e)}"}), 500

@app.route('/generate_email', methods=['POST'])
def generate_email():

    data = request.get_json()

    company_name = data.get('companyName')
    purpose = data.get('purpose')
    trigger_type = data.get('triggerType')
    additional_details = data.get('additionalDetails')

    # Create the prompt for the generative model based on the incoming data
    prompt = f"Generate an email for {company_name} with the purpose '{purpose}'. The trigger is '{trigger_type}'. Additional details: {additional_details}."

    try:
        response = model.generate_content(prompt)

        return jsonify({
            "generated_email": response.text
        })
    
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500



if __name__ == '__main__':
    app.run()
