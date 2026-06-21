import { FaFacebookF, FaInstagram, FaEbay } from "react-icons/fa";
import logo from "../assets/Logo.jpg";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-topleft">
            <img src={logo} alt="Precision Vintage Watches" />
          </div>
          <div className="footer-topright">
            <div className="footer-contact">
              <h4 className="footercontacttext">Contact</h4>
              <p>+61 434 936 765</p>
              <p>Suite 1, 247 Church St</p>
              <p>Parramatta, NSW</p>
              <div className="footer-social">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/people/Precision-Vintage-Watches/61587545607793/#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn"
                >
                  <FaFacebookF />
                </a>

                {/* Ebay */}
                <a
                  href="https://www.ebay.com.au/sch/i.html?item=147199792751&rt=nc&_trksid=p4429486.m3561.l161211&_ssn=precisionvintagewatches"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn"
                >
                  <FaEbay />
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/precisionvintagewatches"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Precision Vintage Watches. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
