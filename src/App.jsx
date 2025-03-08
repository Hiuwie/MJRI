

// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import './App.css';
// import Landing from './Components/Pages/Landing/Landing';
// import Bookings from './Components/Pages/About/Bookings';
// import ProducerAvailability from './Components/Pages/Internal/ProducerAvailability';
// import Signin from './Components/Pages/Internal/Signin';
// import ProtectedRoute from './Components/Pages/Internal/ProtectedRoute';

// function App() {
//   return (
//     <Router>
      
//       <Routes>
//         <Route exact path="/" element={<Landing />} />
//         <Route path="/Bookings" element={<Bookings />} />
//         <Route path="/ProducerAvailability" element={
//           <ProtectedRoute>
//             <ProducerAvailability/>
//           </ProtectedRoute>
//         } />
//         <Route path="/Signin" element={<Signin />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useState, useEffect } from "react";
import "./App.css"; 
import Landing from "./Components/Pages/Landing/Landing";
import Bookings from "./Components/Pages/About/Bookings";
import ProducerAvailability from "./Components/Pages/Internal/ProducerAvailability";
import Signin from "./Components/Pages/Internal/Signin";
import ProtectedRoute from "./Components/Pages/Internal/ProtectedRoute";

function AnimatedRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500); // Simulate page loading
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {loading && <div className="loading-screen">Loading...</div>}
      <TransitionGroup>
        <CSSTransition key={location.pathname} classNames="fade" timeout={500}>
          <Routes location={location}>
            <Route exact path="/" element={<Landing />} />
            <Route path="/Bookings" element={<Bookings />} />
            <Route path="/ProducerAvailability" element={
              <ProtectedRoute>
                <ProducerAvailability />
              </ProtectedRoute>
            } />
            <Route path="/Signin" element={<Signin />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
