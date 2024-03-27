/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Article.scss'
import useFetch from "../../hooks/useFetch";
import bulb from "../../assets/bulb.svg"
import { useParams, useLocation } from 'react-router-dom';
import { axiosSecure } from '../../api/axios';
import { Row, Card, Button, Spinner, Container } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating'

const ArticlePage = () => {
    const { id } = useParams();
    const location = useLocation();
    const { articleData: receivedData } = location.state || {};
    const [articleData, setArticleData] = useState();
    const [rating, setRating] = useState(3)
    const [customRating, setCustomRating] = useState(null)
    const [bookmark, setBookmark] = useState(false)
    const [readStatus, setReadStatus] = useState(false)
    const [statusId, setStatusId] = useState()

    const getUserToken = () => localStorage.getItem("userDetails")
        ? JSON.parse(localStorage.getItem("userDetails")).token : ""

    const getAuthorizationHeader = () => `Bearer ${getUserToken()}`;

    const userId = localStorage.userDetails ? JSON.parse(localStorage.userDetails).userId : null;

    async function getRating(id, userId) {
        try {
            const { data } = await axiosSecure.get(`/ratings?filters[article][id][$eq]=${id}&filters[users_permissions_user][id][$eq]=${userId}`);
            if (data.data && data.data.length > 0) {
                setCustomRating(data.data[0].attributes.Ratings);
                return {
                    status: true,
                    data: data.data
                };
            }
            return 0;
        } catch (error) {
            console.log(error);
        }
    }

    async function getArticleDetails(id) {
        try {
            const response = await axiosSecure.get(`/articles/${id}`);
            setArticleData(response?.data?.data?.attributes);
        } catch (error) {
            // Handle error
            console.error("Error fetching article details:", error);
        }
    }

    async function updateRating(rate) {
        let endpoint = ''
        let requestBody = {};
        const response = await getRating(id, userId)
        if (response.status) {
            // console.log(response.data[0].id);
            const ratingId = response.data[0].id;
            endpoint = `/ratings/${ratingId}`
            requestBody = {
                "data": {
                    "Ratings": rate,
                    "article": {
                        "id": id
                    },
                    "users_permissions_user": {
                        "id": userId
                    }
                }
            }
            await axiosSecure.put(endpoint, requestBody)
            setCustomRating(rate)
        } else {
            let endpoint = "/ratings"
            let requestBody = {
                "data": {
                    "Ratings": rate,
                    "article": {
                        "id": id
                    },
                    "users_permissions_user": {
                        "id": userId
                    }
                }
            }
            await axiosSecure.post(endpoint, requestBody)
            setCustomRating(rate)
        }
    }

    async function getArticleStatus(id, userId) {
        try {
            const { data } = await axiosSecure.get(`/statuses?filters[article][id][$eq]=${id}&filters[users_permissions_user][id][$eq]=${userId}`);
            if (data.data && data.data.length > 0) {
                setBookmark(data.data[0].attributes.isBookmarked);
                setReadStatus(data.data[0].attributes.isComplete);
                setStatusId(data.data[0].id);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function changeBookmarkStatus(bookmarkValue) {
        try {
            let requestBody = {
                "data":
                {
                    "isBookmarked": bookmarkValue
                }
            }
            await axiosSecure.put(`/statuses/${statusId}`, requestBody);
            setBookmark(bookmarkValue)
        } catch (error) {
            console.log(error);
        }
    }

    async function markRead(readStatusValue) {
        try {
            let requestBody = {
                "data":
                {
                    "isComplete": readStatusValue
                }
            }
            await axiosSecure.put(`/statuses/${statusId}`, requestBody);
            setReadStatus(readStatusValue);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getArticleDetails(id);
        getRating(id, userId);
        getArticleStatus(id, userId)
    }, [])

    const handleRating = (rate) => {
        updateRating(rate)

    }

    const onPointerEnter = () => console.log('Enter')
    const onPointerLeave = (value) => console.log(value)
    const onPointerMove = (value, index) => console.log(value, index)

    let { loading, data, error } = useFetch(`${import.meta.env.VITE_REACT_APP_API_URL}/articles?populate=*`)
    if (loading) return <Container className='bloglist_comp my-5 d-flex justify-content-center align-items-center'>
        <Row>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Row>
    </Container>
    if (error) return <p>Error!</p>


    return (
        <div className='bloglist_comp' style={{ maxWidth: '375px', margin: '0px auto', border: '1px solid #717171' }}>
            <Row className='m-0'>
                <div className='p-0'>
                    <img className='w-100' src="https://placehold.co/600x200/png" />
                    <div className='px-4 py-2 mb-4'>
                        <div className="mainActionDiv">
                            <div className={readStatus === true ? "activeReadDiv" : "ReadDiv"}>
                                <svg width="15" height="15" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12ZM6.50002 11.5905C9.31141 11.5905 11.5905 9.31141 11.5905 6.50002C11.5905 3.68863 9.31141 1.40955 6.50002 1.40955C3.68863 1.40955 1.40955 3.68863 1.40955 6.50002C1.40955 9.31141 3.68863 11.5905 6.50002 11.5905Z" fill="url(#paint0_linear_3_54)" />
                                    <path d="M6.5 12.1528C9.62194 12.1528 12.1528 9.62194 12.1528 6.5H11.8472C11.8472 9.45319 9.45319 11.8472 6.5 11.8472V12.1528ZM12.1528 6.5C12.1528 3.37806 9.62194 0.847222 6.5 0.847222V1.15278C9.45319 1.15278 11.8472 3.54681 11.8472 6.5H12.1528ZM6.5 0.847222C3.37806 0.847222 0.847222 3.37806 0.847222 6.5H1.15278C1.15278 3.54681 3.54681 1.15278 6.5 1.15278V0.847222ZM0.847222 6.5C0.847222 9.62194 3.37806 12.1528 6.5 12.1528V11.8472C3.54681 11.8472 1.15278 9.45319 1.15278 6.5H0.847222ZM6.50002 11.7433C9.39578 11.7433 11.7433 9.39578 11.7433 6.50002H11.4377C11.4377 9.22703 9.22703 11.4377 6.50002 11.4377V11.7433ZM11.7433 6.50002C11.7433 3.60425 9.39578 1.25677 6.50002 1.25677V1.56232C9.22703 1.56232 11.4377 3.773 11.4377 6.50002H11.7433ZM6.50002 1.25677C3.60425 1.25677 1.25677 3.60425 1.25677 6.50002H1.56232C1.56232 3.773 3.773 1.56232 6.50002 1.56232V1.25677ZM1.25677 6.50002C1.25677 9.39578 3.60425 11.7433 6.50002 11.7433V11.4377C3.773 11.4377 1.56232 9.22703 1.56232 6.50002H1.25677Z" fill="url(#paint1_linear_3_54)" />
                                    <path d="M4.05554 6.49996L5.88888 8.33329L8.94443 4.66663" stroke="url(#paint2_linear_3_54)" strokeWidth="0.611111" strokeLinecap="round" strokeLinejoin="round" />
                                    <defs>
                                        <linearGradient id="paint0_linear_3_54" x1="14.4461" y1="4.94631" x2="5.86713" y2="-1.57681" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#2EB695" />
                                            <stop offset="1" stopColor="#1EA5DE" />
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_3_54" x1="14.4461" y1="4.94631" x2="5.86713" y2="-1.57681" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#2EB695" />
                                            <stop offset="1" stopColor="#1EA5DE" />
                                        </linearGradient>
                                        <linearGradient id="paint2_linear_3_54" x1="10.0316" y1="5.98206" x2="7.06422" y2="2.9737" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#2EB695" />
                                            <stop offset="1" stopColor="#1EA5DE" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <label htmlFor="" className='readLabel'>Read</label>
                            </div>
                            <div className="actionDiv">
                                <div className="actionDivBox">
                                    <div className="ratingDiv">
                                        <Rating onClick={() => { }} readonly="true" initialValue={receivedData?.avgRating || 0} /><span>{`(${receivedData?.ratingCount})`}</span>
                                    </div>
                                    <div className="bookmarkDiv">
                                        <Button className={bookmark ? 'active' : ''} onClick={() => changeBookmarkStatus(!bookmark)}>
                                            {/* <img src={bookmark} alt="Bookmark-Icon" /> */}
                                            <svg width="15" height="15" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_3_61)">
                                                    <path d="M12.5995 1.33333H1.39945V14.2708L6.02601 10.0417L6.99945 9.15625L7.97289 10.0417L12.5995 14.2708V1.33333ZM12.7307 0C12.8984 0 13.0588 0.03125 13.212 0.09375C13.4526 0.184028 13.644 0.326389 13.7862 0.520833C13.9284 0.715278 13.9995 0.930556 13.9995 1.16667V14.5938C13.9995 14.8299 13.9284 15.0451 13.7862 15.2396C13.644 15.434 13.4526 15.5764 13.212 15.6667C13.0734 15.7222 12.913 15.75 12.7307 15.75C12.3807 15.75 12.0781 15.6389 11.8229 15.4167L6.99945 11L2.17601 15.4167C1.91351 15.6458 1.61091 15.7604 1.2682 15.7604C1.10049 15.7604 0.940076 15.7292 0.786951 15.6667C0.546326 15.5764 0.354919 15.434 0.212732 15.2396C0.0705444 15.0451 -0.000549316 14.8299 -0.000549316 14.5938V1.16667C-0.000549316 0.930556 0.0705444 0.715278 0.212732 0.520833C0.354919 0.326389 0.546326 0.184028 0.786951 0.09375C0.940076 0.03125 1.10049 0 1.2682 0H12.7307Z" fill="#707070" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_3_61">
                                                        <rect width="14" height="16" fill="white" transform="translate(-0.000549316)" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='articleTitle'>
                            <Card.Title>{articleData?.articleTite}</Card.Title>
                        </div>
                        <p>
                            {articleData?.articleDescription}
                        </p>

                        <div className='d-flex justify-content-center align-items-center p-4 customCardBody'>
                            <div>
                                <img src={bulb} alt="Bulb-icon" />
                            </div>
                            <div className='tipsText' style={{ paddingLeft: '20px' }}>
                                <span>TIP:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dictumst tempor elementum aenean
                            </div>
                        </div>

                        <div className='rateText'>
                            <p>
                                Like this article? Leave a rating:
                            </p>
                            <Rating
                                onClick={handleRating}
                                onPointerEnter={onPointerEnter}
                                onPointerLeave={onPointerLeave}
                                onPointerMove={onPointerMove}
                                initialValue={customRating}
                            />
                        </div>
                        <Button className='mt-2' onClick={() => markRead(!readStatus)}>Mark Read</Button>
                    </div>
                </div>
            </Row>
        </div>
    );
};

export default ArticlePage;