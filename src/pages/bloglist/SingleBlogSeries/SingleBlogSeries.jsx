/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SingleBlogSeries.scss';
import { Card, Container, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating'
import flag from '../../../assets/flag-1.svg'


const SingleBlogSeries = ({ article }) => {
    const [articleData, setArticleData] = useState({});
    const usersId = localStorage.userDetails ? JSON.parse(localStorage.userDetails).userId : null;
    const navigate = useNavigate();

    const getUserToken = () => localStorage.getItem("userDetails")
        ? JSON.parse(localStorage.getItem("userDetails")).token
        : null;

    const getAuthorizationHeader = () => `Bearer ${getUserToken()}`;

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



    useEffect(() => {
        (async () => {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/ratings?filters[article][id][$eq]=${article.id}&filters[users_permissions_user][id][$eq]=${usersId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': getAuthorizationHeader()
                }
            })
            let avgRating = 0;
            if (response?.data?.data?.length > 0) {
                avgRating = response?.data?.data?.map((item) => item.attributes.Ratings).reduce((a, b) => a + b, 0) / response?.data?.data?.length;
            }
            setArticleData({ ...article, avgRating, ratingCount: response?.data?.data?.length })
        })();
    }, [])

    const handleArticleSeriesClick = (id) => {
        navigate(`/article/${id}`,{ state: { articleData } })
    };


    return (
            <Card className="mb-3 customCard" style={{ width: "100%", cursor: "pointer" }} onClick={() => handleArticleSeriesClick(`${articleData?.id}`)}>
                <Card.Body className='d-flex p-0'>
                    <div>
                        <img src="https://placehold.co/100x100/png" alt="Article Image" style={{ width: "100px" }} />
                    </div>
                    <div className='p-2' style={{ width: '100%' }}>
                        <Container>
                            <Row className='mb-2'>
                                <Col className="p-0 article-title" xs={12} sm={12}>{articleData?.attributes?.articleTite || "---"}</Col>
                            </Row>
                            <Row className='mb-2'>
                                <Col className="p-0 article-desc d-flex flex-row align-items-center justify-content-end" xs={12} sm={12} >
                                    <Rating readonly="true" onClick={() => { }} initialValue={articleData?.avgRating || 0} /><span>{`(${articleData?.ratingCount || 0})`}</span></Col>
                            </Row>
                            <Row className='mb-2'>
                                <Col className='p-0'>{truncateContent(articleData?.attributes?.articleDescription || "---")}</Col>
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
    )

};

export default SingleBlogSeries;