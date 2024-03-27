/* eslint-disable no-unused-vars */
import React from 'react';
import { Card, Container, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useFetch from "../../hooks/useFetch";
import { useState } from 'react';
import flag from '../../../src/assets/flag-1.svg'
import { Rating } from 'react-simple-star-rating'

const Bookmark = () => {
    const userDetails = localStorage.getItem('userDetails') ? JSON.parse(localStorage.getItem('userDetails')) : null;
    const usersId = userDetails.userId
    const [rating, setRating] = useState(3)
    const navigate = useNavigate();

    let { loading, data, error } = useFetch(`${import.meta.env.VITE_REACT_APP_API_URL}/statuses?filters[users_permissions_user][id][$eq]=${usersId}&filters[isBookmarked][$eq]=true&populate=*`)
    if (loading) return <Container className='bloglist_comp my-5 d-flex justify-content-center align-items-center'>
    <Row>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Row>
  </Container>
    if (error) return <p>Error!</p>

    const handleBookmarkClick = (singleArticleId) => {
        navigate(`/article/${singleArticleId}`);
    };

    const truncateContent = (content) => {
        if (!content) {
            return '';
        }
        if (content.length <= 60) {
            return content;
        } else {
            return content.slice(0, 20) + '...';
        }
    };

    return (
        <div style={{ padding: "10px 12px" }}>
            {
                data?.data.map((bookmark, index) => (

                    <Card className="mb-3 customCard" key={index} style={{ width: "100%", cursor: "pointer" }} onClick={() => handleBookmarkClick(`${bookmark?.attributes?.article?.data?.id}`)}>
                        <Card.Body className='d-flex p-0'>
                            <div>
                                <img src="https://placehold.co/100x100/png" alt="Article Image" style={{ width: "100px" }} />
                            </div>
                            <div className='p-2'>
                                <Container>
                                    <Row className='mb-2'>
                                        <Col className="p-0 article-title" xs={7} sm={7}>{bookmark?.attributes?.article?.data?.attributes?.articleTite}</Col>
                                        <Col className="d-flex p-0 align-items-center article-desc" xs={5} sm={5} ><Rating onClick={() => { }} initialValue={rating} /><span>(12)</span></Col>
                                    </Row>
                                    <Row className='mb-2'>
                                        <Col className='p-0'>{truncateContent(bookmark?.attributes?.article?.data?.attributes?.articleDescription)}</Col>
                                    </Row>
                                    <Row>
                                        <Col className='d-flex gap-2 p-0'>
                                            <Badge className='NewBadge'>
                                                <img src={flag} alt="badge image" style={{ minWidth: "8px", width: "100%", maxWidth: "10px" }} />
                                                <label htmlFor="">New</label>
                                            </Badge>
                                            <Badge className='badgeNormal'>
                                                <label htmlFor="">New</label>
                                            </Badge>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </Card.Body>
                    </Card>
                ))
            }
        </div>
    );
};

export default Bookmark;