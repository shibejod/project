// import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import  ShopCategory from './Pages/ShopCategory';
import  Product  from './Pages/Product';
import Cart from './Pages/Cart'
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assests/banner_mens.png'
import women_banner from './Components/Assests/banner_women.png'
import kids_banner from './Components/Assests/banner_kids.png'
import PaymentPage from './Components/PaymentPage/PaymentPage';
import men_formal_banner from './Components/Assests/m_b_f.jpg';
// import Apparel from './Components/Apparel/Apparel';

function App() {
  return (
    <div >
      <BrowserRouter>
     <Navbar/>
    <Routes>
       <Route path='/login' element={<LoginSignup/>}/>
      <Route path='/' element={<Shop/>}/>
      <Route path='/mens' element={<ShopCategory banner={men_banner} category="men"/>}/>
      {/* <Route path='/mens/popularinapparel' element={<ShopCategory banner={men_formal_banner} category="men" apparel="Formal"/>}/> */}

      <Route path='/womens' element={<ShopCategory banner={women_banner} category="women"/>}/>
      <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kid"/>}/>
      <Route path='/product' element={<Product/>}>
        <Route path=':productId' element={<Product/>}/>
      </Route>
      <Route path='/cart' element={<Cart/>}/>
      {/* <Route path='/apparel' element={<Apparel/>}/> */}
     
      <Route path='/paymentpage' element={<PaymentPage/>}/>
    </Routes>
    <Footer/>
   
  </BrowserRouter>
    </div>
  );
}

export default App;
