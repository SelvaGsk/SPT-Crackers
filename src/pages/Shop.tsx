// @ts-nocheck
import React, { useEffect, useState, useMemo } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaYoutube, FaTable, FaThLarge, FaFilter } from "react-icons/fa";
import { useFirebase } from "@/Services/context";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination";
import toast from "react-hot-toast";
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { ProductCardComponent } from "@/components/ProductCard";
import CartSummary from "@/components/CartSummary";
import Footer from "@/components/Footer";

// const TAGS = ['Best Selling', 'New Arrival', 'Recommended', 'Childrens Items', 'Popular Items'];
const SORT_OPTIONS = {
  DEFAULT: 'Default',
  NAME_ASC: 'Name: A to Z',
  NAME_DESC: 'Name: Z to A',
  PRICE_ASC: 'Price: Low to High',
  PRICE_DESC: 'Price: High to Low',
};




export const ProductCard = React.memo(({ product }) => {
  const { toggleWishList, wishlistIds, toggleCart, cartItems, updateCartQty } = useFirebase();
  const isInWishlist = wishlistIds.includes(product.id);
  const currentProduct = cartItems?.[product.productId];
  const qty = currentProduct?.qty || 0;

  const [showZoom, setShowZoom] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const productImages = [product.productImageURL, product.productImageURL2].filter(Boolean);

  return (
    <>
      <ProductCardComponent product={product} />
    </>
  );

  <Footer/>
});


export const ProductTableRow = React.memo(({ product }) => {
  const { toggleWishList, wishlistIds, toggleCart, cartItems, updateCartQty } = useFirebase();
  const isInWishlist = wishlistIds.includes(product.id);
  const currentProduct = cartItems?.[product.productId];
  const qty = currentProduct?.qty || 0;

  const [zoomImage, setZoomImage] = useState(false);

  return (
    <>
      {/* ✅ Mobile View */}
      <tr className="block sm:hidden border-b p-2">
        <td className="block w-full">
          <div className="flex items-center justify-between gap-2 w-full overflow-hidden">

            {/* 🔍 Clickable Image for Zoom */}
            <img
              src={product.productImageURL}
              alt={product.productName}
              onClick={() => setZoomImage(true)}
              className="w-14 h-14 object-cover rounded-md flex-shrink-0 cursor-pointer"
            />

            {/* Name + Price in one line with wrapping only product name */}
            <div className="flex flex-col justify-center max-w-[140px] text-xs">
              <p className="font-semibold leading-tight truncate">{product.productName}</p>
              <div className="flex gap-1 text-[11px] whitespace-nowrap">
                <span className="text-red-500 line-through">₹{product.beforeDiscPrice?.toFixed(2)}</span>
                <span className="text-green-600 font-bold">₹{product.salesPrice?.toFixed(2)}</span>
              </div>
            </div>

            {/* Add / Qty Button */}
            <div className="flex-shrink-0">
              {qty > 0 ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateCartQty(product.productId, "dec")}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                  >−</button>
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => updateCartQty(product.productId, parseInt(e.target.value))}
                    className="w-10 text-center border rounded text-xs"
                  />
                  <button
                    onClick={() => updateCartQty(product.productId, "inc")}
                    className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                  >+</button>
                </div>
              ) : (
                <Button
                  className="bg-green-500 text-white text-xs px-3 py-1"
                  onClick={() => toggleCart(product)}
                >
                  Add
                </Button>
              )}
            </div>
          </div>
        </td>
      </tr>

      {/* ✅ Desktop View */}
      <tr className="hidden sm:table-row border-b">
        <td className="p-2 w-[60px] lg:w-[90px]">
          <img
            src={product.productImageURL}
            alt={product.productName}
            className="w-20 h-20 object-cover rounded-md"
          />
        </td>
        <td className="p-2 w-[120px]">{product.productName}</td>
        <td className="p-2 w-[90px] text-red-500 line-through">
          ₹{product.beforeDiscPrice?.toFixed(2)}
        </td>
        <td className="p-2 w-[90px] text-emerald-600">
          ₹{product.salesPrice?.toFixed(2)}
        </td>
        <td className="p-2 w-[140px]">
          {qty > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateCartQty(product.productId, "dec")}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => updateCartQty(product.productId, parseInt(e.target.value))}
                className="w-16 text-center border rounded px-2 py-1"
              />
              <button
                onClick={() => updateCartQty(product.productId, "inc")}
                className="px-2 py-1 bg-green-500 text-white rounded"
              >
                +
              </button>
            </div>
          ) : (
            <Button
              className="bg-green-500 text-white text-sm"
              onClick={() => toggleCart(product)}
            >
              Add
            </Button>
          )}
        </td>
      </tr>

      {/* ✅ Modal for zoomed image */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setZoomImage(false)}
        >
          <div
            className="relative bg-white rounded-md p-2 max-w-[90%] max-h-[90%]"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <img
              src={product.productImageURL}
              alt={product.productName}
              className="max-h-[80vh] object-contain rounded"
            />
            <button
              onClick={() => setZoomImage(false)}
              className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-sm rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
});


