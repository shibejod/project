import React from 'react'
import './DescriptionBox.css'
const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">
             <div className="descriptionbox-nav-box">Returns&Exchangeinformation</div>
             {/* <div className="descriptionbox-nav-box fade">Reviews (122)</div> */}
            </div>

        </div>
        <div className="descriptionbox-description">
        <p>Hassle-free returns within 7 days; specific conditions apply based on products and promotions.</p>
        <p>Prepaid order refunds are processed to the original payment method; COD orders receive a coupon code refund.</p>
        <p>Issues with defective, incorrect, or damaged products must be reported within 24 hours of delivery.</p>
        <p>Items purchased during special sales with free product offers, like BOGO, are ineligible for returns.</p>
        <p>A reverse shipment fee of Rs 100 is charged, which will be deducted from the refund.</p>
        <p>For hygiene, items such as accessories, sunglasses, perfumes, masks, and innerwear are non-returnable.</p>
        <p>For more details on our Return / Exchange Policies, please click here․
To place a Return / Exchange Request, click here.</p>






        </div>


    </div>
  )
}

export default DescriptionBox