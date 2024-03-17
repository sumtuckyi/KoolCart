import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SmileOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';

const Modal = ({ text, buttonText }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/order'); 
    };

    return (
        <Result
            icon={<SmileOutlined />}
            title={text}
            extra={<Button type="primary" onClick={handleClick}>{buttonText}</Button>}
        />
    )
};

export default Modal;
