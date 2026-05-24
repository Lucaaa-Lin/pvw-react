import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { client } from '../lib/sanityClient'
import ProductCard from '../components/ProductCard'
import { Link } from 'react-router-dom'

function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [products, setProducts] = useState([])

  useEffect(() => {
    async function fetchProducts() {
      const data = await client.fetch(`
        *[_type == "product" && defined(slug.current)]
      `)

      console.log(data)
      setProducts(data)
    }

    fetchProducts()
  }, [])

    const filteredProducts = products.filter((product) => {
        const keyword = query.toLowerCase().trim()

        if (!keyword) return true

        const normalizeGender = (value) =>
            String(value)
            .toLowerCase()
            .replace(/'/g, '')
            .replace(/\s/g, '')

        const genderMap = {
            men: 'mens',
            man: 'mens',
            mens: 'mens',
            women: 'womens',
            woman: 'womens',
            womens: 'womens',
            unisex: 'unisex',
        }

        if (genderMap[keyword]) {
            const genderText = normalizeGender(product.gender)
            return genderText === genderMap[keyword]
        }

        const productText = JSON.stringify(product).toLowerCase()
        return productText.includes(keyword)
        })

  return (
    <main className="home-page">
        <div className="page-container">
            <div className="search-back-row">
                <Link to="/" className="back-link">
                    ← Back to all watches
                </Link>
            </div>

            {filteredProducts.length === 0 ? (

                <div className="empty-wrapper">
                <div className="empty-state">
                    <h2>No watches found</h2>

                    <p>
                    Try adjusting your search terms.
                    </p>
                </div>
                </div>

            ) : (

                <div className="product-grid">
                {filteredProducts.map((product) => (
                    <ProductCard
                    key={product._id}
                    product={product}
                    />
                ))}
                </div>

            )}
        </div>
    </main>
  )
}

export default SearchPage