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

  if (!product) return null
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
        <div className='page-container'>
            <div className="product-detail-layout">
            {/* 左边：图片区域 */}
                <section className="product-detail-left">
                    <div
                        className="main-image-wrapper"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        >
                        {/* Desktop：只显示当前图片 */}
                        {selectedImage && (
                            <img
                            className="product-main-image desktop-main-image"
                            src={urlFor(selectedImage).width(900).url()}
                            alt={product.name}
                            onClick={() => setIsZoomOpen(true)}
                            />
                        )}

                        {/* Mobile：滑动图片组 */}
                        <div
                            className="main-image-track mobile-main-track"
                            style={{
                            transform: `translateX(-${selectedIndex * 100}%)`,
                            }}
                        >
                            {product.images?.map((image, index) => (
                            <img
                                key={index}
                                className="product-main-image"
                                src={urlFor(image).width(900).url()}
                                alt={`${product.name} ${index + 1}`}
                                onClick={() => {
                                setSelectedImage(image)
                                setIsZoomOpen(true)
                                }}
                            />
                            ))}
                        </div>

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
                        <p className='productbrand'>{product.brand}</p>
                        <p className='productname'>{product.name}</p>
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

                    <p className='Desription-title'>Description</p>
                    <div className="product-description">
                        {product.description
                            ?.split('\n')
                            .filter((line) => line.trim() !== '')
                            .map((line, index) => (
                            <p key={index}>{line}</p>
                            ))}
                    </div>

                    <p className='Desription-title'>Delivery</p>
                    <p className="product-description">We ship worldwide via Australia Post with parcel tracking.</p>

                    <p className='Desription-title'>Payment</p>
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
                    type="hidden"
                    name="type"
                    value={`${product.brand} ${product.name}`}
                    />

                    <input
                    type="hidden"
                    name="price"
                    value={`$${product.price?.toLocaleString()} AUD`}
                    />

                    <input
                    type="hidden"
                    name="productUrl"
                    value={window.location.href}
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
        </div>
    </main>
    )
}

export default ProductDetail