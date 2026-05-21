import about1 from '../assets/about1.jpg'
import about2 from '../assets/about2.jpg'

function About() {
  return (
    <main className="about-page">
      <div className='page-container-about'>
        <section className="about-intro">
          <div className="about-text">
            <p className='mobile-about'>About us</p>
            <div className='about-intro-top'>
              <div className='intro-top-left'>
                <p>
                  At Precision Vintage Watches, we are driven by a passion for the
                  history and unique design sensibilities of mid-century watchmaking.
                  We specialise in curating a collection from the 1950s to the 1980s,
                  featuring Omega, Longines, IWC, Bulova, Rado, Seiko and more.
                </p>

                <p>
                  Based in Sydney, Australia, and shipping to enthusiasts worldwide,
                  we take pride in our exceptional customer reviews and dedicated
                  service. We will help you find the perfect vintage watch that
                  reflects your personal style and appreciation for classic design and
                  craftsmanship.
                </p>

              </div>
              <div className='intro-top-right'>
                <img
                  src={about2}
                  alt="Vintage watch detail"
                  className="about-side-image"
                />
              </div>
              
            </div>
            <div className='about-intro-bottom'>
              <img
                src={about1}
                alt="Vintage watch collection"
                className="about-wide-image"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default About