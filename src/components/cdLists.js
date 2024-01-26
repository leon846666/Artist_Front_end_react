import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/cdList.css';

const apiUrl = 'http://localhost:8087/music/';
const itemsPerPage = 10;

const CDList = () => {
    const [cdList, setCDList] = useState([]);
    const [filteredCdList, setFilteredCdList] = useState([]);
    const [filter, setFilter] = useState('');
    const [sortKey, setSortKey] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [artistInfo, setArtistInfo] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${apiUrl}cds`)
            .then(response => response.json())
            .then(data => {
                setCDList(data._embedded.cds);
                setFilteredCdList(data._embedded.cds);
                data._embedded.cds.forEach(cd => {
                    if (cd._links.artist) {
                        console.log(cd._links.artist)
                        fetchArtistInfo(cd._links.artist.href);
                    }
                })
            })
            .catch(error => console.error('Fetch error:', error));
    }, []);

    // function to get the artist info
    const fetchArtistInfo = (url) => {
        url = url.replace(/\{\?projection\}/g, "");

        fetch(`${url}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(artistData => {
                console.log(artistData)
                setArtistInfo(prevArtistInfo => ({
                    ...prevArtistInfo,
                    [url]: artistData
                }));
            })
            .catch(error => console.error('Fetch artist error:', error));
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleFilter = () => {
        const lowercasedFilter = filter.toLowerCase();
        const filteredData = cdList.filter(item => {
            return (
                item.title?.toLowerCase().includes(lowercasedFilter) ||
                artistInfo[item._links.artist.href.replace(/\{\?projection\}/g, "")]?.name?.toLowerCase().includes(lowercasedFilter) ||
                item.releaseYear?.toString().includes(filter)
            )
        });
        setFilteredCdList(filteredData);
        setCurrentPage(1);
    };

    const handleCdClick = (item) => {
        navigate(`/cd/${item.title}`, { state: item });
    };

    const handleSort = (key) => {
        const newSortOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        setSortKey(key);
    };

    const sortedCDList = [...filteredCdList].sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedCDList = sortedCDList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(filteredCdList.length / itemsPerPage);
    const changePage = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <h2>CD List</h2>
            <div>
                <input
                    type="text"
                    placeholder="Filter by title, artist, or year"
                    value={filter}
                    onChange={handleFilterChange}
                />
                <button onClick={handleFilter}>Filter</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('title')}>Title</th>
                        <th onClick={() => handleSort('artist')}>Artist</th>
                        <th onClick={() => handleSort('releaseYear')}>Release Year</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCDList.map((cd, i) => (
                        <React.Fragment key={i}>
                            <tr onClick={() => handleCdClick(cd)}>
                                <td>{cd.title}</td>
                                <td>{artistInfo[cd._links.artist.href.replace(/\{\?projection\}/g, "")]?.name || 'Loading...'}</td>
                                <td>{cd.releaseYear}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber, i) => (
                    <button
                        key={i}
                        onClick={() => changePage(pageNumber)}
                        disabled={currentPage === pageNumber}
                    >
                        {pageNumber}
                    </button>
                ))}
            </div>
        </div >
    );
};

export default CDList;
