import React, { useContext} from 'react'
import './ProductDisplay.css'
import star_icon from '../Assests/star_icon.png';
import star_dull_icon from '../Assests/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

 const ProductDisplay = (props) => {
    const{product}=props;


    // const{addToCart}=useContext(ShopContext);
    const { addToCart } = useContext(ShopContext); 
  return (
    <div className='productdisplay'>
     <div className="productdisplay-left">
      <div className="productdisplay-img-list">
       <img src={product.image} alt="" />
       <img src={product.image} alt="" />
       <img src={product.image} alt="" />
       <img src={product.image} alt="" />
      </div>
      <div className="productdisplay-img">
        <img className="productdisplay-main-img"src={product.image} alt=""  />
      </div>
     </div>
     <div className="productdisplay-right">
       <h1>{product.name}</h1>
       <div className="productdisplay-right-star">
        <img src={star_icon} alt="" />
        <img src={star_icon} alt="" />
        <img src={star_icon} alt="" />
        <img src={star_icon} alt="" />
        <img src={star_dull_icon} alt="" />
        <p>(122)</p>
      
       </div>
       <div className="productdisplay-right-prices">
        <div className="productdisplay-right-price-old">
            ${product.old_price}
        </div>
        <div className="productdisplay-right-price-new">
          ${product.new_price}
        </div>
        </div>
        <div className="productdisplay-right-size">
          <p>Select size</p>
          <div className="productdisplay-right-sizes">
          <button >XS</button>
          <button >S</button>
          <button >M</button>
          <button >L</button>
          <button>XL</button>
      
         
          </div>
        </div>
        <button onClick={()=>{addToCart(product.id)}}>ADD TO CART</button>
        <p className='productdisplay-right-category'><span>Category :</span>{product.category}</p>
        <p className='productdisplay-right-category'><span>Description :</span>{product.description}</p>
        <p className='productdisplay-right-category'><span>apparel :</span>{product.apparel}</p>

       
     </div>
    </div>
  )
}
export default ProductDisplay
// import React, { useContext, useEffect, useState } from 'react'
// import './ProductDisplay.css'
// import star_icon from '../Assests/star_icon.png';
// import star_dull_icon from '../Assests/star_dull_icon.png';
// import { ShopContext } from '../../Context/ShopContext';

// const ProductDisplay = (props) => {
//   const { product } = props;
//   const { addToCart } = useContext(ShopContext);
//   const [relatedProducts, setRelatedProducts] = useState([]);

//   useEffect(() => {
//     const fetchRelatedProducts = async () => {
//       try {
//         const response = await fetch(`http://localhost:4000/relatedproducts?apparel=${encodeURIComponent(product.apparel)}&category=${encodeURIComponent(product.category)}`);

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();

//         const filteredProducts = Array.isArray(data)
//           ? data.filter(item => item.id !== product.id && item._id !== product.id)
//           : [];

//         setRelatedProducts(filteredProducts);
//       } catch (error) {
//         console.error('Error fetching related products:', error);
//         // setError(error.message);
//       }
//     };

//     fetchRelatedProducts();
//   }, [product.id, product.apparel, product.category]);


//   return (
//     <div className='productdisplay'>
//         <div className="productdisplay-left">
//             <div className="productdisplay-img-list">
//                 <img src={product.image} alt="" />
//                 <img src={product.image} alt="" />
//                 <img src={product.image} alt="" />
//                 <img src={product.image} alt="" />
//             </div>
//             <div className="productdisplay-img">
//                 <img className="productdisplay-main-img" src={product.image} alt="" />
//             </div>
//         </div>
//         <div className="productdisplay-right">
//             <h1>{product.name}</h1>
//             <div className="productdisplay-right-star">
//                 <img src={star_icon} alt="" />
//                 <img src={star_icon} alt="" />
//                 <img src={star_icon} alt="" />
//                 <img src={star_icon} alt="" />
//                 <img src={star_dull_icon} alt="" />
//                 <p>(122)</p>
//             </div>
//             <div className="productdisplay-right-prices">
//                 <div className="productdisplay-right-price-old">
//                     ${product.old_price}
//                 </div>
//                 <div className="productdisplay-right-price-new">
//                     ${product.new_price}
//                 </div>
//             </div>
//             <div className="productdisplay-right-size">
//                 <p>Select size</p>
//                 <div className="productdisplay-right-sizes">
//                     <button>XS</button>
//                     <button>S</button>
//                     <button>M</button>
//                     <button>L</button>
//                     <button>XL</button>
//                 </div>
//             </div>
//             <button onClick={() => { addToCart(product.id) }}>ADD TO CART</button>
//             <p className='productdisplay-right-category'><span>Category :</span>{product.category}</p>
//             <p className='productdisplay-right-category'><span>Description :</span>{product.description}</p>
//             <p className='productdisplay-right-category'><span>Apparel :</span>{product.apparel}</p>
//         </div>

//         {/* Move Related Products section here */}
//         <div className="related-products">
//             <h2>Related Products</h2>
//             <div className="related-products-container">
//                 {relatedProducts.map((relatedProduct) => (
//                     <div key={relatedProduct.id} className="related-product-card">
//                         <img src={relatedProduct.image} alt={relatedProduct.name} />
//                         <h3>{relatedProduct.name}</h3>
//                         <p>New Price: ${relatedProduct.new_price}</p>
//                         <p>Old Price: ${relatedProduct.old_price}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     </div>
// );
// }
// export default ProductDisplay