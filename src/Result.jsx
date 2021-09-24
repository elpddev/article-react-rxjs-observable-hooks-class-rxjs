import React from "react";
import styled from "@emotion/styled";

const ResultBox = styled.div({
  backgroundColor: "lightgray",
  //color: "white",
  height: "60px",
  fontSize: "40px",
  display: "flex",
  padding: "5px",
  justifyContent: "center",
  outline: "none",
  border: "none",
  boxShadow: "none"
});

export default function Result({ content }) {
  return <ResultBox>{content}</ResultBox>;
}
