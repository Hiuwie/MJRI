import React from "react";


function Footergallary() {
    const images = [
        {
          src: "assets/Gallary/-897928835.jpg",
          title: "John Bravo",
          description: "Dancer",
          music: "Click to view music",
          link: "https://onerpm.link/129054087597" // Add a valid URL
        },

        {
          src: "assets/Gallary/photo_2025-02-20 14.57.40.jpeg",
          title: "Yosh B Bahati",
          description: "Afrobeat / Rap",
          music: "Click to view music",
          link: "https://mjuniorrecordsinternational.co.za" // Add a valid URL
        },
        
        {
          src: "assets/Gallary/1594399523.jpg",
          title: "Muki Mingo",
          description: "Bongofleva",
          music: "Click to view music",
          link: "https://label-caster.ffm.to/uyix74212d" // Add a valid URL
        },
        {
          src: "assets/Gallary/photo_2025-01-07 15.51.55.jpeg",
          title: "Tees Papah",
          description: "Rap artist ",
          music: "Click to view music",
          link: "https://mjuniorrecordsinternational.co.za" // Add a valid URL
        },
        {
          src: "assets/Gallary/photo_2025-01-07 15.47.39.jpeg",
          title: "Mukabya Junior",
          description: "Afrobeat Artists",
          music: "Click to view music",
          link: "https://label-caster.ffm.to/1g2g85moj1" // Add a valid URL
        },
        {
          src: "assets/Gallary/photo_2025-01-22 15.05.34.jpeg",
          title: "HelaBoi",
          description: "Hip-hop/ Rap",
          music: "Click to view music",
          link: "https://vmgafrica.lnk.to/GIJoeAr" // Add a valid URL
        },

        {
          src: "assets/Gallary/photo_2025-02-20 14.58.03.jpeg",
          title: "Bonolo",
          description: "Amapiano / Afrobeat",
          music: "Click to view music",
          link: "https://label-caster.ffm.to/xhjyqtgvyq" // Add a valid URL
        },
        {
            src: "assets/Gallary/IMG_7049 (1).jpg",
            title: "Jefe Genius",
            description: "Artist Manager",
            music: "Click to view music",
            link: "https://mjuniorrecordsinternational.co.za" // Add a valid URL
        },

        {
          src: "assets/Gallary/photo_2025-02-20 14.58.02.jpeg",
          title: "Ngoma Nagwa",
          description: "Singeli / Afrobeat",
          music: "Click to view music",
          link: "https://mjuniorrecordsinternational.co.za" // Add a valid URL
      },
        {
            src: "assets/Gallary/photo_2024-11-29 13.37.55.jpeg",
            title: "Gerkey Rsa",
            description: "Afrobeat / Amapiano",
            music: "Click to view music",
            link: "https://label-caster.ffm.to/zroadd0q2y" // Add a valid URL
        },
        {
          src: "assets/Gallary/photo_2025-01-22 15.07.23.jpeg",
          title: "Mira Suka",
          description: "AfroCongo",
          music: "Click to view music",
          link: "https://mjuniorrecordsinternational.co.za" // Add a valid URL
        },
        {
          src: "assets/Gallary/photo_2025-01-22 15.10.45.jpeg",
          title: "Youngz",
          description: "Producer",
          music: "Click to view music",
          link: "https://mjuniorrecordsinternational.co.za" // Add a valid URL
        },
        {
          src: "assets/Gallary/photo_2025-01-22 15.12.30.jpeg",
          title: " ",
          description: "Producer",
          music: "Click to view music",
          link: "https://mjuniorrecordsinternational.co.za" // Add a valid URL
        },
      ];
    

  return (

  <div className="footergallery-container">
  <div className="sliding-images">
    {[...images, ...images].map((image, index) => (
      <a key={index} href={image.link} target="_blank" rel="noopener noreferrer" className="image-wrapper">
        <img src={image.src} alt={image.title} />
        <div className="image-info">
          <h3>{image.title}</h3>
          <p>{image.description}</p>
          <br></br>
          <p><strong>{image.music}</strong></p>
        </div>
      </a>
    ))}
  </div>
</div>
  );
}

export default Footergallary;
