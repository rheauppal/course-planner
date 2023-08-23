import { Container } from 'react-bootstrap';
import Signup from './signup';
import Login from './login';
import React from 'react';
import Layout from './layout';
import About_comp from './about_comp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import Home from './home';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Layout><Signup /> </Layout>} />
        <Route path="/login" element={<Layout><Login /> </Layout>} />
        <Route path="/about" element={<Layout><About_comp /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /> </Layout>} />
        <Route path="/" element={<Layout><Home /> </Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
