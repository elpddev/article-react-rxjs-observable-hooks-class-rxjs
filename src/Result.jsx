import React from "react";
import styled from "@emotion/styled";

const ResultBox = styled.div({
  backgroundColor: "gray",
  color: "white",
  height: "60px",
  width: "360px",
  fontSize: "40px",
  display: "flex",
  padding: "5px",
  justifyContent: "center"
});

export default function Result({ content }) {
  return <ResultBox>{content}</ResultBox>;
}
