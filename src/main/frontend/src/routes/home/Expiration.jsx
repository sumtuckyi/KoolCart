import ProductList, { ProductCard } from "./ProductList";

export default function Expiration() {
  return <ProductList array={arr} />;
}

const arr = [
  { name: "우유", count: 2, exp: 2 },
  { name: "사과", count: 10, exp: 7 },
  { name: "달걀", count: 3, exp: 3 },
  { name: "두부면", count: 3, exp: 2 },
  { name: "고등어", count: 2, exp: 2 },
  { name: "무화과잼", count: 1, exp: 34 },
  { name: "마요네즈", count: 1, exp: 24 },
  { name: "생수", count: 5, exp: 21 },
  { name: "우유", count: 2, exp: 20 },
  { name: "사과", count: 10, exp: 2 },
  { name: "달걀", count: 3, exp: 10 },
  { name: "두부면", count: 3, exp: 20 },
  { name: "고등어", count: 2, exp: -3 },
  { name: "무화과잼", count: 1, exp: 28 },
  { name: "마요네즈", count: 1, exp: -12 },
  { name: "생수", count: 5, exp: 23 },
];
