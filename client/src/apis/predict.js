import axios from "axios";
const API_URL = "http://localhost:8080";

/*
@app.route("/predict", methods=['POST'])
def predict():
    if request.method == 'POST':
        if 'file' not in request.files:
            return "No se encuentra la imagen", 400
        
        buf = request.files["image_file"]
        result = detectFromImage(buf)
        return jsonify(result), 200
*/
// create request with image file
export const predict = async (image_file) => {
  const formData = new FormData();
  formData.append("image_file", image_file);

  return await axios.post(`${API_URL}/predict`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};




        