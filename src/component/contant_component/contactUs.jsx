import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import { faPhone, faAt, faMapMarker } from "@fortawesome/free-solid-svg-icons";
const ContactUs = () => {
  const [facebookDetils, setFacebookDetils] = useState("display");
  const [phoneDetils, setPhoneDetils] = useState("display");
  const [atDetils, setAtDetils] = useState("display");
  const [mapMarkerDetils, setMapMarkerDetils] = useState("display");

  return (
    <div className="contactUS">
      <h2 className="h2">Contact us</h2>

      <div className="icons">
        <div
          className="facebook_container"
          onMouseLeave={() => setFacebookDetils("display")}
        >
          <div className={facebookDetils}>
            <p href="">www.facebool.com/ Rining</p>
          </div>
          <FontAwesomeIcon
            icon={faFacebookSquare}
            className="facebook"
            onMouseEnter={() => setFacebookDetils("facebook_detils")}
          />
        </div>
        <div
          className="phone_container"
          onMouseLeave={() => setPhoneDetils("display")}
        >
          <div className={phoneDetils}>(+963)935498670</div>

          <FontAwesomeIcon
            icon={faPhone}
            className="phone"
            onMouseEnter={() => setPhoneDetils("phone_detils")}
          />
        </div>
        <div
          className="at_container"
          onMouseLeave={() => setAtDetils("display")}
        >
          <div className={atDetils}>baornr8@gmail.com</div>

          <FontAwesomeIcon
            icon={faAt}
            className="at"
            onMouseEnter={() => setAtDetils("at_detils")}
          />
        </div>
        <div
          className="map_marker_container"
          onMouseLeave={() => setMapMarkerDetils("display")}
        >
          <div className={mapMarkerDetils}>syria/damascus</div>
          <FontAwesomeIcon
            icon={faMapMarker}
            onMouseEnter={() => setMapMarkerDetils("map_marker_detils")}
            className="map_marker"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
