import { useEffect, useState } from "react";
import "./HeroCarousel.css";

import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";

function HeroCarousel() {
  const slides = [slide1, slide2];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <>
      <section className="hero-carousel">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt={`PVW slide ${index + 1}`}
            className={`hero-slide ${index === currentIndex ? "active" : ""}`}
          />
        ))}

        <div className="hero-content">
          <div className="hero-location">
            <p className="Showroom">Parramatta Showroom</p>
            <p className="Showroom-address">
              Suite 1, 247 Church Street, Parramatta
            </p>
          </div>
          <button
            className="hero-book-button"
            onClick={() => setShowModal(true)}
          >
            Book Appointment
          </button>
        </div>
      </section>

      {showModal && (
        <div
          className="appointment-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="appointment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="appointment-close"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <h2>Book an Appointment</h2>
            <p>
              Contact us to arrange a private viewing for our vintage watches.
            </p>

            <div className="appointment-links">
              <a
                href="https://www.facebook.com/people/Precision-Vintage-Watches/61587545607793/#"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact via Facebook
              </a>

              <a
                href="https://www.instagram.com/precisionvintagewatches"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact via Instagram
              </a>

              <a
                href="https://wa.me/61434936765"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HeroCarousel;
