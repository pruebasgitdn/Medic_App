import { Button, Card } from "antd";
import React from "react";

const { Meta } = Card;

const Biography = ({ imageURL }) => {
  return (
    <div className="container biography">
      <Card>
        <div className="card_div">
          <div className="img_div">
            <img
              src={imageURL}
              alt=""
              style={{ width: "100%", borderRadius: "2%" }}
            />
            <div
              style={{
                display: "flex",
                marginTop: "2%",
              }}
            >
              <Button type="primary" block>
                Ver mas
              </Button>
            </div>
          </div>

          <div className="biografia">
            <h3>Quienes somos</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Voluptatum ex qui recusandae id eum fugiat voluptate omnis iusto
              blanditiis facilis? Dolores error unde blanditiis nobis.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptates, quibusdam. Ducimus hic nostrum asperiores distinctio.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores,
              rem?
            </p>
          </div>
        </div>
      </Card>
      {/* <div className="banner">
        <img src={imageURL} alt="" />
      </div>
      <div className="banner">
        <p>Biografia</p>
        <h3>Quienes somos</h3>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum
          ex qui recusandae id eum fugiat voluptate omnis iusto blanditiis
          facilis? Dolores error unde blanditiis nobis.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates,
          quibusdam. Ducimus hic nostrum asperiores distinctio.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores,
          rem?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo commodi
          quod, autem explicabo iure nisi. Saepe hic corporis quae temporibus?
        </p>
      </div> */}
    </div>
  );
};

export default Biography;
