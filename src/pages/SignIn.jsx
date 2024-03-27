/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosOpen } from '../api/axios';
// import { useAuth0 } from '@auth0/auth0-react';

const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
const providersNames = [
  'auth0',
];
const LoginButton = (props) => <a href={`${backendUrl}/api/connect/${props.providerName}`}>
  {props.providerName}
</a>;

const LogoutButton = (props) => <a onClick={props.onClick}>Logout</a>;

const Login = () => {
  const navigate = useNavigate();
  // const { loginWithPopup } = useAuth0();

  const history = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem('jwt'));
  const [userToken, setUserToken] = useState(null);

  const getUserToken = () => localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")).token : ""


  const getAuthorizationHeader = () => `Bearer ${getUserToken()}`;

  const logout = (e) => {
    e.preventDefault();
    localStorage.clear()
    setIsLogged(false);
    history('/')
  };

  let buttons;

  // const handleLoginWithPopup = async (providerName) => {
  //   try {
  //     await loginWithPopup({
  //       connection: providerName, 
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     setErrorMessage('Login failed. Please check your credentials.');
  //   }
  // };

  if (isLogged) {
    buttons = <LogoutButton onClick={logout} />;
  } else {
    buttons = <ul style={{ listStyleType: 'none' }}>
      {providersNames.map((providerName) => <li key={providerName}>
        <LoginButton providerName={providerName} />
      </li>)}
    </ul>;
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  useEffect(() => {
    if (userToken) {
      const { blocked, confirmed, email, id: userId, username } = userToken.user;
      const userDetails = {
        blocked,
        confirmed,
        email,
        userId,
        username,
        token: userToken.jwt,
      };
      localStorage.userDetails = JSON.stringify(userDetails);

      navigate('/article-series');
    }
  }, [userToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getAuthorizationHeader();
      axiosOpen.defaults.headers['Authorization'] = `${token}`;

      const response = await axiosOpen.post(`/auth/local`, formData)
      setUserToken(response?.data);
    } catch (error) {
      console.error(error);
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  let text;

  if (isLogged) {
    text = `Welcome ${localStorage.getItem('username')}, you are connected! `;
  }
  else {
    text = 'You are not connected. Please log in.';
  }

  return (
    <>
      <div className='d-flex justify-content-center mt-5 mb-5'>
        <form onSubmit={handleSubmit} className='w-75'>
          <h3>Sign In</h3>
          {errorMessage && <p>{errorMessage}</p>}
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              name="identifier"
              className="form-control"
              placeholder="Enter email"
              value={formData.identifier}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                &nbsp; Remember me
              </label>
            </div>
          </div>
          <div className="d-grid justify-content-center mb-5">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <div>
            {text}
          </div>
          Login With : <button className='btn btn-primary auth0-btn w-50'> {buttons}</button>
        </form>
      </div>
    </>

  );
};

export default Login;