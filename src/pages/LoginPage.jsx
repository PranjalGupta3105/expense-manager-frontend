import Login from '../components/Login'

// eslint-disable-next-line react/prop-types
const LoginPage = ({ onLoginSuccess }) => {
  // console.log('\nloginpage.jsx', onLoginSuccess);

  return (
    <div>
      <Login onLoginSuccess={onLoginSuccess}/>
    </div>
  )
}

export default LoginPage
