import React from 'react';
import Link from 'next/link';
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai';

const Footer = () => {
  return (
    <div className='footer-container'>
      <p>@ 2022 Mega-Low-Mart | All rights reserved</p>
      <p className="icons">
        
        <a href="https://github.com/MikeNichols1371"><AiFillGithub /></a>
        
        <a href="https://www.linkedin.com/in/mike-nichols-5b2a29246/"><AiFillLinkedin /></a>
        
      </p>
    </div>
  )
}

export default Footer