/* eslint-disable react/display-name */
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BlogDetails.scss';

const BlogDetail = React.memo(() => {
  const { id } = useParams();
  const [blog, setBlog] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const apiURL = useCallback((endpoint) => `${import.meta.env.VITE_REACT_APP_API_URL}/${endpoint}`, []);

  const handleMarkAsRead = useCallback(async () => {
    try {
      await axios.put(
        apiURL(`statuses/${id}`),
        { data: { isComplete: true } },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_REACT_APP_API_TOKEN}`,
          },
        }
      );
      setIsComplete(true); // Update the state locally
    } catch (error) {
      console.error('Error while making the API call:', error);
    }
  }, [id, apiURL]);

  const handleBookmark = useCallback(async () => {
    try {
      await axios.put(
        apiURL(`statuses/${id}`),
        { data: { isBookmarked: true } },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_REACT_APP_API_TOKEN}`,
          },
        }
      );
      setIsBookmarked(true); // Update the state locally
    } catch (error) {
      console.error('Error while making the API call:', error);
    }
  }, [id, apiURL]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogResponse, statusResponse] = await Promise.all([
          axios.get(apiURL(`articles/${id}`), {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_REACT_APP_API_TOKEN}`,
            },
          }),
          axios.get(apiURL(`statuses/${id}`), {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_REACT_APP_API_TOKEN}`,
            },
          }),
        ]);

        setBlog(blogResponse.data?.data || {});
        if (statusResponse.data?.data?.attributes) {
          const { isComplete, isBookmarked } = statusResponse.data.data.attributes;
          setIsComplete(isComplete);
          setIsBookmarked(isBookmarked);
        }
      } catch (error) {
        console.error('Error while fetching data:', error);
      }
    };

    fetchData();
  }, [id, apiURL]);
  return (
    <div className='blogdetail_comp my-5'>
      <div className="blog-detail">
        <h3 className="blog-title">{blog?.attributes?.articleTite}</h3>
        <p className="blog-content">{blog?.attributes?.articleDescription}</p>
        <div className="category-buttons d-flex">
          {isComplete ? (
            <div className="btn">Done</div>
          ) : (
            <button className="btn btn-light" onClick={handleMarkAsRead}>
              Mark as read
            </button>
          )}
          {isBookmarked ? (
            <div className="btn">Bookmarked</div>
          ) : (
            <button className="btn btn-light" onClick={handleBookmark}>
              Bookmark
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default BlogDetail;