const Shop = () => {
  const { searchTerm, products,TAGS, Categories } = useFirebase();
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filteredproducts, setFilteredproducts] = useState([]);
  // const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('DEFAULT'); // NEW
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [searchParams, setSearchParams] = useSearchParams();
  const tagFromURL = searchParams.get('tag');
  const categoryFromURL = searchParams.get('category');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleViewChange = (mode: 'grid' | 'list') => {
    setSearchParams({ view: mode });
  };
 
  const totalPages = Math.ceil(filteredproducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredproducts.slice(start, start + itemsPerPage);
  }, [filteredproducts, currentPage]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchTerm.toLowerCase());
    }, 300);
  
    const mode = searchParams.get('view');
    if (mode === 'list' || mode === 'grid') {
      setViewMode(mode);
    }
  
    return () => clearTimeout(delay);
  }, [searchTerm, searchParams]); // ✅ Combined dependencies

  useEffect(() => {
    if (tagFromURL && !selectedTags.includes(tagFromURL)) {
      setSelectedTags(prev => [...prev, tagFromURL]);
    }
  }, [tagFromURL]);


  useEffect(() => {
    if (categoryFromURL && !selectedCategories.includes(categoryFromURL)) {
      setSelectedCategories(prev => [...prev, categoryFromURL]);
    }
  }, [categoryFromURL]);
  
  useEffect(() => {
    let filtered = products.filter(p =>
      p?.productName?.toLowerCase().includes(debouncedSearch)
    );

    filtered = filtered.filter(
      p => p.salesPrice >= priceRange[0] && p.salesPrice <= priceRange[1]
    );

    if (selectedTags.length > 0) {
    filtered = filtered.filter(p =>
      selectedTags.some(tag =>
        p.tag?.toLowerCase().includes(tag.toLowerCase())
      )
    );
  }

   // 4. Category filter
   if (selectedCategories.length > 0) {
    filtered = filtered.filter(p =>
      selectedCategories.includes(p.CategoryName)
    );
  }

    // 🔁 Sorting logic
   switch (sortOption) {
  case 'NAME_ASC':
    filtered.sort((a, b) => a.productName.localeCompare(b.productName));
    break;
  case 'NAME_DESC':
    filtered.sort((a, b) => b.productName.localeCompare(a.productName));
    break;
  case 'PRICE_ASC':
    filtered.sort((a, b) => a.salesPrice - b.salesPrice);
    break;
  case 'PRICE_DESC':
    filtered.sort((a, b) => b.salesPrice - a.salesPrice);
    break;
  default:
    // Default sorting by `sortingorder`
    filtered.sort((a, b) => (a.sortingorder ?? 0) - (b.sortingorder ?? 0));
}

    setFilteredproducts(filtered);
    setCurrentPage(1);
  }, [debouncedSearch, products, priceRange, selectedTags, sortOption, selectedCategories]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 3;
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    pages.push(
      <PaginationItem key={1}>
        <PaginationLink isActive={currentPage === 1} onClick={() => setCurrentPage(1)}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (startPage > 2) {
      pages.push(<PaginationItem key="start-ellipsis"><span className="px-2">...</span></PaginationItem>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={currentPage === i} onClick={() => setCurrentPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages - 1) {
      pages.push(<PaginationItem key="end-ellipsis"><span className="px-2">...</span></PaginationItem>);
    }

    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink isActive={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  const groupedProducts = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    paginatedProducts.forEach((product) => {
      const category = product.CategoryName || 'Others';
      if (!groups[category]) groups[category] = [];
      groups[category].push(product);
    });
    return groups;
  }, [paginatedProducts]);

  return (
    
    <>
    <div className="min-h-screen px-4 md:px-10 py-10 bg-gray-50">
        <Helmet>
          <title>Shop Crackers Online | SPT Crackers Sivakasi</title>
          <meta name="description" content="Explore our wide collection of fireworks including ground chakkars, sparklers, rockets, and more. All at unbeatable Sivakasi prices." />
          <meta name="keywords" content="crackers shop, buy fireworks, diwali crackers online, sivakasi fireworks, sparklers, rockets, flower pots, crackers deals" />
          <meta property="og:title" content="Shop Crackers at Cheapest Price from Sivakasi" />
          <meta property="og:description" content="Premium Sivakasi crackers at wholesale price. Shop safe and eco-friendly fireworks online now!" />
          <meta property="og:image" content="/meta/shop-banner.jpg" />
          <meta property="og:url" content="https://sptcrackers.com/shop" />
        </Helmet>
      <CartSummary/>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 overflow-y-auto">
        <div className="flex items-center gap-3 flex-wrap overflow-y-auto">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="flex gap-2 items-center bg-emerald-500 text-white">
                <FaFilter /> Filter
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4 space-y-6 overflow-y-auto">
                <div>
                  <h2 className="font-semibold text-lg">Price</h2>
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={1000}
                    step={10}
                    onValueChange={setPriceRange}
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Tags</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {TAGS?.map(tag => (
                      <Button
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Sort By</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(SORT_OPTIONS).map(([key, label]) => (
                      <Button
                        key={key}
                        variant={sortOption === key ? 'default' : 'outline'}
                        onClick={() => setSortOption(key)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Categories</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                    {Categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition-colors border 
                          ${selectedCategories.includes(category) ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
          <p className="text-gray-600 font-medium">
            We found {filteredproducts.length} items!
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleViewChange('grid')} className={`border p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-200' : 'bg-white'}`}>
            <FaThLarge />
          </button>
          <button onClick={() => handleViewChange('list')} className={`border p-2 rounded ${viewMode === 'table' ? 'bg-emerald-200' : 'bg-white'}`}>
            <FaTable />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
            groupedProducts ? (
              <>
                {Object.entries(groupedProducts).map(([category, items]) => (
                  <div key={category} className="mb-8">
                    {/* Category Heading */}
                    <div className="mb-3">
                      <div className="hidden sm:inline-block bg-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm border border-emerald-200">
                        {category}
                      </div>
                      <div className="block sm:hidden bg-emerald-50 border-b">
                        <div className="inline-block bg-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm border border-emerald-200">
                          {category}
                        </div>
                      </div>
                    </div>

                    {/* Grid of Products */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                      {items.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-center text-sm text-gray-500">Loading...</p>
            )
          ) : (
            <div className="w-full">
              <div className="inline-block min-w-full align-middle bg-white rounded shadow">
                <table className="w-full table-fixed sm:table-auto text-left text-sm">
                  <thead className="hidden sm:table-header-group bg-gray-100 uppercase text-xs">
                    <tr>
                      <th className="p-2 w-[30px] lg:w-[120px]">Image</th>
                      <th className="p-2 w-[60px] lg:w-[120px]">Name</th>
                      <th className="p-2 w-[30px] lg:w-[100px]">MRP</th>
                      <th className="p-2 w-[30px] lg:w-[100px]">Offer Rate</th>
                      <th className="p-2 w-[30px] lg:w-[100px]">Cart</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedProducts ? (
                      Object.entries(groupedProducts).map(([category, products]) => (
                        <React.Fragment key={category}>
                          <tr className="hidden sm:table-row bg-emerald-50">
                            <td colSpan={5} className="px-4 py-2">
                              <div className="inline-block bg-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm border border-emerald-200">
                                {category}
                              </div>
                            </td>
                          </tr>

                          <tr className="block sm:hidden bg-emerald-50 border-b">
                            <td className="p-3">
                              <div className="inline-block bg-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm border border-emerald-200">
                                {category}
                              </div>
                            </td>
                          </tr>

                          {products.map((product) => (
                            <ProductTableRow key={product.id} product={product} />
                          ))}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center text-gray-500 py-6">
                          Loading products...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
 
      {totalPages > 1 && (
        <Pagination className="mt-6 justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt; Previous</PaginationLink>
            </PaginationItem>

            {renderPageNumbers()}

            <PaginationItem>
              <PaginationLink onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next &gt;</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

    </div>
  <Footer />
  </>
  );
};

export default Shop;
