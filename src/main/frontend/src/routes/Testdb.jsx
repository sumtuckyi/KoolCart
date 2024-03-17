import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Testdb = () => {
  const [message, setMessage] = useState([]);
  const [data, setData] = useState([]);
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    axios.get('/api/hello')
    .then(response => { setMessage(response.data) });

    axios.get('/api/test_spring')
    .then(response => { setData(response.data) });

    axios.post('/api/test_mysql')
    .then(response => { setTestData(response.data) });
  }, []);

  return (
    <div>
      <header>
        <img src="/images/img1.jpg" style={{width: '200px', height: '200px'}} />
        <h1>SpringBoot /hello로부터 받은 데이터 출력</h1>
        <ul style={{listStyle: 'none'}}>
          {
            message.map((item, index) => <li key={index}>{item}</li>)
          }
        </ul>
        <hr />

        <section>
          <h2>SpringBoot /list로부터 받은 데이터 출력</h2>
          <ul style={{listStyle: 'none'}}>
            {
              data.map((item, index) => <li key={index}>{item.name} / {item.addr} / {item.age}</li>)
            }
          </ul>

        <h2>MySQL /person로부터 받은 데이터 출력</h2>
          <ul style={{listStyle: 'none'}}>
          {
            testData.map((item, index) => <li key={index}>{item.seq} / {item.name}</li>)
          }
        </ul>

        </section>
      </header>
    </div>
  );
};

export default Testdb;