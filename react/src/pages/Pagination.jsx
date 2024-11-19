import React from 'react';

const Pagination = ({ page, onNext, onPrev }) => {
  return (
    <div className="pagination">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="pagination-button"
      >
        Previous
      </button>
      <span className="pagination-info">Page {page}</span>
      <button onClick={onNext} className="pagination-button">
        Next
      </button>
    </div>
  );
};

export default Pagination;
