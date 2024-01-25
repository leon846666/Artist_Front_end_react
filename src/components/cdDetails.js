import React, { useState, useEffect } from 'react';

// CdDetails  
const CdDetails = ({ cdName }) => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8087/music/tracks?projection=trackDetails')
            .then(response => response.json())
            .then(data => {

                const filteredTracks = data.tracks.filter(track => track.cd === cdName);
                setTracks(filteredTracks);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
                setTracks([]);
            });
    }, [cdName]);

    return (
        <div>
            <h2>CD: {cdName}</h2>
            <ul>
                {tracks.map(track => (
                    <li key={track.id}>{track.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default CdDetails;
