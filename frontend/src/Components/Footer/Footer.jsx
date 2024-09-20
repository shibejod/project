import React from 'react'
import './Footer.css'
import footer_logo from '../Assests/logo_big.png'
import instagram_icon from '../Assests/instagram_icon.png'
import pintrest_icon from '../Assests/pintester_icon.png'
// import whatsapp_icon from '../Assests/whatsapp_icon.png'

const Footer = () => {
  return (
    <div className='Footer'>
       <div className="footer-logo">
        <img src={footer_logo} alt="" />
        <p>FASHION FUSION</p>
        <ul className="footer-links">
          <li>Company</li>
          <li>Products</li>
          <li>Offices</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
       </div>
       <div className="footer-socials-icon">
        <div className="footer-icons-container">
          <img src={instagram_icon} alt="" />
        </div>
        <div className="footer-icons-container">
          <img src={pintrest_icon} alt="" />
        </div>
        <div className="footer-icons-container">
          <img src="https://res.cloudinary.com/dfnkruop6/image/upload/v1726305400/whatsapp_icon_koarpw.png" alt="" />
        </div>
       </div>
       <div className="footer-copyright">
       <hr />
        <p>Copyright @ 2024- All Right Reserved.</p> 
        
       </div>
        </div>
        
  )
}

export default Footer