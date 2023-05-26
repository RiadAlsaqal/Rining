import React from "react";
import { useSelector } from "react-redux";
import { selectLogIn } from "../../store/auth";
import { Link } from "react-router-dom";
const TryIt = () => {
  const getLogIn = useSelector(selectLogIn);
  return (
    <div className="tryIt">
      <h2>
        Written by <span> React's</span> trust, It's free and very Powerful try
        it Now!!
      </h2>
      {!getLogIn && (
        <Link className="tryIt_button" to="/SignIn">
          Sign in
        </Link>
      )}
    </div>
  );
};

export default TryIt;
