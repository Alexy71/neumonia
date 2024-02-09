import {  useState, useRef } from "react";
import Webcam from 'react-webcam'

import Navbar from "../../components/Navbar"
import { login } from "../../utils/auth";
import { useAuth } from "../../provider/authProvider";
// get current url path http://localhost:3000/login
// path = login

import { Link, useLocation, useNavigate } from "react-router-dom";

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user"
};


export default function Login() {
  
  const webcamRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.split('/')[1]

  const [photo, setPhoto] = useState(null)
  const [ email, setEmail]  = useState('');
  const [ password, setPassword ] = useState('');
  const [ loading, setLoading ] = useState(false);

  const { setToken } = useAuth();

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then((res) => res.blob());
    setPhoto(blob);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!photo) {
      alert("Please take a photo")
      return
    }
    if (!email) {
      alert("Please enter an email")
      return
    }
    if (!password) {
      alert("Please enter a password")
      return
    }

    setLoading(true)
    login(email, password, photo).then((res) => {
      console.log(res)
      setToken(res.data.token)
      if (path === 'login') {
        navigate('/')
        return
      }
    }).catch((err) => {
      alert("Error al iniciar sesión", err)
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <>
      <Navbar activePage={'login'}/>
      <div className="flex items-center justify-center w-full">
        <div className="max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="mb-6">
            <label htmlFor="photo"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> photo</label>
            <Webcam
              audio={false}
              height={720}
              screenshotFormat="image/jpeg"
              width={720}
              videoConstraints={videoConstraints}
              ref={webcamRef}
            />
            <button 
              
              onClick={capturePhoto}>Capturar Foto</button>
          </div>
          <form>
            <div className="mb-6">
              <label htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">email</label>
              <input
                type="email"
                id="email" 
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="example@example.com" 
                required/>
            </div>
            <div className="mb-6">
              <label htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> password</label>
              <input type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required/>
            </div>

            {
              photo && (
                <div className="mb-6">
                  <img src={URL.createObjectURL(photo)}
                    alt="photo" />
                </div>
              )
            }
            {
              loading && (
                <div className="mb-6">
                  <p>loading...</p>
                </div>
              )
            }
            {
              !loading && (
                <center>
                  <button 
                    type="submit"
                    onClick={handleSubmit}
              
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
              Iniciar sesión
                  </button>
                </center>
              )
            }
            <Link to="/register"
              className="block text-sm font-medium text-center text-gray-600 dark:text-gray-200 hover:underline mt-2">
                No tienes cuenta? Registrate
            </Link>
          </form>
        </div>
      </div>
    </>
  )
}
