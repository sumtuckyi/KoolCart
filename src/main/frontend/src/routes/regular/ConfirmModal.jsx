import React from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ProductComponent from './ProductComponent';

function ConfirmModal({ 
  callback, // 확인 버튼 클릭시 호출 함수
  regular, // 확인할 정기배송 객체
  buttonName, // 모달 열기 위한 버튼 텍스트
  title // 모달 제목
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handlePurchase = () => {
    callback(regular);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleOpen} sx={{mx : 1}}>{buttonName}</Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50vw',
          bgcolor: 'background.paper',
          boxShadow: 24,
          pt: 2,
          px: 4,
          pb: 3,
        }}>
          <Typography variant="h5" fontWeight={'bold'}>{title}</Typography>
          <Box sx={{mt : 3}}>
            <ProductComponent regular={regular} />
          </Box>
          <Box sx={{display: 'flex', justifyContent : 'center', mt : 5}}>
            <Button variant="outlined" onClick={handleClose} sx= {{mx:3}}>취소</Button>
            <Button variant="contained" onClick={handlePurchase} sx = {{mx:3}}>확인</Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default ConfirmModal;
