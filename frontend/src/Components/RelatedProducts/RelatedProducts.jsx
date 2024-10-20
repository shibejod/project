import React, { useEffect, useState } from 'react';
import './RelatedProducts.css';
import Item from '../Items/Item';

const RelatedProducts = ({ apparel, category }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    if (!apparel || !category) {
      setError("Apparel and category are required to fetch related products.");
      return;
    }

    fetch(`http://localhost:4000/relatedproducts?apparel=${apparel}&category=${category}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRelatedProducts(data);
        } else {
          console.error("Error fetching products:", data);
          setError(data.error || "An unknown error occurred.");
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
        setError("Failed to fetch related products. Please try again later.");
      });
  }, [apparel, category]); // Add apparel and category as dependencies

  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <hr />
      {error ? (
        <p className="error">{error}</p> // Display error message if any
      ) : (
        <div className="relatedproducts-items">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((item, i) => (
              <Item
                key={i}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            ))
          ) : (
            <p>No related products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
