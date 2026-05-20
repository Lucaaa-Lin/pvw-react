import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { FaFacebookF, FaEbay, FaInstagram } from 'react-icons/fa'
import logoImage from '../assets/textlogo.png'
import blacklogo from '../assets/blacklogo.png'

function Header() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const searchRef = useRef(null)
  const navigate = useNavigate()

  const handleSearch = () => {
    if (!searchTerm.trim()) return

    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    setSearchTerm('')
    setIsSearchOpen(false)
    setIsMenuOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <header className="header">
      <div className="header-inner">
        <nav className="nav-left">
          <div className="header-home">
            <Link to="/">Home</Link>
          </div>

          <div className="header-about">
            <Link to="/about">About</Link>
          </div>
        </nav>

        <Link to="/" className="logo">
          <img
            src={logoImage}
            alt="Precision Vintage Watches"
            className="logo-image"
          />
        </Link>
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(true)}
          >
            ☰
        </button>

        <div className="nav-right">
          <div className="search-area">
            <div
              className={`search-expand ${isSearchOpen ? 'open' : ''}`}
              ref={searchRef}
            >
              {isSearchOpen && (
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch()
                  }}
                  autoFocus
                />
              )}

              <button
                type="button"
                onClick={() => {
                  if (!isSearchOpen) {
                    setIsSearchOpen(true)
                    return
                  }

                  if (searchTerm.trim()) {
                    handleSearch()
                  } else {
                    setIsSearchOpen(false)
                  }
                }}
              >
                <FiSearch size={26} />
              </button>
            </div>
          </div>

          <div className="social-icons">
            <a
              href="https://www.facebook.com/people/Precision-Vintage-Watches/61587545607793/#"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
            >
              <FaFacebookF size={16} />
            </a>

            <a
              href="https://www.ebay.com.au/sch/i.html?item=147199792751&rt=nc&_trksid=p4429486.m3561.l161211&_ssn=precisionvintagewatches"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
            >
              <FaEbay size={30} />
            </a>

            <a
              href="https://www.instagram.com/precisionvintagewatches"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
            >
              <FaInstagram size={18} />
            </a>
          </div>
        </div>

        {isMenuOpen && (
          <div
            className="mobile-menu-overlay"
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              className="mobile-menu"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="mobile-menu-close"
                onClick={() => setIsMenuOpen(false)}
              >
                ×
              </button>

              <div className="mobile-search">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch()
                  }}
                />

                <button type="button" onClick={handleSearch}>
                  <FiSearch size={20} />
                </button>
              </div>
              <div className='menu-text-btn'>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>

                <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
                <div className='mobile-social-section'>
                  <p className='mobile-follow'>Follow us:</p>
                  <div className="mobile-social">
                    <a
                      href="https://www.facebook.com/people/Precision-Vintage-Watches/61587545607793/#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn"
                    >
                      <FaFacebookF size={16} />
                    </a>

                    <a
                      href="https://www.ebay.com.au/sch/i.html?item=147199792751&rt=nc&_trksid=p4429486.m3561.l161211&_ssn=precisionvintagewatches"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn"
                    >
                      <FaEbay size={30} />
                    </a>

                    <a
                      href="https://www.instagram.com/precisionvintagewatches"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn"
                    >
                      <FaInstagram size={18} />
                    </a>
                  </div>
                </div>
                
              </div>
              <img
                src={blacklogo}
                alt="Precision Vintage Watches"
                className="blacklogo"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header