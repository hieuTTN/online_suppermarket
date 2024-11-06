import { useState, useEffect } from 'react'
import {getMethod} from '../../../services/request'
import React, { createContext, useContext } from 'react';
import logo from '../../../assest/images/logo.png';
import cart from '../../../assest/images/cartheader.png';
import styles from './header.scss';

export const HeaderContext = createContext();

function Header (){
  var [numCart, setNumCart] = useState(0);

  useEffect(()=>{
  const getNumCart = async() =>{
      const response = await getMethod('/api/cart/user/count-cart');
      if(response.status > 300){
          setNumCart(0);
          return;
      }
      var numc = await response.text();
      setNumCart(numc);
  };
  if(token != null){
      getNumCart();
  }
  }, []);
  

  function logout(){
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace('login')
  }

  var token = localStorage.getItem('token');
  var authen =  <a href="login" class="pointermenu gvs navlink"><i class="fa fa-user"></i> Login</a>
  if(token != null){
      authen = <>
      <span class="nav-item dropdown pointermenu gvs">
          <span className='nav-link dropdown-toggle' href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa fa-user"></i> Account</span>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item" href="account">Information</a></li>
              <li onClick={logout}><a class="dropdown-item" href="#">Logout</a></li>
          </ul>
      </span></>
  }
    return(
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">SUPER MARKET ONLINE</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="contact">Contact</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Category
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><hr class="dropdown-divider"/></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
          </ul>
          <form action='product' class="searchheader d-flex">
              <input name='search' placeholder="Search product?" class="inputsearchheader" />
              <button class="btnsearchheader"><i class="fa fa-search"></i></button>
          </form>
          <div className='d-flex'>
            <a href="login" class="pointermenu gvs navlink"><i class="fa fa-map-marker"></i> Stores address</a>
          </div>
          <div className='d-flex'>
            {authen}
          </div>
          <div className='d-flex'>
              <a href="cart"><img src={cart} class="imgcartheader" /></a>
              <span class="cart-total" id='numbercartheader'>{numCart}</span>
          </div>
        </div>
      </div>
    </nav>
    );

    
}

export default Header;