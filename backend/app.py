from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from waitress import serve
import json

from ultralytics import YOLO
from PIL import Image, ImageDraw
import PIL.Image

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

import os
import cv2
from matplotlib import pyplot
from mtcnn.mtcnn import MTCNN
import numpy as np
import mysql.connector
from matplotlib import cm

app = Flask(__name__)
CORS(app)

conexion = mysql.connector.connect(host="localhost", user="root", passwd="", database="taller-shc134")

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "secreta123"

jwt = JWTManager(app)

@app.route("/")
def root():
    return "Hola mundo"

@app.route("/<path:filename>")
def static_files(filename):
    """
    Serve static files from the 'static' directory.
    """
    return send_from_directory("static", filename)

@app.route("/auth", methods=["POST"])
def create_token():
    email = request.form.get("email")
    password = request.form.get("password")
    photo = request.files['image_file']

    print(photo)
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
            "photo": data[5],
            "id": data[0]
        }
        # print photo
        print(dbData["photo"])
        
        newNamePhoto = email+"temp.jpg" # nombre Foto temporal 
        
        photo.save("static/"+newNamePhoto)
        newPath = "http://localhost:8080/"+newNamePhoto

        userPhoto = email+".jpg" # nombre Foto registrada en la base de datos
        # compare userPhoto with newPath 
        img = "static/"+newNamePhoto
        print(img)
        pixeles = pyplot.imread(img)
        detector = MTCNN()
        
        caras = detector.detect_faces(pixeles)
        reg_rostro(img, caras, newNamePhoto)

        rostro_reg = cv2.imread('static/'+userPhoto,0)  #Importamos el rostro del registro
        rostro_log = cv2.imread('static/'+newNamePhoto,0)
        similitud = orb_sim(rostro_reg, rostro_log)
        print(similitud)
        if similitud < 0.5:
            
            return jsonify({"error": "Invalid email or password"}), 400
        else:
            print("Acceso permitido")
            access_token = create_access_token(identity=dbData)
            return jsonify({"token": access_token, "email": email, "similitud_de_rostro": similitud }), 201
    else:
        return jsonify({"error": "Invalid email or password"}), 400

@app.route("/register", methods=["POST"])
def register():
    email = request.form.get("email")
    print(email)
    password = request.form.get("password")
    print(password)
    name = request.form.get("name")
    print(name)
    lastname = request.form.get("lastname")
    print(lastname)
    photo = request.files['image_file']
    print(photo)

    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    data = cursor.fetchone()
    if data is None:
        newPhotoname = email+".jpg"
        photo.save("static/"+newPhotoname)
        newPath = "http://localhost:8080/"+newPhotoname
        #create acces token with data
        
        img = "static/"+newPhotoname
        print(img)
        pixeles = pyplot.imread(img)
        detector = MTCNN()
        print("Detectando rostros...")
        
        caras = detector.detect_faces(pixeles)
        reg_rostro(img, caras, newPhotoname)
        cursor.execute("INSERT INTO users (email, password, name, lastname, photo) VALUES (%s, %s, %s, %s, %s)", (email, password, name, lastname, newPath))
        conexion.commit()
        return jsonify({"message": "User created"}), 200
    else:
        return jsonify({"error": "Email already exists"}), 200


# get user protected with jwt
@app.route("/user", methods=['GET'])
@jwt_required()
def get_user():
    current_user_id = get_jwt_identity()    
    return jsonify(current_user_id), 200

# post route predict image

@app.route("/predict", methods=['POST'])
def predict():
    print(request.files)
    if request.method == 'POST':
        if 'image_file' not in request.files:
            return "No se encuentra la imagen", 200
        
        buf = request.files["image_file"]
        
        boxes , buff= detect_segmentation_on_image(PIL.Image.open(buf.stream))
        maskList = generateMaskList(boxes, buff)
        #result = generateImagePredict(maskList, buff)
        #print(result)
        return jsonify(maskList), 200    
        #result = detectFromImage(buf)
        #return jsonify(result), 200


def detectFromImage(buf):
    """recibe una imagen y devuelve un json con los resultados"""

    return "imagen detectada"

def reg_rostro(img, lista_resultados, usuario_img):
        data = pyplot.imread(img)
        for i in range(len(lista_resultados)):
            x1,y1,ancho, alto = lista_resultados[i]['box']
            x2,y2 = x1 + ancho, y1 + alto
            pyplot.subplot(1, len(lista_resultados), i+1)
            pyplot.axis('off')
            cara_reg = data[y1:y2, x1:x2]
            cara_reg = cv2.resize(cara_reg,(150,200), interpolation = cv2.INTER_CUBIC) #Guardamos la imagen con un tamaño de 150x200
            cv2.imwrite("static/"+usuario_img,cara_reg)
            #pyplot.imshow(data[y1:y2, x1:x2])
        #pyplot.show()

