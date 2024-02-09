/* eslint-disable no-nested-ternary */
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { useAuth } from "../provider/authProvider";
import routes_ from './routes'
import views from '../views'

export default function AppRouter () {
  const { token } = useAuth();
  const [isLogged, setIsLogged] = useState(false)
  useEffect(() => {
    if (token) {
      setIsLogged(true)
      console.log('logged')
    }
    else {
      setIsLogged(false)
      console.log('not logged')
    }
  }, [token])


  return (
    <BrowserRouter>
      <Routes>
        {routes_.map((rout) => (
          <Route
            key={rout.path}
            path={rout.path}
            element={
              rout.isPrivate
                ? (
                  isLogged
                    ? (
                      <rout.component />
                    )
                    : (
                      <views.Login />
                    )
                )
                : (
                  <rout.component />
                )
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
