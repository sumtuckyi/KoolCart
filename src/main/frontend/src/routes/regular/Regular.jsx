import React, { useState } from 'react';
import Box from '@mui/material/Box';
import ListRegularComponent from './ListRegularComponent';
import AddRegularComponent from './AddRegularComponent';

export default function Regular() {
  const [isNewProductAdded, setNewProductAdded] = useState(false);

  // 새로운 상품이 추가되었을 때 호출
  const handleNewProductAdded = () => {
    setNewProductAdded(true);

    // 리스트에 반영하는 시간 주기
    setTimeout(() => {
      setNewProductAdded(false);
    }, 10);
  };

  return (
    <Box className="Regular-container" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        marginLeft: '180px',
        px: 4
        }}>
        <AddRegularComponent onNewProductAdded={handleNewProductAdded} className="AddRegularComponent"/>
        <ListRegularComponent isNewProductAdded={isNewProductAdded} className="ListRegularComponent"/>
    </Box>
  );
}