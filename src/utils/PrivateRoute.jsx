/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.userDetails ? JSON.parse(localStorage.userDetails).token : null;
  
  if(isLoggedIn) {
    return children
  } else {
    return <Navigate to="/login" />
  }
};

export default PrivateRoute;
