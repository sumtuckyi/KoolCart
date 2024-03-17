import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSortType } from '../../redux/sortSlice'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SingleRegularComponent from './SingleRegularComponent';
import RegularService from './service/RegularService';
import { Box, Typography, MenuItem, Select, Divider } from '@mui/material';
import { setCustomOrder } from '../../redux/sortOrderSlice';


function ListRegularComponent({ isNewProductAdded }) {
  const [regulars, setRegulars] = useState([]); // 정기배송 리스트 상태
  const userSeq = useSelector((state) => state.user.userSeq); // 사용자 고유 번호
  const sortType = useSelector((state) => state.sort.value); // 현재 정렬 유형 상태
  const customOrder = useSelector((state) => state.sortOrder.customOrder); // 사용자 지정 순서 상태
  const dispatch = useDispatch();

  // 정기배송 데이터를 가져오고, sortType이 변경될 때마다 정렬
  useEffect(() => {
      fetchRegulars(customOrder);
  }, [userSeq, isNewProductAdded, sortType, customOrder]);

  // 정기배송 데이터를 서버에서 가져옴
  const fetchRegulars = async (customOrder) => {
      try {
          const response = await RegularService.getRegularsByUser(userSeq);
          let sortedRegulars = response.data;

          if (sortType === 'custom') {
              // customOrder가 있을 경우 사용자 지정 순으로 정렬
              console.log(customOrder)
              sortedRegulars.sort((a, b) => {
                const indexA = customOrder.indexOf(a.rdSeq);
                const indexB = customOrder.indexOf(b.rdSeq);
              
                if (indexA === -1 && indexB === -1) return 0; // 둘 다 customOrder에 없으면 순서 변경 없음
                if (indexA === -1) return 1; // A만 customOrder에 없으면 A를 뒤로
                if (indexB === -1) return -1; // B만 customOrder에 없으면 B를 뒤로
                return indexA - indexB; // customOrder에 둘 다 있으면 순서대로 정렬
              });
          } else {
              // 남은 배송 일자로 정렬
              sortedRegulars.sort((a, b) => new Date(a.nextOrder) - new Date(b.nextOrder));
          }

          setRegulars(sortedRegulars);
      } catch (error) {
          console.error('Error fetching regulars:', error);
      }
  };

  // 정렬 기준 변경 핸들러
  const handleSortChange = (event) => {
    dispatch(setSortType(event.target.value));
  };

  // 드래그 앤 드롭 이벤트 핸들러
  const onDragEnd = (result) => {
    if (!result.destination || sortType !== 'custom') return;

    const items = Array.from(regulars);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRegulars(items);

    // 사용자 지정 순서를 Redux에 저장
    console.log(items)
    dispatch(setCustomOrder(items.map(item => item.rdSeq))); 
  };

  // 정기 배송 해지 반영
  const handleTerminate = (terminatedRegular) => {
    // 정기 주문 해지 후, 해당 주문을 리스트에서 제거
    setRegulars((prevRegulars) => prevRegulars.filter(regular => regular.rdSeq !== terminatedRegular.rdSeq));
  }

  // 정기 배송 정보 업데이트 처리
  const handleUpdateRegular = (updatedRegular) => {
    setRegulars(currentRegulars =>
      currentRegulars.map(regular => 
        regular.rdSeq === updatedRegular.rdSeq ? updatedRegular : regular
      )
    );
  
    // 배송 예정 기준일 경우 정렬 로직 수행
    if (sortType === 'date') {
      setRegulars(currentRegulars =>
        [...currentRegulars].sort((a, b) => new Date(a.nextOrder) - new Date(b.nextOrder))
      );
    }
  };

  return (
    <Box sx={{ py: 2, px: 4 }}>
      {/* 신청내역 타이틀, 정렬 선택 창 */}
      <Box sx = {{display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant="h6" sx = {{display: 'flex', alignItems: 'end', fontWeight: 'bolder'}}>
          정기배송 신청내역 ({regulars.length}건)
        </Typography>

        <Select
          value={sortType}
          onChange={handleSortChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          size='small'
          sx = {{
            mt : 1
          }}
        >
          <MenuItem value="date">
            <Typography>배송 예정 순</Typography>
          </MenuItem>
          <MenuItem value="custom">
            <Typography>사용자 지정 순</Typography>
          </MenuItem>
        </Select>
      </Box>

      <Divider/>

      {/* 정기배송 리스트 */}
      <Box sx = {{height: '76.5vh', overflowY: 'auto'}}>

        {sortType === 'custom' ? (
          // 사용자 지정 순 정렬일 때 드래그 앤 드롭 가능한 리스트를 표시
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="regulars">
              {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  {regulars.map((regular, index) => (
                    <Draggable key={regular.rdSeq} draggableId={String(regular.rdSeq)} index={index}>
                      {(provided) => (
                        <Box ref={provided.innerRef} {...provided.draggableProps}>
                          <SingleRegularComponent 
                            key={regular.rdSeq} 
                            regular={regular}
                            onTermination={handleTerminate}
                            onUpdateRegular={handleUpdateRegular}
                            dragHandleProps={provided.dragHandleProps} 
                          />
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          // 배송 예정 순 정렬일 경우, 드래그 앤 드롭 없이 리스트 표시
          regulars.map((regular, index) => (
            <SingleRegularComponent 
              key={regular.rdSeq} 
              regular={regular}
              onTermination={handleTerminate}
              onUpdateRegular={handleUpdateRegular}
            />
          ))
        )}
      </Box>
    </Box>
  );
}

export default ListRegularComponent;