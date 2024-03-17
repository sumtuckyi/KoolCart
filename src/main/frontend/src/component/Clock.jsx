import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import '../fonts/fonts.css';

export default function Clock() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const formatDate = (date) => {
    const option = {
      weekday: 'short',
    };

    const options = {
      month: '2-digit',
      day: '2-digit',
    };

    const datePart = date.toLocaleDateString('en-US', option);
    const dateParts = date.toLocaleDateString('en-US', options).split('/');
    return `${datePart} ${dateParts[0]}.${dateParts[1]}`;
  };

  const formatTime = (date) => {
    const options = {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return date.toLocaleTimeString('en-US', options);
  };

  return (
    <div>
      <div>
        <Typography variant="h1" style={{ fontFamily: 'Raleway', fontSize: '2.5em' }} sx={{ mt: 2 }}>
          {formatTime(dateTime)}
        </Typography>
      </div>
      <div>
        <Typography variant="h2" style={{ fontFamily: 'Dongle' }}>
          {formatDate(dateTime)}
        </Typography>
      </div>
    </div>
  );
}
