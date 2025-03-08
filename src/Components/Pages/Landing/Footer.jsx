import React from 'react'
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate(); // Use the useNavigate hook

  const reroutePpov = () => {
    navigate("/https://perspectivepov.co.za/"); // Use navigate function to redirect
  };


  return (
    <div className="Footer">
      <div className="left">
        <div className="copyright-wrapper">
          <div className="left">
            <img src="assets/Logo/WhatsApp Image.jpg" alt="" />
          </div>
          <div className="right">
            <h5>M Junior records international </h5>
            <p>&#169; Mjunior 2025. All rights reserved</p>
          </div>
        </div>

        <div className="partner-wrapper">
          <h4>Partners</h4>
          <div className="left">
            <div className="partner">
            <img src="assets/Logo/images.jpeg" alt="" />
              
                <h5><a href="https://www.virgin.com/virgin-companies/virgin-music" target="_blank" rel="noopener noreferrer">Virgin music group </a></h5>
              
            </div>

            <div className="partner">
              
                <img src="assets/Footer/WhatsApp Business Image.jpg" alt="" />
                <h5><a href="https://www.instagram.com/jefeentertainment_records?igsh=MTk1bXg3Nzl4bmVhaQ==" target="_blank" rel="noopener noreferrer">Jefe Entertainment Records </a></h5>
              
            </div>
          </div>
         
        </div>
      </div>
      <div className="center">
        {/* <ul>
          <li>Home</li>
          <li>Bookings</li>
          <li>Contact</li>
        </ul> */}
      </div>
      <div className="right right-side">
        <h5>
          Follow us @M Junior Records International
        </h5>

        <div className="socials-wrapper">
          <div className="social">
            <a href="https://youtube.com/@mjuniorrecords?feature=shared" target="_blank" rel="noopener noreferrer">
              <img src="assets/Footer/youtube.png" alt="Facebook" />
            </a>
            </div>
          <div className="social">
            <a href="https://www.facebook.com/share/153jUj4ra8/" target="_blank" rel="noopener noreferrer">
              <img src="assets/Footer/facebook.png" alt="Facebook" />
            </a>
          </div>
          <div className="social">
            <a href="https://www.instagram.com/mjuniorrecords?igsh=bWNtMTBkbTE0cTc3" target="_blank" rel="noopener noreferrer">
              <img src="assets/Footer/instagram.png" alt="Instagram" id="instagram"/>
            </a>
          </div>
          <div className="social">
            <a href="https://x.com/Mjuniorrecords?t=o1IeAiGQQIapP4dgVqKfXQ&s=09" target="_blank" rel="noopener noreferrer">
              <img src="assets/Footer/twitter.png" alt="X/twitter" />
            </a>
          </div>
        </div>

        <p>designed&developed {" "}
          <a href="https://perspectivepov.co.za" target="_blank" rel="noopener noreferrer">
            @perspectivepov.co.za
          </a>
        </p>
      </div>
    </div>
  )
}

export default Footer