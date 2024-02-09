from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

app = Flask(__name__)
CORS(app)

conexion = mysql.connector.connect(host="localhost", user="root", passwd="", database="taller-shc134")

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "secreta123"

jwt = JWTManager(app)

@app.route("/")
def root():
    return "Hola mundo"

@app.route("/auth", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    print(email)
    print(password)

    #consultar la tabla de users en la base de datos
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
    data = cursor.fetchone()
    if data is not None:
        #create acces token with data
        dbData = {
            "email": data[1],
            "password": data[2],
            "name": data[3],
            "lastname": data[4],
            "id": data[0]
        }
        access_token = create_access_token(identity=dbData)
        return jsonify({"token": access_token, "email": email}), 201
    else:
        return jsonify({"error": "Invalid email or password"}), 400

# get user protected with jwt
@app.route("/user", methods=['GET'])
@jwt_required()
def get_user():
    current_user_id = get_jwt_identity()    
    return jsonify(current_user_id), 200

# post route predict image

@app.route("/predict", methods=['POST'])
def predict():
    if request.method == 'POST':
        if 'image_file' not in request.files:
            return "No se encuentra la imagen", 400
        
        buf = request.files["image_file"]
        result = detectFromImage(buf)
        return jsonify(result), 200


def detectFromImage(buf):
    """recibe una imagen y devuelve un json con los resultados"""

    return "imagen detectada"

if __name__ == '__main__':
    app.run(host='0.0.0.0',port = 8080)
