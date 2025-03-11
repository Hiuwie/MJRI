import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion, useScroll, useTransform } from "framer-motion";
import { Parallax } from "react-parallax";

function Services() {
    const [activeService, setActiveService] = useState(null);
    const navigate = useNavigate();

    const handleServiceClick = (index) => {
      // Toggle active service on click
      setActiveService((prevActiveService) =>
        prevActiveService === index ? null : index
      );
    };

    const handleAboutClcik = () => {
      navigate("/Bookings");
    };

      // 🔹 Capture Scroll Progress
  const { scrollYProgress } = useScroll();

  // 🔹 Create Transform Animations
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textMove = useTransform(scrollYProgress, [0, 0.5], ["0%", "-30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);

  return (
    <div className="Services">
      <h2>Our Services </h2>

      <div className="services-area">

        <div className="services-wrapper">
        
        {[
          {
            label: "PR Marketing",
            description:
              `Get the buzz going with killer press releases and media coverage
              Create a standout artist brand that fans will love
              Level up your socials with smart management and promo
              Snag interviews and epic performance slots
              Bounce back stronger with top-notch crisis management & reputation boosts`,
            // src: "assets/Services/photo_2025-01-22 14.33.35.jpeg", // Add your video source here
            // src: "assets/Services/photo_2024-12-17 17.02.02.jpeg", // Add your video source here
            src: "assets/Services/photo_2025-02-20 14.57.56.jpeg", // Add your video source here

          },
          {
            label: "Music Distribution",
            description:
              `Get your music heard everywhere-Spotify, Apple Music, TikTok, you name it!
              Land your tracks in the hottest online stores like iTunes, Google Play, and Amazon Music
              Take over the airwaves with radio airplay and promo Keep tabs on your success with real-time sales and streaming data
              Choose flexible pricing and royalty options that suit your vibe.`,
            // src: "assets/Services/photo_2025-01-22 14.33.32.jpeg",
            // src: "assets/Services/photo_2024-12-17 17.02.04.jpeg",
            src: "assets/Services/photo_2025-02-20 14.57.46.jpeg",
          },
          {
            label: "Publishing & Recording",
            description:
              `Publish your music and own your creative rights Record in pro studios with top-tier producers
              Collaborate with talented writers to craft your next hit
              Manage licensing deals for TV, film, and ads
              Get personalized guidance to grow your music career`,
            // src: "assets/Services/photo_2025-01-22 14.33.27.jpeg",
            // src: "assets/Services/photo_2024-12-17 17.02.08.jpeg",
            src: "assets/Services/photo_2025-02-20 15.19.25.jpeg",
          },
        ].map((service, index) => (
          <div
            key={index}
            className={`service ${
              activeService === index ? "active" : ""
            }`}
            onClick={() => handleServiceClick(index)}
            onDoubleClick={handleAboutClcik}
          >
            <div className="top-area">
            
              < img
                src={service.src}
                className={activeService === index ? "play" : ""}
              />
            </div>
            <div className="bottom-area">
              <label>{service.label}</label>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
        </div>
      </div>

    </div>
  );
}

export default Services;
