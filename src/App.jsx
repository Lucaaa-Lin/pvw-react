import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import ProductDetail from './pages/ProductDetail'
import SearchPage from './pages/SearchPage'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
      <div className="site">
        <ScrollToTop />
        
        {/* 顶部导航 */}
        <Header />

        {/* 页面切换区域 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>

        {/* 底部 */}
        <Footer />

      </div>
    </BrowserRouter>
  )
}

export default App
