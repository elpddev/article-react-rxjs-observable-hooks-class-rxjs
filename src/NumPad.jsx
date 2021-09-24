import React from "react";
import styled from "@emotion/styled";

const Layout = styled.div({
  display: "flex",
  flexDirection: "column-reverse",
  gap: "5px"
});

const Row = styled.div({
  display: "flex",
  gap: "5px"
});

const Button = styled.button({
  width: "120px",
  height: "100px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "30px"
});

export default function NumPad({ whenAction }) {
  return (
    <Layout>
      <Row>
        <Button onClick={() => whenAction(0)}>0</Button>
      </Row>
      <Row>
        <Button onClick={() => whenAction(1)}>1</Button>
        <Button onClick={() => whenAction(2)}>2</Button>
        <Button onClick={() => whenAction(3)}>3</Button>
      </Row>
      <Row>
        <Button onClick={() => whenAction(4)}>4</Button>
        <Button onClick={() => whenAction(5)}>5</Button>
        <Button onClick={() => whenAction(6)}>6</Button>
      </Row>
      <Row>
        <Button onClick={() => whenAction(7)}>7</Button>
        <Button onClick={() => whenAction(8)}>8</Button>
        <Button onClick={() => whenAction(9)}>9</Button>
      </Row>
    </Layout>
  );
}
