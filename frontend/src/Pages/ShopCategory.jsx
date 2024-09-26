// import React,{ useContext } from 'react'
// import './CSS/ShopCategory.css'

// import { ShopContext } from '../Context/ShopContext'
// import dropdown_icon from '../Components/Assests/dropdown_icon.png'
// import Item from '../Components/Items/Item'

// export const ShopCategory = (props) => {
//   const {all_product} = useContext(ShopContext);
//   return (
//     <div className='shop-category'>
//       <img className="shopcategory-banner"src={props.banner} alt="" />
//       <div className="shopcategory-indexSort">
//      <p>
//       <span>Showing 1-12</span> out of 36
//      </p>
//      <div className="shopcategory-sort">
//       Sort by <img src={dropdown_icon}alt="" />
//      </div>
//       </div>
//       <div className="shopcategory-products">
//         {all_product.map((item,i) =>{
//           if(props.category===item.category){
//           return<Item  key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price}
//           old_price={item.old_price}/>
//           }
//           else if(props.category===item.category && props.apparel ===item.apparel ){
//             return<Item  key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price}
//             old_price={item.old_price}/>
//           }
//           else{
//             return null;
//           }
          
//         })}
//       </div>
//       <div className="shopcategory-loadmore">
//         Explore more
//       </div>
//     </div>
//   );
// }

// export default ShopCategory
import React,{ useContext, useState } from 'react'
import './CSS/ShopCategory.css'

import { ShopContext } from '../Context/ShopContext'
import dropdown_icon from '../Components/Assests/dropdown_icon.png'
import Item from '../Components/Items/Item'

export const ShopCategory = (props) => {
  const {all_product} = useContext(ShopContext);
  const [formal, setformal] = useState(false); 
  const [casual, setcasual] = useState(false);
  const [party,setparty] = useState(false);
  const [ethnic, setethnic] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  const handleFormal = () =>{
    setformal(true);
    setcasual(false);
    setparty(false);
    setethnic(false);
    console.log('formal')
    console.log(all_product);
    // const menformal = all_product.filter((item) => item.apparel === 'Formal');
    // console.log(menformal);
  }

  const handleCasual = () =>{
    setcasual(true);
    setformal(false);
    setparty(false);
    setethnic(false);
  }
  const handleParty = () =>{
    setcasual(false);
    setformal(false);
    setparty(true);
    setethnic(false);
  }
  const handleEthnic = () =>{
    setcasual(false);
    setformal(false);
    setparty(false);
    setethnic(true);
  }
  

  const handleBanner = () =>{
    const menbanner = all_product.filter((item) => item.new_price < 1500);
    console.log(menbanner)
  }
  
  return (
    <div className='shop-category'>
      <img className="shopcategory-banner" src={props.banner} onClick={handleBanner} alt="" />
      <div className="shopcategory-indexSort">
     <p>
      <span>Showing 1-12</span> out of 36
     </p>
     <div className="shopcategory-sort">
     <button onClick={toggleDropdown} className="dropdown-button">
        Sort by
      </button>
      {dropdownOpen && (
        <ul className="dropdown-menu">
          <li onClick={handleFormal}>Formal</li>
          <li onClick={handleCasual}>Casual</li>
          <li onClick={handleParty}>Party</li>
          <li onClick={handleEthnic}>Ethnic</li>

        </ul>
      )}
      {/* <p onClick={}>Formal</p>
      <p onClick={}>Casual</p>
      <p onClick={handleParty}>Party</p>
      <p onClick={handleEthnic}Ethnic></p> */}
     </div>
      </div>
      {!formal && !casual && !ethnic && !party &&<div className="shopcategory-products">
        {all_product.map((item,i) =>{
          if(props.category===item.category){
          return<Item  key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price}
          old_price={item.old_price}/>
          }
          else{
            return null;
          }
        })}
      </div>}
      {formal && <div className="shopcategory-products">
        {all_product.filter((item) => item.apparel === 'Formal').map((item,i) =>{
          if(props.category===item.category){
            return<Item  key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price}
            old_price={item.old_price}/>
            }
            else{
              return null;
            }
        })}
      </div>}
      {casual && <div className="shopcategory-products">
        {all_product.filter((item) => item.apparel === 'Casual').map((item,i) =>{
          if(props.category===item.category){
          return<Item  key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price}
          old_price={item.old_price}/>
          }
          else{
            return null;
          }
        })}
      </div>}
      {party && <div className="shopcategory-products">
        {all_product.filter((item) => item.apparel === 'Party').map((item,i) =>{
          if(props.category===item.category){
          return<Item  key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price}
          old_price={item.old_price}/>
          }
          else{
            return null;
          }
        })}
      </div>}
      {ethnic && <div className="shopcategory-products">
        {all_product.filter((item) => item.apparel === 'Ethnic').map((item,i) =>{
          if(props.category===item.category){
          return<Item  key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price}
          old_price={item.old_price}/>
          }
          else{
            return null;
          }
        })}
      </div>}







      <div className="shopcategory-loadmore">
        Explore more
      </div>
    </div>
  );
}

export default ShopCategory