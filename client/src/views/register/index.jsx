import { useRef ,useEffect, useState } from 'react'
import Webcam from 'react-webcam'

import Navbar from '../../components/Navbar'
import { register } from '../../utils/auth'


const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user"
};


export default function Register(){

  const webcamRef = useRef(null);

  const [error, setError] = useState(null)
  const [data, setData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [photo, setPhoto] = useState(null)

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    if (data.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (data.password !== data.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    setError(null)
  }, [data])

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then((res) => res.blob());
    setPhoto(blob);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!photo) {
      alert("Debe tomar una foto")
      return
    }
    console.log(data)
    if (error) {
      alert(error)
      return
    }

    register(data.email,data.password, data.name, data.lastName, photo).then((res) => {
      console.log(res)
      alert ("Usuario registrado")
    }).catch((err) => {
      console.log(err)
      alert("Error al registrar usuario")
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
            <button onClick={capturePhoto}>Capturar foto</button>
          </div>
          <form>
            <div className="mb-6">
              <label htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">nombre</label>
              <input
                type="text"
                id="name" 
                name="name"
                onChange={handleChange}
                value={data.name}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="name"
                required/>
            </div>
            <div className="mb-6">
              <label htmlFor="lastName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellido</label>
              <input
                type="text"
                id="lastName" 
                name="lastName"
                onChange={handleChange}
                value={data.lastName}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="lastName"
                required/>
            </div>
            <div className="mb-6">
              <label htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">email</label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                value={data.email}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="example@example.com" 
                required/>
            </div>
            <div className="mb-6">
              <label htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Contraseña</label>
              <input type="password"
                id="password"
                name="password"
                onChange={handleChange}
                value={data.password}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required/>
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Confirmar Contraseña</label>
              <input type="password"
                id="confirmPassword"
                name="confirmPassword"
                onChange={handleChange}
                value={data.confirmPassword}
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
              error && (
                <div className="mb-6">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )
            }
            <button 
              type="submit"
              onClick={handleSubmit}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
            Submit
            </button>
          </form>
        </div>
      </div>
    </>
  )
}