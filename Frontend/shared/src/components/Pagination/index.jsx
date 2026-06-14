import { clsx } from 'clsx';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const buttonClasses = (active = false, disabled = false) =>
    clsx(
      'px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
      active
        ? 'bg-blue-600 text-white'
        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300',
      disabled && 'opacity-50 cursor-not-allowed'
    );

  return (
    <div className="flex items-center justify-center space-x-2">
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={buttonClasses(false, currentPage === 1)}
        >
          First
        </button>
      )}

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={buttonClasses(false, currentPage === 1)}
      >
        Previous
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={buttonClasses(page === currentPage)}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={buttonClasses(false, currentPage === totalPages)}
      >
        Next
      </button>

      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={buttonClasses(false, currentPage === totalPages)}
        >
          Last
        </button>
      )}
    </div>
  );
};

export default Pagination;
