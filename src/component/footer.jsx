import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footer">
      <Link to="/" className="footer_link">
        <h1 className="footer_logo"> Rining</h1>
      </Link>
      <p className="copyright">
        copyright &copy; {new Date().getFullYear()} by Rining INC
      </p>
    </div>
  );
};

export default Footer;
