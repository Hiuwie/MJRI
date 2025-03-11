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
                  Know Us
                </motion.h2>

                <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
                {/* MJunior Records…ultimate music label home of hits where beats and rhythm meet.. we all about promoting branding new upcoming artists from local to international into the world of fame and superstars in the music market from Tvs Radios social to global */}
                <h3>Welcome to Mjunior International Records</h3>

                Mjunior International Records is a cutting-edge, independent record label and distributor based in South Africa. Founded in 2024, our mission is to empower artists and creators by providing innovative distribution solutions, publishing services, and expert industry guidance.

                <h3>Our Vision</h3>
                We strive to be a leading force in the global music industry, bridging the gap between emerging artists and international markets. By leveraging our extensive network, expertise, and passion for music, we aim to create new opportunities for artistic growth, collaboration, and success.

                <h3>What We Do</h3>
                At Mjunior International Records, we offer a comprehensive range of services designed to support artists at every stage of their career:

                  <ul>
                    <li>Music Distribution: We deliver your music to major streaming platforms, ensuring global visibility and accessibility.</li>
                    <li>Publishing Services: Our expert team handles publishing administration, royalty collection, and copyright management.</li>
                    <li>Artist Development: We provide guidance, mentorship, and industry insights to help emerging artists navigate the ever-changing music landscape.</li>
                  </ul>

                <h3>Our Values</h3>
                <ul>
                <li>Artistic Integrity: We prioritize creative freedom, empowering artists to produce authentic, innovative music.</li>
                <li>Innovation: We stay ahead of the curve, embracing new technologies, trends, and opportunities.</li>
                <li>Collaboration: We foster strong relationships with artists, industry partners, and stakeholders, driving mutual growth and success.</li>
                </ul>
                Join the Mjunior International Records Family
                If you're an artist, producer, or industry professional looking for a dedicated partner to help you achieve your goals, we'd love to hear from you. Let's shape the future of music together!

                Contact Us Now
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