import React from 'react'
import { Layout } from 'antd'
import Header from './components/Header'
import SubAccountManagement from './pages/SubAccountManagement'
import './App.css'

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout.Content style={{ padding: '0' }}>
        <SubAccountManagement />
      </Layout.Content>
    </Layout>
  )
}

export default App
