import views from '../views'
import { HOME,LOGIN, PREDICTION, REGISTER} from './paths'


const Home = {
  component: views.Home,
  path: HOME,
  isPrivate: false
}

const Login = {
  component: views.Login,
  path: LOGIN,
  isPrivate: false
}

const PredictPage = {
  component: views.PredictPage,
  path: PREDICTION,
  isPrivate: true
}

const Register = {
  component: views.Register,
  path: REGISTER,
  isPrivate: false
}



// no poner datos despues de Home [Login,..... , Home ];
const exports = [Login, PredictPage, Register ,Home]

export default exports
