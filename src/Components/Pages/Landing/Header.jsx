import React from 'react'
import Nav from './Nav'
import './LandingStyle.css'
import { useNavigate } from 'react-router-dom';
import { Parallax } from 'react-parallax';
import { motion, useScroll, useTransform } from "framer-motion";

function Header() {

    const navigate = useNavigate(); // Use the useNavigate hook

    const handleBookingsClick = () => {
        navigate("/Bookings"); // Use navigate function to redirect
      };


       // 🔹 Capture Scroll Progress
  const { scrollYProgress } = useScroll();

  // 🔹 Create Transform Animations
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
      

  return (

    <>
       
            <Nav/>

          
            <motion.div className="main-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 } }  style={{ opacity: headerOpacity }}>
            <div className="center-area">
                <div className="left">
                    <h1>
                        MJunior Records <br></br> International 
                    </h1>
                    <p>
                        Make your booking now
                    </p>

                    <button onClick={handleBookingsClick}>
                        <p>
                        Book a session now 
                        </p>
                    </button>
                </div>
            </div>

  

    </motion.div>

    </>
  )
}

export default Header