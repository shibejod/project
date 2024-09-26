// // import React from 'react'
// // import './Apparel.css'
// // import Item from '../Items/Item'
// // export const Apparel = () => {
// //     const[Apparel,setApparel]=useState([]);
// //   useEffect(()=>{
// //     fetch("http://localhost:4000/popularinapparel")
// //     .then((response)=>response.json())
// //     .then((data)=>Apparel(data));
// //   },[])
// //   return (
// //     <div className='popular'>
// //          <h1>APPAREL</h1>
// //       <hr/>
// //       <div className='popular-item'>
// //         {popularProducts.map((item,i)=>{
// //         return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price}
// //         old_price={item.old_price} />

// //         })}

// //       </div>

// //     </div>
// //   )
// // }
// // export default Apparel;
// import React, { useState, useEffect, useRef } from 'react';
// import './Apparel.css';
// import Item from '../Items/Item';
// import { Link } from 'react-router-dom';

// export const Apparel = () => {
//     const [apparel, setApparel] = useState([]);
//     const [selectedApparel, setSelectedApparel] = useState('Casual'); // Default to Casual
//     const [menu, setMenu] = useState(''); // Track which menu item is active
//     const menuRef = useRef(null);
    
//     useEffect(() => {
//         fetch(`http://localhost:4000/popularinapparel?apparel=${selectedApparel}&category=men`) // Change category as needed
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then((data) => {
//                 console.log("Fetched data:", data); // Log the fetched data
//                 setApparel(data);
//             })
//             .catch((error) => console.error('Error fetching apparel:', error));
//     }, [selectedApparel]); // Fetch products whenever selectedApparel changes

//     const handleApparelChange = (type) => {
//         setSelectedApparel(type);
//         console.log("Selected apparel type:", type);
//         setMenu(type.toLowerCase()); // Set the menu state
//     };

//     return (
//         <div className='popular'>
//             <h1>APPAREL</h1>
//             <hr />
//             <div>
//                 <h3>Select Apparel Type:</h3>
//                 <ul ref={menuRef} className='nav-menu'>
//                     <li onClick={() => handleApparelChange('Casual')}>
//                         <Link style={{ textDecoration: 'none' }} to='/apparel/casual'>Casual</Link>
//                         {selectedApparel === 'Casual' ? <hr /> : <></>}
//                     </li>
//                     <li onClick={() => handleApparelChange('Formal')}>
//                         <Link style={{ textDecoration: 'none' }} to='/apparel/formal'>Formal</Link>
//                         {selectedApparel === 'Formal' ? <hr /> : <></>}
//                     </li>
//                 </ul>
//             </div>
//             <div className='popular-item'>
//                 {apparel.length > 0 ? (
//                     apparel.map((item, i) => (
//                         <Item 
//                             key={i} 
//                             id={item.id} 
//                             name={item.name} 
//                             image={item.image} 
//                             new_price={item.new_price}
//                             old_price={item.old_price} 
//                         />
//                     ))
//                 ) : (
//                     <p>No products available for {selectedApparel} apparel.</p>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Apparel;

