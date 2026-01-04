import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/addBook.css';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [totalCopies, setTotalCopies] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!title || !author || !isbn || !totalCopies) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const total = parseInt(totalCopies);

    if (isNaN(total)) {
      setErrorMessage('Total copies must be a number');
      return;
    }

    if (total < 0) {
      setErrorMessage('Copies cannot be negative');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          author,
          isbn,
          totalCopies: total,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Book added successfully!');
        alert('Book added successfully!');
        setTitle('');
        setAuthor('');
        setIsbn('');
        setTotalCopies('');
        navigate('/dashboard');
      } else {
        const msg = data.message || 'Failed to add book';
        setErrorMessage(msg);
        alert(msg);
      }
    } catch (err) {
      const msg = 'Network error. Please check if the server is running.';
      setErrorMessage(msg);
      alert(msg);
      console.error('Add book error:', err);
    }
  };

  return (
    <div className="add-book-container">
      <div className="add-book-card">
        <h2>Add New Book</h2>

        {errorMessage && (
          <div className="add-book-error-box">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="add-book-success-box">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="add-book-input-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              className="add-book-input"
            />
          </div>

          <div className="add-book-input-group">
            <label>Author:</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              className="add-book-input"
            />
          </div>

          <div className="add-book-input-group">
            <label>ISBN:</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="Enter ISBN number"
              className="add-book-input"
            />
          </div>

          <div className="add-book-input-group">
            <label>Total Copies:</label>
            <input
              type="number"
              value={totalCopies}
              onChange={(e) => setTotalCopies(e.target.value)}
              placeholder="Enter total number of copies"
              className="add-book-input"
              min="0"
            />
          </div>

          <button type="submit" className="add-book-button">
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;

