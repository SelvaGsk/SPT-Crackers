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

  return (
    <>
    <Helmet>
      <title>Shop Crackers Online | SPT Crackers Sivakasi</title>
      <meta name="description" content="Explore our wide collection of fireworks including ground chakkars, sparklers, rockets, and more. All at unbeatable Sivakasi prices." />
      <meta name="keywords" content="crackers shop, buy fireworks, diwali crackers online, sivakasi fireworks, sparklers, rockets, flower pots, crackers deals" />
      
      <meta property="og:title" content="Shop Crackers at Cheapest Price from Sivakasi" />
      <meta property="og:description" content="Premium Sivakasi crackers at wholesale price. Shop safe and eco-friendly fireworks online now!" />
      <meta property="og:image" content="/meta/shop-banner.jpg" />
      <meta property="og:url" content="https://sptcrackers.com/shop" />
    </Helmet>
    <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col">
      <img src={product?.productImageURL} alt={product.productName} className="rounded-md h-[250px] w-full object-cover mb-3" />
      <div className="text-center mb-2">
        <p className="text-sm text-gray-500">{product.productName}</p>
      </div>
      <div className="text-center mb-2">
        <span className="text-red-500 line-through">₹{product.beforeDiscPrice?.toFixed(2)} </span>
        <span className="text-emerald-600 font-bold mr-2">₹{product.salesPrice?.toFixed(2)} </span>
      </div>
      <div className="mt-auto flex justify-between items-center">
        {product.youtubeURL && <button><FaYoutube className="text-red-500 text-3xl cursor-pointer" /></button>}
        {qty > 0 ? (
          <div className="flex items-center mx-auto gap-2">
            <button onClick={() => updateCartQty(product.productId, "dec")} className="px-2 py-1 bg-red-500 text-white rounded">−</button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => updateCartQty(product.productId, parseInt(e.target.value))}
              className="w-16 text-center border rounded px-2 py-1"
            />
            <button onClick={() => updateCartQty(product.productId, "inc")} className="px-2 py-1 bg-green-500 text-white rounded">+</button>
          </div>
        ) : (
          <Button className="bg-green-500 text-white px-6 py-2 rounded-full mx-auto" onClick={() => toggleCart(product)}>
            Add To Cart
          </Button>
        )}
        <button onClick={() => {
          toggleWishList(product.id);
          toast.success(isInWishlist ? 'Product is removed from wishlist' : 'Product is added to wishlist')
        }}>
          {isInWishlist ? <FaHeart className="text-2xl text-red-500" /> : <CiHeart className="text-3xl" />}
        </button>
      </div>
    </div>
    </>
  );

  <Footer/>
});

export const ProductTableRow = React.memo(({ product }) => {
  const { toggleWishList, wishlistIds, toggleCart, cartItems, updateCartQty } = useFirebase();
  const isInWishlist = wishlistIds.includes(product.id);
  const currentProduct = cartItems?.[product.productId];
  const qty = currentProduct?.qty || 0;

  return (
    <tr className="border-b">  
    {/* className="border-b"> */}
      <td className="p-2 w-[15px] lg:w-[90px]"><img src={product.productImageURL} alt="" className="w-15 h-15 object-cover rounded-md" /></td>
      <td className="p-2 w-[60px] lg:w-[120px]">{product.productName}</td>
      <td className="p-2 w-[30px] lg:w-[90px] text-red-500 line-through">₹{product.beforeDiscPrice?.toFixed(2)}</td>
      <td className="p-2 w-[30px] lg:w-[90px]">₹{product.salesPrice?.toFixed(2)}</td>
      <td className="p-2 w-[30px] lg:w-[90px]">
        {qty > 0 ? (
          <div className="flex items-center gap-2">
            <button onClick={() => updateCartQty(product.productId, "dec")} className="px-2 py-1 bg-red-500 text-white rounded">−</button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => updateCartQty(product.productId, parseInt(e.target.value))}
              className="w-16 text-center border rounded px-2 py-1"
            />
            <button onClick={() => updateCartQty(product.productId, "inc")} className="px-2 py-1 bg-green-500 text-white rounded">+</button>
          </div>
        ) : (
          <Button className="bg-green-500 text-white text-sm" onClick={() => toggleCart(product)}>Add</Button>
        )}
      </td>
      {/* <td className="p-2 text-center">
        <button onClick={() => {
          toggleWishList(product.id);
          toast.success(isInWishlist ? 'Product is removed from wishlist' : 'Product is added to wishlist')
        }}>
          {isInWishlist ? <FaHeart className="text-xl text-red-500" /> : <CiHeart className="text-2xl" />}
        </button>
      </td> */}
    </tr>
  );
  <Footer/>

});

const Shop = () => {
  const { searchTerm, products,TAGS } = useFirebase();
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filteredproducts, setFilteredproducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('DEFAULT'); // NEW
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const totalPages = Math.ceil(filteredproducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredproducts.slice(start, start + itemsPerPage);
  }, [filteredproducts, currentPage]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchTerm.toLowerCase());
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    let filtered = products.filter(p =>
      p?.productName?.toLowerCase().includes(debouncedSearch)
    );

    filtered = filtered.filter(
      p => p.salesPrice >= priceRange[0] && p.salesPrice <= priceRange[1]
    );

    if (selectedTags.length > 0) {
      filtered = filtered.filter(p =>
        selectedTags.some(tag => p.tags?.toLowerCase().includes(tag.toLowerCase()))
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
  }, [debouncedSearch, products, priceRange, selectedTags, sortOption]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
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

  return (
    <div className="min-h-screen px-4 md:px-10 py-10 bg-gray-50">
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
              </div>
            </DrawerContent>
          </Drawer>
          <p className="text-gray-600 font-medium">
            We found {filteredproducts.length} items!
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('grid')} className={`border p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-200' : 'bg-white'}`}>
            <FaThLarge />
          </button>
          <button onClick={() => setViewMode('table')} className={`border p-2 rounded ${viewMode === 'table' ? 'bg-emerald-200' : 'bg-white'}`}>
            <FaTable />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
       <div className="w-full overflow-x-auto">
        <div className="min-w-full inline-block align-middle bg-white rounded shadow">
          <table className="min-w-[700px] table-auto w-full text-left text-sm">
            <thead className="bg-gray-100 uppercase text-xs">
              <tr>
                <th className="p-2 w-[30px] lg:w-[120px]">Image</th>
                <th className="p-2 w-[60px] lg:w-[120px]">Name</th>
                <th className="p-2 w-[30px] lg:w-[100px]">MRP</th>
                <th className="p-2 w-[30px] lg:w-[100px]">Offer Rate</th>
                <th className="p-2 w-[30px] lg:w-[100px]">Cart</th>
                {/* <th className="p-2 text-center whitespace-nowrap">Wishlist</th> */}
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product, i) => (
                <ProductTableRow key={i} product={product} />
              ))}
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
    
  );
};

export default Shop;
