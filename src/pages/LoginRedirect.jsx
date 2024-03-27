/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Row, Container, Spinner } from 'react-bootstrap';

const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

const LoginRedirect = (props) => {
  const [text, setText] = useState();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const params = useParams();
  const history = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`${backendUrl}/api/auth/${params.providerName}/callback${location.search}`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error(`Couldn't login to Strapi. Status: ${res.status}`);
        }
        return res;
      })
      .then(res => res.json())
      .then(res => {
        const { blocked, confirmed, email, id: userId, username } = res.user;
        const userDetails = {
          blocked,
          confirmed,
          email,
          userId,
          username,
          token: res.jwt,
        };
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        // localStorage.userDetails = JSON.stringify(userDetails),

        setText('You have been successfully logged in. You will be redirected in a few seconds...');
        setTimeout(() => history('/article-series'), 1000);
        setLoading(true);
      })
      .catch(err => {
        setText('An error occurred, please see the developer console.')
        setLoading(true);
      });
  }, [history, location.search, params.providerName]);

  return <>
    <div>
      {loading ? (
        <Container className='bloglist_comp my-5 d-flex justify-content-center align-items-center'>
          <Row>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Row>
        </Container>
      ) : (
        <p>{text}</p>
      )}
    </div>
  </>
};

export default LoginRedirect;