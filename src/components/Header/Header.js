import React from "react";
import * as BsIcons from "react-icons/bs";
import * as GrIcons from "react-icons/gr";
import * as HiIcons from "react-icons/hi";
import * as RiIcons from "react-icons/ri";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = () => {
   const history = useHistory();
   const goToOrders = () => {
      history.push("/dashboard/myOrders");
   };
   return (
      <div className="header">
         <nav className="header_navbar">
            <div className="navbar_list">
               <div className="nav_logo">
                  <BsIcons.BsSmartwatch />
                  <span className="brand_name">Desire</span>
               </div>
               <ul className="navbar_icons">
                  <li className="nav_icon">
                     <GrIcons.GrFacebookOption />
                  </li>
                  <li className="nav_icon">
                     <BsIcons.BsInstagram />
                  </li>
                  <li className="nav_icon">
                     <RiIcons.RiHeartsFill />
                  </li>
                  <li className="nav_icon" onClick={goToOrders}>
                     <HiIcons.HiShoppingCart />
                  </li>
               </ul>
            </div>
         </nav>
      </div>
   );
};

export default Header;
