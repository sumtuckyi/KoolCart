import styled from "styled-components";
import { Typography } from "@mui/material";

export const ItemName = styled(Typography).attrs({
  variant: "h6",
  gutterBottom: true,
})`
  font-weight: 500;
`;

export const ItemPrice = styled(Typography).attrs({
  variant: "h5",
})`
  font-weight: bold !important;
`;
