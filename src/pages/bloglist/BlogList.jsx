/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import React from 'react';
import { Button, Col, Row, Accordion, Container, Spinner } from 'react-bootstrap';
import './BlogList.scss';
import SingleBlogSeries from './SingleBlogSeries/SingleBlogSeries';
import useFetch from "../../hooks/useFetch";


const BlogList = React.memo(() => {




  let { loading, data, error } = useFetch(`${import.meta.env.VITE_REACT_APP_API_URL}/article-series-groups?populate=*`)
  if (loading) return <Container className='bloglist_comp my-5 d-flex justify-content-center align-items-center'>
    <Row>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Row>
  </Container>
  if (error) return <p>Error!</p>

  return (
    <div style={{ padding: "10px 20px" }}>
      <Container className='bloglist_comp my-5'>
        <Row>
          {
            data?.data?.map((art, index) => (

              <Accordion key={index} className='p-0'>
                <Accordion.Item eventKey={index} className='acc-item'>
                  <Accordion.Header>{art.attributes.seriesTitle}</Accordion.Header>
                  <Accordion.Body className='d-flex p-0 india'>
                    {
                      art.attributes.articles.data.map((article, index) => (<SingleBlogSeries key={index} article={article} />))
                    }
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ))
          }
        </Row>
      </Container>
    </div>
  );
});

export default BlogList;
