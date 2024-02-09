import Navbar from "../../components/Navbar"
export default function Home() {
  console.log('Home')
  

  return (
    <>
      <Navbar activePage={'home'}/>
      
      <center>

        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Organizacion mundial de la salud</h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">La neumonía es una forma de infección respiratoria aguda causada con mayor frecuencia por virus o bacterias. Puede causar enfermedades leves o potencialmente mortales en personas de todas las edades; sin embargo, es la principal causa infecciosa de muerte en niños en todo el mundo.</p>
          <a href="https://www.who.int/health-topics/pneumonia"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Leer Mas
            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10">
              <path stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
          </a>
        </div>
      </center>

    </>
  )
}
