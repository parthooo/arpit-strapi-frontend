import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function HomePage() {
  return (
    <Row style={{margin: '0px', maxWidth: '375px'}}>
      <Col md={3.5} className='height d-flex align-items-center justify-content-center'>
        <div className='text-center '>
          <h3>Welcome to the my Blog Site!</h3>
          <p>To read my blogs please visit my Article Series Page</p>
          <Button variant="primary" href="/article-series">Series</Button>
        </div>
      </Col>
    </Row>

  );
}

export default HomePage;
