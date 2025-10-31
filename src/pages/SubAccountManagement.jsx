import React, { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Dropdown,
  Input,
  Select,
  Alert,
  Switch,
  Pagination,
  Row,
  Col,
  Tag,
  Tooltip,
  Modal,
} from 'antd'
import {
  DownloadOutlined,
  SettingOutlined,
  EditOutlined,
  PlusOutlined,
  MinusOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import './SubAccountManagement.css'

const SubAccountManagement = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [searchText, setSearchText] = useState('')
  const [filterAccount, setFilterAccount] = useState(null)

  // 模拟数据
  const mockData = [
    {
      key: '1',
      accountName: 'sub_account_001',
      subAccounts: 2,
      balance: 5000.00,
      promotionPlans: 8,
      createPermission: true,
      transferPermission: false,
      rechargePermission: true,
      conflict: { status: '无冲突', description: '账户状态正常' },
      stores: 5,
    },
    {
      key: '2',
      accountName: 'sub_account_002',
      subAccounts: 1,
      balance: 3200.50,
      promotionPlans: 5,
      createPermission: false,
      transferPermission: true,
      rechargePermission: true,
      conflict: { status: '有冲突', description: '存在权限冲突' },
      stores: 3,
    },
    {
      key: '3',
      accountName: 'sub_account_003',
      subAccounts: 0,
      balance: 8500.00,
      promotionPlans: 12,
      createPermission: true,
      transferPermission: true,
      rechargePermission: false,
      conflict: { status: '无冲突', description: '账户状态正常' },
      stores: 8,
    },
  ]

  const columns = [
    {
      title: '子账号信息',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 200,
      render: (text, record) => (
        <div className="account-info">
          <div className="account-name">{text}</div>
          <Button
            type="text"
            size="small"
            icon={<MoreOutlined />}
            className="more-btn"
          />
        </div>
      ),
    },
    {
      title: '下级子账号',
      dataIndex: 'subAccounts',
      key: 'subAccounts',
      width: 120,
      align: 'center',
      render: (text) => <span>{text}</span>,
    },
    {
      title: '账号余额 (元)',
      dataIndex: 'balance',
      key: 'balance',
      width: 140,
      align: 'right',
      render: (text) => <span className="balance">{text.toFixed(2)}</span>,
    },
    {
      title: '推广计划',
      dataIndex: 'promotionPlans',
      key: 'promotionPlans',
      width: 120,
      align: 'center',
      render: (text) => <span>{text}</span>,
    },
    {
      title: '创意新建权限',
      dataIndex: 'createPermission',
      key: 'createPermission',
      width: 140,
      align: 'center',
      render: (checked) => (
        <Switch checked={checked} onChange={() => {}} />
      ),
    },
    {
      title: '资金转移权限',
      dataIndex: 'transferPermission',
      key: 'transferPermission',
      width: 140,
      align: 'center',
      render: (checked) => (
        <Switch checked={checked} onChange={() => {}} />
      ),
    },
    {
      title: '账户充值权限',
      dataIndex: 'rechargePermission',
      key: 'rechargePermission',
      width: 140,
      align: 'center',
      render: (checked) => (
        <Switch checked={checked} onChange={() => {}} />
      ),
    },
    {
      title: '推广账号冲突',
      dataIndex: 'conflict',
      key: 'conflict',
      width: 160,
      render: (conflict) => (
        <div className="conflict-cell">
          <Tag color={conflict.status === '无冲突' ? 'green' : 'red'}>
            {conflict.status}
          </Tag>
          <Tooltip title={conflict.description}>
            <EditOutlined className="edit-icon" />
          </Tooltip>
        </div>
      ),
    },
    {
      title: '可推广门店',
      dataIndex: 'stores',
      key: 'stores',
      width: 120,
      align: 'center',
      render: (text) => <span>{text}</span>,
    },
    {
      title: '门店操作',
      key: 'storeOperation',
      width: 160,
      align: 'center',
      render: () => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            className="bind-btn"
          >
            绑定
          </Button>
          <Button
            danger
            size="small"
            icon={<MinusOutlined />}
            className="unbind-btn"
          >
            解绑
          </Button>
        </Space>
      ),
    },
  ]

  const handleBatchAssign = () => {
    Modal.info({
      title: '批量分配门店',
      content: '此功能将在后续版本中实现',
    })
  }

  const handleSetPermissions = () => {
    Modal.info({
      title: '设置权限规则',
      content: '此功能将在后续版本中实现',
    })
  }

  const handleBatchSetPermissions = () => {
    Modal.info({
      title: '批量设置权限',
      content: '此功能将在后续版本中实现',
    })
  }

  const handleOpenMore = () => {
    Modal.info({
      title: '开通更多账号',
      content: '此功能将在后续版本中实现',
    })
  }

  return (
    <div className="sub-account-management">
      <div className="page-container">
        {/* 页面标题区 */}
        <div className="title-section">
          <div className="title-left">
            <h1 className="page-title">子账号管理</h1>
          </div>
          <div className="title-right">
            <Space size="middle">
              <Dropdown
                menu={{
                  items: [
                    { key: '1', label: '按门店分配' },
                    { key: '2', label: '按权限分配' },
                  ],
                }}
              >
                <Button icon={<DownloadOutlined />}>批量分配门店</Button>
              </Dropdown>
              <Button
                type="primary"
                icon={<SettingOutlined />}
                onClick={handleSetPermissions}
              >
                设置权限规则
              </Button>
            </Space>
          </div>
        </div>

        {/* 提示栏 */}
        <Alert
          message="3/6 个子账号已开通：美团营销平台的使用权"
          description="以下各项管理仅对已开通使用权限的子账号生效"
          type="info"
          showIcon
          closable
          className="info-alert"
          action={
            <Button
              size="small"
              type="text"
              onClick={handleOpenMore}
              className="open-more-link"
            >
              开通更多账号
            </Button>
          }
        />

        {/* 说明与操作区 */}
        <Card className="operation-card">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12}>
              <div className="description">
                以下是 waimai_ad_test_310 的子账号
              </div>
            </Col>
            <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                onClick={handleBatchSetPermissions}
              >
                批量设置权限
              </Button>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col xs={24} sm={12}>
              <Space.Compact style={{ width: '100%' }}>
                <Select
                  placeholder="账号名称"
                  style={{ width: '40%' }}
                  value={filterAccount}
                  onChange={setFilterAccount}
                  allowClear
                  options={[
                    { label: 'sub_account_001', value: 'sub_account_001' },
                    { label: 'sub_account_002', value: 'sub_account_002' },
                    { label: 'sub_account_003', value: 'sub_account_003' },
                  ]}
                />
                <Input.Search
                  placeholder="搜索账号"
                  style={{ width: '60%' }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Space.Compact>
            </Col>
          </Row>
        </Card>

        {/* 表格区 */}
        <Card className="table-card">
          <Table
            columns={columns}
            dataSource={mockData}
            pagination={false}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            scroll={{ x: 1200 }}
            className="sub-account-table"
          />

          {/* 分页 */}
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              total={30}
              pageSize={10}
              onChange={setCurrentPage}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 条`}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SubAccountManagement
