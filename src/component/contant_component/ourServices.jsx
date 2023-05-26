import React, { useState } from "react";
import img1 from "./content images/1.png";
import img2 from "./content images/2.png";
import img3 from "./content images/3.png";
const Services = () => {
  const [style1, setStyle1] = useState("dot active");
  const [style2, setStyle2] = useState(" dot");
  const [style3, setStyle3] = useState("dot");
  const [image1, setImage1] = useState("img ");
  const [image2, setImage2] = useState("img  display");
  const [image3, setImage3] = useState("img display");
  const [p1, setP1] = useState("p_in_p_slide_show ");
  const [p2, setP2] = useState("p_in_p_slide_show display");
  const [p3, setP3] = useState("p_in_p_slide_show display");

  const handleActive1 = () => {
    setStyle1("dot active");
    setStyle2("dot");
    setStyle3("dot");
    setImage1("img ");
    setImage2("img display");
    setImage3("img display");
    setP1("p_in_p_slide_show ");
    setP2("p_in_p_slide_show display");
    setP3("p_in_p_slide_show display");
  };
  const handleActive2 = () => {
    setStyle1("dot");
    setStyle2("dot active");
    setStyle3("dot");
    setImage1("img display");
    setImage2("img");
    setImage3("img display ");
    setP1("p_in_p_slide_show display");
    setP2("p_in_p_slide_show ");
    setP3("p_in_p_slide_show display");
  };
  const handleActive3 = () => {
    setStyle1("dot");
    setStyle2("dot");
    setStyle3("dot active");
    setImage1("img display");
    setImage2("img display");
    setImage3("img");
    setP1("p_in_p_slide_show display");
    setP2("p_in_p_slide_show display");
    setP3("p_in_p_slide_show ");
  };
  return (
    <div className="slide_show">
      <div className="p_slide_show">
        <p className={p1}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
          fuga quaerat animi sequi dolor? Vitae magnam fugiat officia, id dolor
          voluptatum, quo repellat culpa maiores, quas quibusdam quaerat sequi
          dolorum?
        </p>
        <p className={p2}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
          fuga quaerat animi sequi dolor? Vitae magnam fugiat officia, id dolor
        </p>
        <p className={p3}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
        </p>
      </div>

      <div className="images_slide_show">
        <div className="images">
          <img src={img1} alt="" className={image1} />
          <img src={img2} alt="" className={image2} />
          <img src={img3} alt="" className={image3} />
        </div>
        <div className="dot_slide_show">
          <div className={style1} onClick={handleActive1}></div>
          <div className={style2} onClick={handleActive2}></div>
          <div className={style3} onClick={handleActive3}></div>
        </div>
      </div>
    </div>
  );
};

export default Services;
