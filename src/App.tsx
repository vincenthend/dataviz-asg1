import React from 'react';
import { Button, Col, Row, Typography } from 'antd'
import 'antd/dist/reset.css'; // Importing antd styles

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{width: '100vw', height: '100vh', padding: '8px'}}>
      <Row>
        <Col flex={'auto'}>
        <Typography.Title>Title</Typography.Title>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Button onClick={() => setCount(count + 1)}>Increment</Button>
        </Col>
        <Col span={12}>
          <Typography.Text>{count}</Typography.Text>
        </Col>
      </Row>
    </div>
  );
}

export default App;
