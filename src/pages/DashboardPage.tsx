import { useMemo } from 'react';
import { useAppSelector } from '../hooks/useApp';
import { Card, Row, Col, Statistic, Progress, Timeline, Tag, Space } from 'antd';
import {
   UserOutlined,
   TeamOutlined,
   ArrowUpOutlined,
   ArrowDownOutlined,
   VerticalAlignMiddleOutlined,
} from '@ant-design/icons';
import {
   calculateOverviewStats,
   calculateAgeDistribution,
   calculateRegistrationTimeline,
   calculateActiveDays,
} from '../utils/dashboardUtils';

export const DashboardPage = () => {
   const users = useAppSelector(state => state.users.usersList);

   const overviewStats = useMemo(() => calculateOverviewStats(users), [users]);
   const ageDistribution = useMemo(() => calculateAgeDistribution(users), [users]);
   const registrationTimeline = useMemo(() => calculateRegistrationTimeline(users), [users]);
   const activeDays = useMemo(() => calculateActiveDays(users), [users]);

   if (users.length === 0) {
      return (
         <div className="p-6">
            <Card>
               <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">No users data available</p>
                  <p className="text-gray-400 text-sm mt-2">
                     Add some users to see dashboard statistics
                  </p>
               </div>
            </Card>
         </div>
      );
   }

   return (
      <div className="flex flex-col gap-4 p-6 space-y-6">
         <h1 className="text-2xl font-bold ">Dashboard Overview</h1>

         <Card title="Overview Statistics" className="mb-6">
            <Row gutter={[16, 16]}>
               <Col xs={24} sm={12} lg={6}>
                  <Card>
                     <Statistic
                        title="Total Users"
                        value={overviewStats.totalUsers}
                        prefix={<TeamOutlined />}
                        valueStyle={{ color: '#3f8600' }}
                     />
                  </Card>
               </Col>
               <Col xs={24} sm={12} lg={6}>
                  <Card>
                     <Statistic
                        title="Average Age"
                        value={overviewStats.averageAge}
                        suffix="years"
                        prefix={<VerticalAlignMiddleOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                     />
                  </Card>
               </Col>
               <Col xs={24} sm={12} lg={6}>
                  <Card>
                     <Statistic
                        title="Oldest User"
                        value={overviewStats.maxAge}
                        suffix="years"
                        prefix={<ArrowUpOutlined />}
                        valueStyle={{ color: '#cf1322' }}
                     />
                     {overviewStats.oldestUser && (
                        <div className="text-xs text-gray-500 mt-2">
                           {overviewStats.oldestUser.name}
                        </div>
                     )}
                  </Card>
               </Col>
               <Col xs={24} sm={12} lg={6}>
                  <Card>
                     <Statistic
                        title="Youngest User"
                        value={overviewStats.minAge}
                        suffix="years"
                        prefix={<ArrowDownOutlined />}
                        valueStyle={{ color: '#32CD32' }}
                     />
                     {overviewStats.youngestUser && (
                        <div className="text-xs text-gray-500 mt-2">
                           {overviewStats.youngestUser.name}
                        </div>
                     )}
                  </Card>
               </Col>
            </Row>
         </Card>

         <Card title="Age Distribution" className="mb-6">
            <Row gutter={[16, 16]}>
               {ageDistribution.map(group => (
                  <Col xs={24} sm={12} lg={8} key={group.range}>
                     <Card size="small">
                        <div className="mb-2">
                           <Space>
                              <Tag color="blue">{group.range} years</Tag>
                              <span className="font-semibold ">{group.count} users</span>
                           </Space>
                        </div>
                        <Progress
                           percent={group.percentage}
                           strokeColor={{
                              '0%': '#108ee9',
                              '100%': '#87d068',
                           }}
                           format={() => `${group.percentage}%`}
                        />
                     </Card>
                  </Col>
               ))}
            </Row>
         </Card>

         <Card title="Registration Timeline (Last 6 Months)" className="mb-6">
            <Timeline
               items={registrationTimeline.map(period => ({
                  children: (
                     <div>
                        <div className="font-semibold text-lg mb-2">{period.period}</div>
                        <Space>
                           <UserOutlined className="text-blue-500" />
                           <span className="text-gray-700 font-medium">
                              {period.count} {period.count === 1 ? 'user' : 'users'} registered
                           </span>
                        </Space>
                        <Progress
                           percent={Math.round((period.count / overviewStats.totalUsers) * 100)}
                           size="small"
                           className="mt-2"
                           showInfo
                        />
                     </div>
                  ),
                  color: period.count >= 5 ? 'green' : period.count >= 2 ? 'blue' : 'gray',
               }))}
            />
         </Card>

         <Card title="Quick Stats">
            <Row gutter={[16, 16]}>
               <Col xs={24} sm={8}>
                  <Card>
                     <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{users.length}</div>
                        <div className="text-gray-500 mt-2">Total Users</div>
                     </div>
                  </Card>
               </Col>
               <Col xs={24} sm={8}>
                  <Card>
                     <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{activeDays}</div>
                        <div className="text-gray-500 mt-2">Active Days</div>
                     </div>
                  </Card>
               </Col>
               <Col xs={24} sm={8}>
                  <Card>
                     <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                           {overviewStats.maxAge - overviewStats.minAge}
                        </div>
                        <div className="text-gray-500 mt-2">Age Range (years)</div>
                     </div>
                  </Card>
               </Col>
            </Row>
         </Card>
      </div>
   );
};
