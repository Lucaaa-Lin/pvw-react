import { useEffect, useState, useRef } from "react";
import ProductCard from "../components/ProductCard";
import { client } from "../lib/sanityClient";
import HeroCarousel from "../components/HeroCarousel";

function Home() {
  const [products, setProducts] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedMovements, setSelectedMovements] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [visibleCount, setVisibleCount] = useState(12);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const query = `*[_type == "product"]| order(_createdAt desc) {
        _id,
        _createdAt,
        name,
        brand,
        slug,
        price,
        images,
        gender,
        movement,
        status,
        description
      }`;

      setLoading(true);
      const data = await client.fetch(query);
      setProducts(data);
      setLoading(false);
    }

    fetchProducts();
  }, []);
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function toggleFilter(value, selected, setSelected) {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
    } else {
      setSelected([...selected, value]);
    }

    setVisibleCount(12);
    setIsFilterOpen(false);
  }
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  const genders = ["Men's", "Women's", "Unisex"];

  const brands = [
    "Bulova",
    "Cartier",
    "Hamilton",
    "IWC",
    "Jaeger-LeCoultre",
    "Junghans",
    "Longines",
    "Omega",
    "Rado",
    "Rolex",
    "Seiko",
    "Sinn",
    "Tudor",
    "Others",
  ];

  const movements = [
    "Automatic",
    "Manual Wind",
    "Quartz",
    "Tuning Fork",
    "Pocket Watch",
  ];

  const mainBrands = brands.filter((brand) => brand !== "Others");

  const filteredProducts = products
    .filter((product) => {
      const isOtherBrand = !mainBrands.includes(product.brand);

      const brandMatch =
        selectedBrands.length === 0 ||
        selectedBrands.includes(product.brand) ||
        (selectedBrands.includes("Others") && isOtherBrand);

      const genderMatch =
        selectedGenders.length === 0 ||
        product.gender?.some((gender) => selectedGenders.includes(gender));

      const movementMatch =
        selectedMovements.length === 0 ||
        selectedMovements.includes(product.movement);

      return brandMatch && genderMatch && movementMatch;
    })
    .sort((a, b) => {
      if (sortOption === "price-low") return a.price - b.price;
      if (sortOption === "price-high") return b.price - a.price;
      if (sortOption === "newest") {
        return Date.parse(b._createdAt) - Date.parse(a._createdAt);
      }

      if (sortOption === "oldest") {
        return Date.parse(a._createdAt) - Date.parse(b._createdAt);
      }

      return 0;
    });

  return (
    <main className="home-page">
      <HeroCarousel />
      <div className="page-container">
        <p className="allwatches">All Watches</p>
        <div className="filter-bar">
          <select
            className="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default" disabled>
              Sort by
            </option>
            <option value="newest">Time: Newest first</option>
            <option value="oldest">Time: Oldest first</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <div className="filter-dropdown" ref={filterRef}>
            <button
              type="button"
              className="filter-toggle-btn"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <span className="filter-text">Filter</span>
              <span className="filter-arrow">⌄</span>
            </button>

            {isFilterOpen && (
              <>
                <div
                  className="filter-overlay"
                  onClick={() => setIsFilterOpen(false)}
                />

                <div className="filter-panel">
                  <button
                    type="button"
                    className="filter-close-btn"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    ×
                  </button>
                  <div className="filter-column">
                    <h3>Gender</h3>

                    {genders.map((gender) => (
                      <label key={gender}>
                        <input
                          type="checkbox"
                          checked={selectedGenders.includes(gender)}
                          onChange={() =>
                            toggleFilter(
                              gender,
                              selectedGenders,
                              setSelectedGenders,
                            )
                          }
                        />
                        {gender}
                      </label>
                    ))}
                  </div>

                  <div className="filter-column">
                    <h3>Brand</h3>

                    {brands.map((brand) => (
                      <label key={brand}>
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() =>
                            toggleFilter(
                              brand,
                              selectedBrands,
                              setSelectedBrands,
                            )
                          }
                        />
                        {brand}
                      </label>
                    ))}
                  </div>

                  <div className="filter-column">
                    <h3>Movement</h3>

                    {movements.map((movement) => (
                      <label key={movement}>
                        <input
                          type="checkbox"
                          checked={selectedMovements.includes(movement)}
                          onChange={() =>
                            toggleFilter(
                              movement,
                              selectedMovements,
                              setSelectedMovements,
                            )
                          }
                        />
                        {movement}
                      </label>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="clear-filter-btn"
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedGenders([]);
                      setSelectedMovements([]);
                      setVisibleCount(12);
                      setIsFilterOpen(false);
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {loading ? null : filteredProducts.length === 0 ? (
          <div className="empty-wrapper">
            <div className="empty-state">
              <h2>No watches found</h2>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.slice(0, visibleCount).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {visibleCount < filteredProducts.length && (
          <button
            className="load-more-btn"
            onClick={() => setVisibleCount(visibleCount + 12)}
          >
            Load More
          </button>
        )}
      </div>
    </main>
  );
}

export default Home;
