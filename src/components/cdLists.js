import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
    const history = useHistory();

    useEffect(() => {
        fetch(`${apiUrl}cds`)
            .then(response => response.json())
            .then(data => {
                setCDList(data);
                setFilteredCdList(data);
            })
            .catch(error => console.error('Fetch error:', error));
    }, []);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleFilter = () => {
        const lowercasedFilter = filter.toLowerCase();
        const filteredData = cdList.filter(cd =>
            cd.title.toLowerCase().includes(lowercasedFilter) ||
            cd.artist.toLowerCase().includes(lowercasedFilter) ||
            cd.releaseYear.toString().includes(filter)
        );
        setFilteredCdList(filteredData);
        setCurrentPage(1);
    };

    const handleCdClick = (title) => {
        history.push(`/cd/${title}`);
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
                    {paginatedCDList.map(cd => (
                        <tr key={cd.id} onClick={() => handleCdClick(cd.title)}>
                            <td>{cd.title}</td>
                            <td>{cd.artist}</td>
                            <td>{cd.releaseYear}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <button
                        key={pageNumber}
                        onClick={() => changePage(pageNumber)}
                        disabled={currentPage === pageNumber}
                    >
                        {pageNumber}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CDList;
