import { Button, Card } from "antd";

const Biography = ({ imageURL }) => {
  return (
    <div className="container">
      <Card>
        <div className="card_div">
          <div className="img_div">
            <img src={imageURL} alt="" />
            <div>
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
    </div>
  );
};

export default Biography;
