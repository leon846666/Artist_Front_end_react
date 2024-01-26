import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import '../static/cdDetails.css';

// CdDetails  
const CdDetails = () => {
    const [tracks, setTracks] = useState([]);
    const mLocation = useLocation()
    const navigate = useNavigate();
    const { title } = useParams();


    const handleBack = () => {
        navigate('/');
    };

    useEffect(() => {
        const mItem = mLocation.state
        console.log(mLocation)
        fetch('http://localhost:8087/music/tracks?projection=trackDetails')
            .then(response => response.json())
            .then(data => {
                const filteredTracks = data._embedded.tracks.filter(track => track.cd === mItem.title);
                setTracks(filteredTracks);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
                setTracks([]);
            });
    }, []);

    return (
        <div className="cdDetailsContainer">
            <button onClick={handleBack} className="backButton">CD List</button>

            <h2 className="cdTitle"> {title}</h2>
            <h3 className="trackSubtitle">{tracks.length} Tracks</h3>
            <ul className="trackList">
                {tracks.map(track => (
                    <li key={track.id} className="trackItem">{track.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default CdDetails;
