import React from 'react'
import { Layout, Menu, Button, Space, Dropdown } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import './Header.css'

const Header = () => {
  const navItems = [
    { key: 'home', label: '首页' },
    { key: 'promotion', label: '我的推广' },
    { key: 'report', label: '数据报表' },
    { key: 'tools', label: '我的工具' },
    { key: 'assets', label: '我的资产' },
    { key: 'classroom', label: '我的课堂' },
  ]

  const userMenuItems = [
    {
      key: 'logout',
      label: '退出',
      icon: <LogoutOutlined />,
    },
  ]

  return (
    <Layout.Header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">美团营销平台</div>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['assets']}
            items={navItems}
            className="nav-menu"
          />
        </div>
        <div className="header-right">
          <Space size="large">
            <span className="account-name">
              <UserOutlined /> waimai_ad_test_310
            </span>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" danger>
                退出
              </Button>
            </Dropdown>
          </Space>
        </div>
      </div>
    </Layout.Header>
  )
}

export default Header
