import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthorsPage from './pages/AuthorsPage';
import BooksPage from './pages/BooksPage';
import CustomersPage from './pages/CustomersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/authors" element={<AuthorsPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/customers" element={<CustomersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
