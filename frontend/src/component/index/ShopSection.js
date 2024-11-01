import React from 'react';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';


function ShopSection() {
  return (
    <section className="shop_section layout_padding">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>Latest Products</h2>
        </div>
        <div className="row">
          {[
            { imgSrc: "images/p1.png", name: "Ring", price: 200 },
            { imgSrc: "images/p2.png", name: "Watch", price: 300 },
            { imgSrc: "images/p3.png", name: "Teddy Bear", price: 110 },
            { imgSrc: "images/p4.png", name: "Flower Bouquet", price: 45 },
            { imgSrc: "images/p5.png", name: "Teddy Bear", price: 95 },
            { imgSrc: "images/p6.png", name: "Flower Bouquet", price: 70 },
            { imgSrc: "images/p7.png", name: "Watch", price: 400 },
            { imgSrc: "images/p8.png", name: "Ring", price: 450 }
          ].map((product, index) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={index}>
              <div className="box">
                <a href="product">
                  <div className="img-box">
                    <img src={product.imgSrc} alt={product.name} />
                  </div>
                  <div className="detail-box">
                    <h6>{product.name}</h6>
                    <h6>
                      Price <span>${product.price}</span>
                    </h6>
                  </div>
                  <div className="new">
                    <span>New</span>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="btn-box">
          <a href="#">View All Products</a>
        </div>
      </div>
    </section>
  );
}

export default ShopSection;
