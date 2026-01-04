import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/dashboard.css';
import '../styles/addBook.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchBooks = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/books', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const msg = data.message || 'Failed to fetch books';
        setErrorMessage(msg);
        alert(msg);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setBooks(data);
      setLoading(false);
    } catch (err) {
      const msg = 'Network error while fetching books. Please check if the server is running.';
      setErrorMessage(msg);
      alert(msg);
      setLoading(false);
      console.error('Fetch books error:', err);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    fetchBooks();
  }, [navigate, fetchBooks]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleIssue = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/books/${bookId}/issue`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg = data.message || 'Failed to issue book';
        alert(msg);
        return;
      }

      fetchBooks();
    } catch (err) {
      alert('Network error while issuing book');
      console.error('Issue book error:', err);
    }
  };

  const handleReturn = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/books/${bookId}/return`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg = data.message || 'Failed to return book';
        alert(msg);
        return;
      }

      fetchBooks();
    } catch (err) {
      alert('Network error while returning book');
      console.error('Return book error:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Library Management System</h1>
        <button onClick={handleLogout} className="dashboard-logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-top-row">
          <div>
            <h2>Welcome to Dashboard</h2>
            <p>You have successfully logged in!</p>
          </div>
        </div>

        <div className="dashboard-add-book-section">
          <Link to="/add-book" className="dashboard-add-book-link">
            Add New Book
          </Link>
        </div>

        {loading && <p className="loading-message">Loading books...</p>}

        {errorMessage && (
          <div className="add-book-error-box">
            {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && books.length === 0 && (
          <p className="no-books-message">No books found. Please add a book.</p>
        )}

        {!loading && books.length > 0 && (
          <div className="books-list">
            {books.map((book) => (
              <div key={book._id} className="book-card">
                <h4 className="book-card-title">{book.title}</h4>
                <p className="book-card-author">by {book.author}</p>
                <p className="book-card-isbn">
                  ISBN: <strong>{book.isbn}</strong>
                </p>
                <p className="book-card-available">
                  Available: <strong>{book.availableCopies}</strong>
                </p>
                <p className="book-card-issued">
                  Issued: <strong>{book.issuedCopies || 0}</strong>
                </p>

                <div className="book-card-buttons">
                  <button
                    className="book-button issue-button"
                    onClick={() => handleIssue(book._id)}
                    disabled={book.availableCopies <= 0}
                  >
                    Issue
                  </button>
                  <button
                    className="book-button return-button"
                    onClick={() => handleReturn(book._id)}
                  >
                    Return
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