def orb_sim(img1,img2):
    orb = cv2.ORB_create()  #Creamos el objeto de comparacion
 
    kpa, descr_a = orb.detectAndCompute(img1, None)  #Creamos descriptor 1 y extraemos puntos claves
    kpb, descr_b = orb.detectAndCompute(img2, None)  #Creamos descriptor 2 y extraemos puntos claves

    comp = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck = True) #Creamos comparador de fuerza

    matches = comp.match(descr_a, descr_b)  #Aplicamos el comparador a los descriptores

    regiones_similares = [i for i in matches if i.distance < 70] #Extraemos las regiones similares en base a los puntos claves
    if len(matches) == 0:
        return 0
    return len(regiones_similares)/len(matches)  #Exportamos el porcentaje de similitud
        
def detect_segmentation_on_image(buf):
    """
    Function receives an image,
    passes it through YOLOv8 neural network
    and returns an array of detected objects
    and their bounding boxes
    :param buf: Input image file stream
    :return: Array of bounding boxes in format 
    [[x1,y1,x2,y2,object_type,probability],..]
    """
    model = YOLO("best.pt")
    results = model.predict(buf)
    result = results[0]
    output = []
    aux = 0
    #print("results:")
    #print(results)
    #print("result:")
    #print(result)

    for box in result.boxes:

        x1, y1, x2, y2 = [
          round(x) for x in box.xyxy[0].tolist()
        ]
        class_id = box.cls[0].item()
        prob = round(box.conf[0].item(), 2)
        mask = result.masks
        #       mask = result.masks.data[aux]
        output.append([
          x1, y1, x2, y2, result.names[class_id], prob
        ])
        aux = aux + 1
        
        print('mask:')
        #output.append([mask])
        print(output)
        # output [[35, 2, 497, 439, 'pneumonia', 0.79], [None]]
        # delete [None] from output
        newOutput = []
        for out in output:
            if(out[4] != None):
                newOutput.append(out)
        output = newOutput
        print('new output:')
        print(output)
        #print(mask.shape)
        #print(len(mask.tolist()))
    
    return output, buf
def generateMaskList(boxes, imagePil):
    maskList = []
    for idx, box in enumerate(boxes):
        print(box)
        x1, y1, x2, y2, resulName, probability = box
        imgNewName = "mask" +str(idx)+"_"+resulName+".jpg"
        #generate box with x1, y1, x2, y2 and combine with imagePil
        draw = ImageDraw.Draw(imagePil)
        if(resulName == 'normal'):
            draw.rectangle(((x1, y1), (x2, y2)), outline="green", width=3)
        else:
            draw.rectangle(((x1, y1), (x2, y2)), outline="red", width=3)
        # save imagePil
        imagePil.save('static/'+imgNewName, "JPEG")
        data = {
            "imageName": imgNewName,
            'className': resulName,
            'probability': probability,
            'box': [x1, y1, x2, y2]
        }
        maskList.append(data)
        """
        if(resulName == '0'):
            data['file'] = imgNewName
            data['className'] = 'LechugaBuena'
            data['color'] = [149, 240, 78] # color en RGB
            data['probability'] = probability
            data['box'] = [x1, y1, x2, y2]
            maskList.append(data)
        elif(resulName == '1'):
            data['file'] = imgNewName
            data['className'] = 'Septoria'
            data['color'] = [236, 66, 250] # color en RGB
            data['probability'] = probability
            data['box'] = [x1, y1, x2, y2]
            maskList.append(data)
        elif(resulName == '2'):
            data['file'] = imgNewName
            data['className'] = 'Oidio'
            data['color'] = [249, 100, 9] # color en RGB
            data['probability'] = probability
            data['box'] = [x1, y1, x2, y2]
            maskList.append(data)
        else:
            data['file'] = imgNewName
            data['className'] = 'Roya'
            data['color'] = [255, 0, 0]
            data['probability'] = probability
            data['box'] = [x1, y1, x2, y2]
            maskList.append(data)
        """
    print(maskList)
    return maskList

def generateImagePredict(masksImgs, imagePil):
    imgArray = np.array(imagePil)
    img = cv2.cvtColor(imgArray, cv2.COLOR_RGB2BGR)
    imgPath = "static/images/"

    mask_base = np.zeros_like(img)  # Máscara base en blanco

    for maskD in masksImgs:
        mask = cv2.imread(imgPath + maskD['file'], 0)
        print(maskD['color'])
        color = np.array(maskD['color'])
        mask = cv2.resize(mask, (img.shape[1], img.shape[0]))
        mask1_color = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
        mask1_color[mask > 0] = color
        mask_base = cv2.bitwise_or(mask_base, mask1_color)  # Combinar máscara con la máscara base

    alpha = 0.3  # Valor de transparencia (0.0 a 1.0)
    img = cv2.addWeighted(img, 1 - alpha, mask_base, alpha, 0)  # Combinar imagen original y máscara base
    filename = 'imagen_predict.jpg'
    cv2.imwrite('static/'+filename, img)  # Guardar imagen resultante
    result = {
        'imgPredict': filename,
        'maskList': masksImgs
    }
    return result

if __name__ == '__main__':
    app.run(host='0.0.0.0',port = 8080)
