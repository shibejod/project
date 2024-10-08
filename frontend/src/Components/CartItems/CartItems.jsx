// import React, { useContext } from 'react'
// import './CartItems.css'
// import { ShopContext } from '../../Context/ShopContext';
// import remove_icon from '../Assests/cart_cross_icon.png'
// import {  useNavigate } from 'react-router-dom';

// const CartItems = () => {
//     const{getTotalCartAmount,all_product,cartItems,removeFromCart}=useContext(ShopContext);
//     const navigate=useNavigate();
  
//     const handleCheckout = () => {
//       navigate('/paymentpage', { state: { amount: getTotalCartAmount() } });
//     };
//     const amount=getTotalCartAmount();
    
//   return (
//     <div className='cartitems'>
//      <div className="cartitems-format-main">
//         <p>Products</p>
//         <p>Title</p>
//          <p>Price</p>
//         <p>Quantity</p>
       
//         <p>Total</p>
//         <p>Remove</p>
      
//      </div> 
//      <hr />
//      {all_product.map((e)=>
//         {
//         if(cartItems[e.id]>0){
//             return <div>
//             <div className="cartitems-format cartitems-format-main">
//                 <img src={e.image} alt="" className='carticon-product-icon' />
//                 <p>{e.name}</p>
//                 <p>Rs{e.new_price}</p>
//                 <button className='cartitems-quantity'>{cartItems[e.id]}</button>
//                 <p>Rs{e.new_price*cartItems[e.id]}</p>
//                 <img className='cartitems-remove-icon'src={remove_icon} onClick={()=>{removeFromCart(e.id)}} alt="" />
//             </div>
//             <hr />
//          </div>
//         }
//         else{
//             return null;
//         }
//      })}
//         <div className="cartitems-down">
//           <div className="cartitems-total">
//             <h1>Cart Totals</h1>
//             <div>
//               <div className="cartitems-total-item">
//                 <p>Subtotal</p>
//                 <p>Rs{amount}</p>
//                 </div>
//                 <hr />
//                 <div className="cartitems-total-item">
//                   <p>Shipping Fee</p>
//                   <p>Free</p>
//                 </div>
//                 <hr />
//                 <div className="cartitems-total-item">
//                   <h3>Total</h3>
//                   <h3>Rs{amount}</h3>
//                 </div>
//             </div>
//             <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
//           </div>
//           {/* <div className="cartitems-promocode">
//             <p>If you have a promocode, Enter it here</p>
//             <div className="cartitems-promobox">
//               <input type="text" placeholder='promocode' />
//               <button>SUBMIT</button>
//             </div>
//           </div> */}
//           <div className="cartitems-promocode">
//       <p>If you have a promo code, enter it here</p>
//       <form  className="cartitems-promobox">
//         <input
//           type="text"
//           placeholder="Enter promo code"
        
         
//         />
//         <button type="submit">SUBMIT</button>
//       </form>
//     </div>
//         </div>
//     </div>
//   )
// }

// export default CartItems
import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assests/cart_cross_icon.png'
import { useNavigate } from 'react-router-dom';

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);
  const navigate = useNavigate();
  // console.log("all_product", all_product);

  const handleCheckout = () => {
    let product_id = [];
    product_id = all_product.forEach((e) => {
      if (cartItems[e.id]>0) {
        console.log(e._id);
        product_id = [...product_id, e._id];
        console.log(product_id);
      }
      navigate('/paymentpage', { state: { amount: getTotalCartAmount(), product_id: product_id } });
    });
  };
  const amount = getTotalCartAmount();

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>

      </div>
      <hr />
      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return <div>
            <div className="cartitems-format cartitems-format-main">
              <img src={e.image} alt="" className='carticon-product-icon' />
              <p>{e.name}</p>
              <p>Rs{e.new_price}</p>
              <p className=''>{cartItems[e.id]}</p>
              <p>Rs{e.new_price * cartItems[e.id]}</p>
              <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt="" />
            </div>
            <hr />
          </div>
        }
        else {
          return null;
        }
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>Rs{amount}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>Rs{amount}</h3>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        {/* <div className="cartitems-promocode">
            <p>If you have a promocode, Enter it here</p>
            <div className="cartitems-promobox">
              <input type="text" placeholder='promocode' />
              <button>SUBMIT</button>
            </div>
          </div> */}
        <div className="cartitems-promocode">
          <p>If you have a promo code, enter it here</p>
          <form className="cartitems-promobox">
            <input
              type="text"
              placeholder="Enter promo code"
            />
            <button type="submit">SUBMIT</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CartItems