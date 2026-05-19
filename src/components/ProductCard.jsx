import { Link } from 'react-router-dom'
import { urlFor } from '../lib/sanityClient'

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.slug.current}`} className="product-card">
      
      {/* 主图 */}
      {product.images && product.images[0] && (
        <div className='product-image-wrapper'>
            <img
            className="product-image"
            src={urlFor(product.images[0]).width(400).url()}
            alt={product.name}
            />
        </div>

      )}
      <div className="productcard-info">
        <h3 className='productcard-brand'>{product.brand}</h3>
        <p className='productcard-name'>{product.name}</p>
        <p className='productcard-price'>${product.price?.toLocaleString()} AUD</p>
      </div>


    </Link>
  )
}

export default ProductCard