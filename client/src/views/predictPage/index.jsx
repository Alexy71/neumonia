import { useState } from "react"
import { predict } from "../../apis/predict"
import Navbar from "../../components/Navbar"
import ModalRes from "../predictPage/modalRes";


export default function PredictPage() {
  const [file, setFile] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [porcentaje, setPorcentaje] = useState(null)
  const [imageName, setImageName] = useState()
  const [loading, setLoading] = useState(false)
  
  const handlePredict = async () => {
    try {
      if (!file) {
        alert('No se ha seleccionado ningún archivo')
        return
      }
    
    
      const response = await predict(file)

      console.log(response)

      setResultado(response.data[0].className)
      setPorcentaje(response.data[0].probability)
      setImageName(response.data[0].imageName)
      setModalVisible(true)
    }
    catch (error) {
      console.log(error)
    } finally {
      setFile(null)
      
    }
  }

  return (
    <>
      <Navbar activePage={'predict'}/>
      <div className="flex items-center justify-center w-full">
        {
          file && (
            <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <img src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-80 mb-4 " />
                
              </div>
            </div>
          )
        }
        {
          !file &&
          <label htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16">
                <path stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input 
              id="dropzone-file"
              type="file"
              className="hidden" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        }
        
      </div>
      <div className="flex items-center justify-center w-full">
        {
          loading && (
            <div className="mb-6">
              <p>loading...</p>
            </div>
          )
        }
        <button 
          onClick={handlePredict}
          type="button" 
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
            Predecir
        </button>
        <button 
          onClick={() => setFile(null)}
          type="button"
          className="focus:outline-none text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
        >
            Limpiar
        </button>
        <center>
          <ModalRes visible={modalVisible}
            setVisible={setModalVisible}
            resultado={resultado}
            porcentaje={porcentaje}
            imageName={imageName}
          />
        </center>
      </div>

    </>
  )
}

