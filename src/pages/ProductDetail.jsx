import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { client, urlFor } from '../lib/sanityClient'

function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [touchStartX, setTouchStartX] = useState(null)

  useEffect(() => {
    async function fetchProduct() {
      const query = `*[_type == "product" && slug.current == $slug][0] {
        _id,
        name,
        brand,
        slug,
        price,
        images,
        gender,
        movement,
        status,
        description
      }`

      const data = await client.fetch(query, { slug })

        setProduct(data)

        // ⭐ 设置默认主图
        if (data?.images?.length > 0) {
        setSelectedImage(data.images[0])
        setSelectedIndex(0)
        }
    }

    fetchProduct()
  }, [slug])

  if (!product) {
    return (
      <main>
        <p>Loading product...</p>
      </main>
    )
  }
  async function handleSubmit(e) {
    e.preventDefault()

    if (cooldown > 0) return

    setIsSubmitting(true)
    setSendSuccess(false)

    const form = e.target
    const formData = new FormData(form)

    const response = await fetch('https://formspree.io/f/xlgaeaka', {
        method: 'POST',
        body: formData,
        headers: {
        Accept: 'application/json',
        },
    })

    setIsSubmitting(false)

    if (response.ok) {
        setSendSuccess(true)

        form.reset()

        // 60秒防重复发送
        setCooldown(60)

        let seconds = 60
        const timer = setInterval(() => {
        seconds -= 1
        setCooldown(seconds)

        if (seconds <= 0) {
            clearInterval(timer)
            setSendSuccess(false)
        }
        }, 1000)
    } else {
        alert('Message failed to send. Please try again.')
    }
    }
    function showPrevImage() {
        const total = product.images.length

        const newIndex =
        (selectedIndex - 1 + total) % total

        setSelectedIndex(newIndex)
        setSelectedImage(product.images[newIndex])
    }

    function showNextImage() {
        const total = product.images.length

        const newIndex =
        (selectedIndex + 1) % total

        setSelectedIndex(newIndex)
        setSelectedImage(product.images[newIndex])
    }

    function handleTouchStart(e) {
    setTouchStartX(e.changedTouches[0].clientX)
    }

    function handleTouchEnd(e) {
    if (touchStartX === null) return

    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX

    if (diff > 50) {
        showNextImage()
    }

    if (diff < -50) {
        showPrevImage()
    }

    setTouchStartX(null)
    }
  return (
    <main className="product-detail-page">
        <div className="product-detail-layout">
        {/* 左边：图片区域 */}
            <section className="product-detail-left">
                <div className="main-image-wrapper"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}>
                    {selectedImage && (
                    <img
                        className="product-main-image"
                        src={urlFor(selectedImage).width(900).url()}
                        alt={product.name}
                        onClick={() => setIsZoomOpen(true)}
                    />
                    )}
                    <button className="image-arrow left" onClick={showPrevImage}>
                        ‹
                    </button>

                    <button className="image-arrow right" onClick={showNextImage}>
                        ›
                    </button>
                </div>

                <div className="product-gallery">
                {product.images?.map((image, index) => (
                    <button
                    key={index}
                    type="button"
                    onClick={() => {
                        setSelectedImage(image)
                        setSelectedIndex(index)
                    }}
                    className={`gallery-button ${
                            selectedIndex === index ? 'active' : ''
                        }`}
                    >
                    <img
                        src={urlFor(image).width(160).url()}
                        alt={`${product.name} ${index + 1}`}
                    />
                    </button>
                ))}
                </div>
            </section>

            {/* 右边：文字区域 */}
            <section className="product-detail-right">
                <div className="product-title-group">
                    <h1>{product.brand}</h1>
                    <h2>{product.name}</h2>
                </div>

                <div className="product-price">
                $ {product.price?.toLocaleString()} AUD
                </div>

                <button
                type="button"
                className="purchase-btn"
                onClick={() => setIsModalOpen(true)}
                >
                Message to Purchase
                </button>

                <h3>Description</h3>
                <p className="product-description">{product.description}</p>

                <h3>Delivery</h3>
                <p className="product-description">We ship worldwide via Australia Post with parcel tracking.</p>

                <h3>Payment</h3>
                <p className="product-description">We accept payment by bank transfer or cash on collection from Granville, NSW.</p>
            </section>

        </div>

        {isModalOpen && (
        <div
            className="modal-overlay"
            onClick={() => setIsModalOpen(false)}
            >
            <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
                >
            <button
                type="button"
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
            >
                X
            </button>

            <form onSubmit={handleSubmit}>
                <label>Subject</label>
                <input
                type="text"
                name="subject"
                value={`Inquiry - ${product.brand} ${product.name}`}
                readOnly
                />

                <input
                type="hidden"
                name="type"
                value={`${product.brand} ${product.name}`}
                />

                <label>Name</label>
                <input type="text" name="name" required />

                <label>Email Address</label>
                <input type="email" name="email" required />

                <label>Message</label>
                <textarea
                name="message"
                defaultValue="Hi, I'm interested in this watch."
                required
                />

                {sendSuccess && (
                <p className="success-message">
                    Message sent successfully.
                </p>
                )}

                <button type="submit" disabled={isSubmitting || cooldown > 0}>
                {isSubmitting
                    ? 'Sending...'
                    : cooldown > 0
                    ? `Send again in ${cooldown}s`
                    : 'Send Message'}
                </button>
            </form>
            </div>
        </div>
        )}
        {isZoomOpen && (
        <div
            className="zoom-overlay"
            onClick={() => setIsZoomOpen(false)}
        >
            <img
            className="zoom-image"
            src={urlFor(selectedImage).width(1600).url()}
            alt={product.name}
            />
        </div>
        )}
    </main>
    )
}

export default ProductDetail