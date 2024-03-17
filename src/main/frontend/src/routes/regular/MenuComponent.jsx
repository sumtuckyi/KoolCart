import { useEffect, useRef, useState } from "react";
import { getProducts } from "../../api/getData";
import { Menu, Card } from 'antd';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useSelector } from "react-redux";
import { Box } from "@mui/system";
import './MenuComponent.css';

// 메뉴 아이템 생성 함수
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

// Card 컴포넌트의 Meta 데이터 사용을 위한 구조 분해 할당
const { Meta } = Card;

export default function MenuComponent({ handleAdd, color }) {

  const [category, SetCategory] = useState([]);
  const [productsList, SetProductsList] = useState(null)

  const categoryData = useSelector((state) => state.data.category);

  useEffect(() => {
    SetCategory(categoryData);
  }, [])

	// 카테고리 변경시마다 스크롤 위치 맨 위로 이동시키기
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [productsList])

	// 소분류 카테고리 인덱스를 받아서 해당 상품 목록을 요청(10개-30개)
  function showProducts(idx) {
    getProducts(
      `api4/pdt_list/${idx}`,
      ({ data }) => {
        
        // 가격 처음나오는 '원'까지로 변환
        data.map((product) => {
          const extractedNumberWithWon = product.price.match(/(\d+,?\d*)원/);
          const extractedNumber = extractedNumberWithWon ? parseInt(extractedNumberWithWon[1].replace(',', ''), 10) : 0;
          const formattedPrice = extractedNumber.toLocaleString('ko-KR');

          product.price = formattedPrice + "원";
          return product;
        })
        
        SetProductsList(data)
      },
      (error) => {
        console.error(error);
      }
    )
  }

  // 메뉴 아이템 생성을 위한 배열
  const items2 = []
  let idx = 1;
  category.map((item, i) => {
    const smallCate = item.small_categories.map((sItem) => {
      return getItem(sItem.name, idx++, null, null);
    });
    items2.push(getItem(item.name, `cate${i}`, null, smallCate));
  });

  return (
    <Box className="Page-container" sx={{ height: '100%' }}>
      <Box className="product-container" sx={{ height: '100%', display: 'flex', marginLeft: 0 }}>
        {/* 대분류 카테고리 메뉴 */}
        <Box id="major-category">
          <Menu
            id="cate-menu"
            onClick={(e) => {
              showProducts(e.key)
            }}
            style={{
              backgroundColor: color,
              color: '#000000',
              fontSize: '1rem',
              itemSelectedColor: '#F9F9F9',
              border: 'none',
              position: 'relative',
              zIndex: 1001,
            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="vertical"
            triggerSubMenuAction="click"
            inlineIndent='10'
            items={items2}
          />
        </Box>
        {/* 상품 리스트 */}
        <Box className="product-list" ref={scrollRef} sx={{ height: '100%', flex: 1, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
          {productsList ? (
            productsList.map((item, i) => (
              <Card
                id="pdt-card"
                hoverable
                key={i}
                style={{ backgroundColor: '#ffffff', width: 249, height: 360 }}
                cover={
                  <img
                    alt="example"
                    src={item.img_url}
                    style={{ width: 249, height: 249 }}
                  />
                }
              >
                <Meta
                  title={
                    // 상품명 2줄 이상이면 ...으로 생략
                    <span className="my-card-title"
                      style={{
                        textWrap: "pretty", wordBreak: "break-word", display: "-webkit-box",
                        WebkitLineClamp: 2, WebkitBoxOrient: "vertical", minHeight: 50.28,
                      }}>
                      {item.item}
                    </span>}
                  description={
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#333', minWidth: 175.4 }}>
                    {item.price}
                    </div>
                  }
                />

                <AddShoppingCartIcon
                  onClick={() => { handleAdd(item) }}
                />

              </Card>
            ))
          ) : (
            '카테고리를 선택해주세요.'
          )
          }
        </Box>
      </Box>
    </Box>
  )
}
