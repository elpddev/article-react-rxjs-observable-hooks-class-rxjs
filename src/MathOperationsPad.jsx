import React from "react";
import styled from "@emotion/styled";

const Layout = styled.div({
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

export default function MathOperationsPad({ onAction }) {
  return (
    <Layout>
      <Button onClick={() => onAction("+")}>+</Button>
      <Button onClick={() => onAction("-")}>-</Button>
    </Layout>
  );
}
