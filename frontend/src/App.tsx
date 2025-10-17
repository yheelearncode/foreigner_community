import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
import WritePost from './pages/WritePost';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/write" element={<WritePost />} />
      </Routes>
    </Router>
  );
}


