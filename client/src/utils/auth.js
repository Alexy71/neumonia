import axios from "axios";

const baseUrl = "http://localhost:8080";


export const login = async (email, password, photo) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("image_file", photo);
  
  return await axios.post(`${baseUrl}/auth`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
}

export const register = async (email, password, name, lastName, photo) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("name", name);
  formData.append("lastname", lastName);
  formData.append("image_file", photo);

  return await axios.post(`${baseUrl}/register`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
}