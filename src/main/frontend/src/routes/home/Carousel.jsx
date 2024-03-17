import { useSpringCarousel } from 'react-spring-carousel'
import { useRef, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import { useDrag } from 'react-use-gesture';
import styled from 'styled-components';
import PdtCard from './Card';
import CateButton from './Button';

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 800px;
    height: 100px;
    position: relative;
    margin-left: 15px;
`;

const CarouselContainer = styled.div`
    ${'' /* width: 100%; */}
    width: 800px;
    ${'' /* max-width: 800px; */}
    ${'' /* margin: 0 auto; */}
    ${'' /* overflow: hidden; */}
`;

const CarouselWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 300px; /* Adjust the height based on your requirement */
    margin: 15px;
    padding: 15px;
    overflow: hidden;
`;


export function Component({ array, handleClick, text }) {
    console.log(array)
    const bind = useDrag(
        ({ swipe: [swipeX] }) => {
            if (swipeX < 0) {
                slideToNextItem();
            } else if (swipeX > 0) {
                slideToPrevItem();
            }
        },
        {
            filterTaps: true,
            axis: 'x',
        }
    );

    const {
        carouselFragment,
        slideToPrevItem,
        slideToNextItem
    } = useSpringCarousel({
        itemsPerSlide: 1,
        slideType: 'fluid',
        withLoop: true,
        startEndGutter: 30,
        // freeScroll: true,
        items: (array ?? []).length == 0 ? [{
            id: 1,
            renderItem: (
                <p>해당 카테고리의 재고가 없습니다.</p>
            )
        }] : (array?.map((i, idx) => ({
            id: idx,
            renderItem: (
                <PdtCard item={i} />
            ),
        }))),
    });

    // 카테고리 버튼 누를 때마다 스크롤 위치 맨 왼쪽으로 이동시키기
    const scrollRef = useRef(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = 0;
        }
    }, [array])


    // const carouselStyle = {
    //     width: '800px', // Adjust the width based on your requirement
    //     height: '300px',
    //     margin: '50px',
    //     padding: '15px',
    //     overflow: 'hidden'
    // };


    const carouselButtonStyle = {
        height: '24px',
        width: '65px',
        textAlign: 'center',
        padding: '5px',
        margin: '5px',
        marginRight: '15px',
        position: 'relative',
        border: 'none',
        color: '#99A9D5',
        borderRadius: '5px',
        backdropFilter: 'blur(15px)',
        boxShadow: '0 0 10px 1px rgba(0, 0, 0, 0.25)'
    }



    const majorCategoryList = ['채소', '과일', '해산물', '정육/계란', '반찬', '물/음료', '간식', '유제품']

    return (
        <CarouselContainer ref={scrollRef} {...bind()}>
            <ButtonsContainer>
                <Button onClick={slideToPrevItem} style={carouselButtonStyle}>Prev</Button>
                <Button onClick={slideToNextItem} style={carouselButtonStyle}>Next</Button>
            </ButtonsContainer>
            <ButtonsContainer>
                <button style={carouselButtonStyle}>전체보기</button>
                <CateButton
                    list={majorCategoryList}
                    handleClick={handleClick}
                />
            </ButtonsContainer>
            <CarouselWrapper {...bind()}>
                {
                    array?.length == 0 ?
                        <p>{text}</p> :
                        carouselFragment
                }
            </CarouselWrapper>
        </CarouselContainer>
    );
}


export function ExpComponent({ array, handleClick }) {
    console.log(array)
    const bind = useDrag(
        ({ swipe: [swipeX] }) => {
            if (swipeX < 0) {
                slideToNextItem();
            } else if (swipeX > 0) {
                slideToPrevItem();
            }
        },
        {
            filterTaps: true,
            axis: 'x',
        }
    );

    const {
        carouselFragment,
        slideToPrevItem,
        slideToNextItem
    } = useSpringCarousel({
        itemsPerSlide: 1,
        slideType: 'fluid',
        // withLoop: true,
        startEndGutter: 30,
        // freeScroll: true,
        items: (array ?? []).length == 0 ? [{
            id: 1,
            renderItem: (
                <p>유통기한 임박 재고 없음</p>
            )
        }] : (array?.map((i, idx) => ({
            id: idx,
            renderItem: (
                <PdtCard item={i} />
            ),
        }))),
    });

    // 카테고리 버튼 누를 때마다 스크롤 위치 맨 왼쪽으로 이동시키기
    const scrollRef = useRef(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = 0;
        }
    }, [array])


    // const carouselStyle = {
    //     width: '800px', // Adjust the width based on your requirement
    //     height: '300px',
    //     margin: '50px',
    //     padding: '15px',
    //     overflow: 'hidden'
    // };


    const carouselButtonStyle = {
        height: '24px',
        width: '65px',
        textAlign: 'center',
        padding: '5px',
        margin: '5px',
        marginRight: '15px',
        position: 'relative',
        border: 'none',
        color: '#99A9D5',
        borderRadius: '5px',
        backdropFilter: 'blur(15px)',
        boxShadow: '0 0 10px 1px rgba(0, 0, 0, 0.25)'
    }

    const majorCategoryList = ['채소', '과일', '해산물', '정육/계란', '반찬', '물/음료', '간식', '유제품']


    return (
        <CarouselContainer ref={scrollRef}>
            <ButtonsContainer>
                <Button onClick={slideToPrevItem} style={carouselButtonStyle}>Prev</Button>
                <Button onClick={slideToNextItem} style={carouselButtonStyle}>Next</Button>
            </ButtonsContainer>
            <ButtonsContainer>
                <button style={carouselButtonStyle}>전체보기</button>
                <CateButton
                    list={majorCategoryList}
                    handleClick={handleClick}
                />
            </ButtonsContainer>
            <CarouselWrapper {...bind()}>
                {
                    array?.length === 0 ?
                        <p>유통기한 임박상품 없음...</p> :
                        carouselFragment
                }
            </CarouselWrapper>
        </CarouselContainer>
    );
}