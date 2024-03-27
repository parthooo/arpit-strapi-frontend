import { useEffect, useState } from 'react';

const useFetch = (url) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const getUserToken = () => localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")).token
    : null;
    
     const getAuthorizationHeader = () => `Bearer ${getUserToken()}`;

    useEffect(() => {

        var requestOptions = {
            method: 'GET',
            // headers: {
            //     Authorization: `Bearer ${import.meta.env.VITE_REACT_APP_API_TOKEN}`,
            // },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': getAuthorizationHeader()
            }
        };
        const fetchData = async ()=>{
            setLoading(true)
            try {
                const res = await fetch(url, requestOptions)
                const json = await res.json()
                setData(json)
                setLoading(false)
            } catch (error) {
                setError(error)
                setLoading(false)
            }
        }
        fetchData()
      
    }, [url])



    return {loading, error, data}
};

export default useFetch;