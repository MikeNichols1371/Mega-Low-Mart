import React from 'react';
import Link from 'next/link';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Cart } from './';
import { useStateContext } from '../context/StateContext';

const Navbar = () => {
  const { showCart, setShowCart, totalQuantity } = useStateContext();
  return (
    <div className='navbar-container'>
      <p className='logo'>
        <Link href='/'>Mega-Low-Mart</Link>
      </p>
      <button type='button' className='cart-icon' onClick={ () => setShowCart( true )}>
        <AiOutlineShoppingCart />
        <span className='cart-item-qty'>{ totalQuantity }</span>
      </button>
      { showCart && <Cart />}
    </div>
  )
}

export default Navbar