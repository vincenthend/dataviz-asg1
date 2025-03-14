import {
  Card,
  Col,
  ConfigProvider,
  Layout,
  Row,
  Space,
  Typography,
} from 'antd';
import 'antd/dist/reset.css';
import { useData } from './hooks/useData.ts';
import PieChart from './charts/PieChart.tsx';
import StackedChart from './charts/StackedChart.tsx';
import Heatmap from './charts/Heatmap.tsx'; // Importing antd styles

function App() {
  const data = useData();

  return (
    <ConfigProvider theme={{ token: { fontSize: 16 } }}>
      <Layout style={{ height: '100%', padding: '32px' }}>
        <Layout.Content>
          <Space direction={'vertical'} style={{ width: '100%' }}>
            <Card>
              <Typography.Title style={{ margin: 0 }}>
                Drugs Viz
              </Typography.Title>
            </Card>
            <Row gutter={16}>
              <Col span={24}>
                <Card title={'Drug Usage by Age'}>
                  <Heatmap data={data} />
                </Card>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Card title={'Drug Usage Over Time'}>
                  <StackedChart data={data} />
                </Card>
              </Col>
              <Col span={12}>
                <Card title={'Drug user Distribution'}>
                  <PieChart data={data} />
                </Card>
              </Col>
            </Row>
          </Space>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
