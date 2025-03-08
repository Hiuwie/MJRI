import React from 'react'
import Header from './Header'
import Services from './Services'
import './LandingStyle.css'
import Footergallary from './Footergallary'
import Footer from './Footer'

import { motion, useScroll, useTransform } from "framer-motion";
import { Parallax } from 'react-parallax';
import Stories from './Stories'

function Landing() {

    // 🔹 Capture Scroll Progress
    const { scrollYProgress } = useScroll();

    // 🔹 Create Transform Animations
    const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const textMove = useTransform(scrollYProgress, [0, 0.5], ["0%", "-30%"]);
    const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);
  
  
  return (
    <div className="landing">

   
          <Header/>
  
        
       
          <motion.div className="aboutus section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ y: textMove }}
          >

            <div className="left">
                <motion.h2 initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                  Know us
                </motion.h2>

                <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
                MJunior Records…ultimate music label home of hits where beats and rhythm meet.. we all about promoting branding new upcoming artists from local to international into the world of fame and superstars in the music market from Tvs Radios social to global
                </motion.p>
            </div>

            <div className="right">
              <div className="stackholders">
                <motion.div  className="image-area" id="image-one" style={{ scale: imageScale }}>
                    {/* <img src="assets/About-us/photo_2025-01-07 15.59.44.jpeg" alt="name" /> */}
                    <img src="assets/About-us/photo_2025-02-20 16.20.06.jpeg" alt="name" />
                </motion.div>
                {/* <div className="image-area" id="image-two">
                  <img src="assets/About-us/photo_2024-11-29 13.38.01.jpeg" alt="name" />
                </div>
                <div className="image-area" id="image-three">
                  <img src="assets/About-us/photo_2025-01-07 16.02.43.jpeg" alt="name" />
                </div> */}
              </div>
            </div>
          
          </motion.div>

        <Services/>

        <Stories/>
        
        <Footergallary/>
        <Footer/>

    </div>
  )
}

export default Landing