import styled from 'styled-components';
import CateButton from './Button';
import PdtCard from './Card';
import { useState, useEffect } from 'react';

const StyledContainer = styled.div`
    height: 500px;
    width: 800px;
    margin-left: 20px;
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`

const StyledWrapper = styled.div`
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    align-item: center;
    overflow: scroll;
    margin-top: 50px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.3);
    &::-webkit-scrollbar {
    display: none;
    }
`

const StyledButtons = styled.div`
    display: flex;
    align-items: center;
`
const StyledCardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`

// array는 보여줄 재고 리스트, handleClick은 카테고리 버튼 식별할 키 값, text는 재고가 없을 때 보여줄 텍스트,
// showAll은 전체보기 버튼 클릭 시 호출될 함수, cateKey는 현재 클릭된 카테고리 번호, tof는 재고인지 유통기한 만료 상품인지 구분(true면 재고)
export function Inventory({ array, handleClick, text, showAll, func, cateKey, tof }) {

const majorCategoryList = ['전체보기', '채소', '과일', '해산물', '정육/계란', '반찬', '물/음료', '간식', '유제품']

const [likedItems, setLikedItems] = useState({});

    useEffect(() => {
        const newLikedItems = array.reduce((obj, item) => {
            obj[item.id] = true;
            return obj;
        }, {});
        setLikedItems(newLikedItems);
    }, [array]);

    const toggleLiked = (itemId) => {
        setLikedItems((prev) => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };


const handleCategoryClick = (key) => {
    handleClick(key);
    // slideIndex.current = 0;
}

return (
    <StyledContainer>
        <StyledButtons>
            <CateButton
                list={majorCategoryList}
                handleClick={handleCategoryClick}
            />
        </StyledButtons>
        <StyledWrapper>
            {array.length === 0 ? (
                <StyledCardWrapper>
                    <styleP>해당 카테고리의 재고가 없습니다.</styleP>
                </StyledCardWrapper>
                ) : (
                array.map((i, idx) => (
                    <StyledCardWrapper key={idx}>
                        <PdtCard 
                            item={i} 
                            action={func} 
                            cateKey={cateKey} 
                            tof={tof} 
                            liked={!!likedItems[i.id]}
                            onToggleLiked={toggleLiked}
                        />
                    </StyledCardWrapper>
                ))
                )
            }
        </StyledWrapper>
    </StyledContainer>
)
}