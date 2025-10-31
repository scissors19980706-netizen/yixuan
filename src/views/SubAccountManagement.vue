<template>
  <div class="sub-account-management">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-left">
        <div class="logo">美团营销平台</div>
        <nav class="nav-menu">
          <a href="#" class="nav-item">首页</a>
          <a href="#" class="nav-item">我的推广</a>
          <a href="#" class="nav-item">数据报表</a>
          <a href="#" class="nav-item">我的工具</a>
          <a href="#" class="nav-item active">我的资产</a>
          <a href="#" class="nav-item">我的课堂</a>
        </nav>
      </div>
      <div class="header-right">
        <span class="account-name">waimai_ad_test_310</span>
        <a href="#" class="logout-btn">退出</a>
      </div>
    </header>

    <!-- 页面主体 -->
    <main class="main-content">
      <!-- 标题区 -->
      <div class="title-section">
        <h1 class="page-title">子账号管理</h1>
        <div class="title-actions">
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1">批量分配门店 - 选项1</a-menu-item>
                <a-menu-item key="2">批量分配门店 - 选项2</a-menu-item>
              </a-menu>
            </template>
            <a-button type="default">
              批量分配门店
              <DownOutlined />
            </a-button>
          </a-dropdown>
          <a-button type="primary">设置权限规则</a-button>
        </div>
      </div>

      <!-- 提示栏 -->
      <a-alert
        message="3/6 个子账号已开通：美团营销平台的使用权"
        description="以下各项管理仅对已开通使用权限的子账号生效"
        type="info"
        show-icon
        closable
        class="alert-section"
      >
        <template #action>
          <a href="#" class="open-more-link">开通更多账号</a>
        </template>
      </a-alert>

      <!-- 说明文字 -->
      <div class="info-section">
        <span>以下是 waimai_ad_test_310 的子账号</span>
      </div>

      <!-- 操作区 -->
      <div class="operation-section">
        <div class="left-actions">
          <a-input-group compact>
            <a-select
              v-model:value="filterType"
              style="width: 120px"
              placeholder="账号名称"
            >
              <a-select-option value="name">账号名称</a-select-option>
              <a-select-option value="status">账号状态</a-select-option>
            </a-select>
            <a-input-search
              v-model:value="searchText"
              placeholder="搜索账号"
              style="width: 200px"
              @search="onSearch"
            />
          </a-input-group>
        </div>
        <div class="right-actions">
          <a-button type="primary">批量设置权限</a-button>
        </div>
      </div>

      <!-- 表格区 -->
      <div class="table-section">
        <a-table
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          :loading="loading"
          rowKey="id"
          @change="handleTableChange"
          :scroll="{ x: 1500 }"
        >
          <!-- 账号名称列 -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'accountName'">
              <div class="account-name-cell">
                <span>{{ record.accountName }}</span>
                <a-dropdown>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="1">编辑</a-menu-item>
                      <a-menu-item key="2">删除</a-menu-item>
                      <a-menu-item key="3">重置密码</a-menu-item>
                    </a-menu>
                  </template>
                  <MoreOutlined class="more-icon" />
                </a-dropdown>
              </div>
            </template>

            <!-- 下级子账号列 -->
            <template v-else-if="column.key === 'subAccounts'">
              <span>{{ record.subAccounts }}</span>
            </template>

            <!-- 账号余额列 -->
            <template v-else-if="column.key === 'balance'">
              <span class="balance">¥ {{ record.balance }}</span>
            </template>

            <!-- 推广计划列 -->
            <template v-else-if="column.key === 'promotionPlans'">
              <span>{{ record.promotionPlans }}</span>
            </template>

            <!-- 创意新建权限列 -->
            <template v-else-if="column.key === 'creativePermission'">
              <a-switch v-model:checked="record.creativePermission" />
            </template>

            <!-- 资金转移权限列 -->
            <template v-else-if="column.key === 'fundTransferPermission'">
              <a-switch v-model:checked="record.fundTransferPermission" />
            </template>

            <!-- 账户充值权限列 -->
            <template v-else-if="column.key === 'rechargePermission'">
              <a-switch v-model:checked="record.rechargePermission" />
            </template>

            <!-- 推广账号冲突列 -->
            <template v-else-if="column.key === 'accountConflict'">
              <div class="conflict-cell">
                <span>{{ record.accountConflict }}</span>
                <EditOutlined class="edit-icon" />
              </div>
            </template>

            <!-- 可推广门店列 -->
            <template v-else-if="column.key === 'promotableStores'">
              <span>{{ record.promotableStores }}</span>
            </template>

            <!-- 门店操作列 -->
            <template v-else-if="column.key === 'storeOperation'">
              <div class="store-operation">
                <a-button type="link" size="small">+ 绑定</a-button>
                <a-button type="link" size="small" danger>- 解绑</a-button>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DownOutlined, MoreOutlined, EditOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// 表格列定义
const columns = [
  {
    title: '子账号信息',
    dataIndex: 'accountName',
    key: 'accountName',
    width: 180,
  },
  {
    title: '下级子账号',
    dataIndex: 'subAccounts',
    key: 'subAccounts',
    width: 100,
    align: 'center',
  },
  {
    title: '账号余额 (元)',
    dataIndex: 'balance',
    key: 'balance',
    width: 130,
    align: 'right',
  },
  {
    title: '推广计划',
    dataIndex: 'promotionPlans',
    key: 'promotionPlans',
    width: 100,
    align: 'center',
  },
  {
    title: '创意新建权限',
    dataIndex: 'creativePermission',
    key: 'creativePermission',
    width: 130,
    align: 'center',
  },
  {
    title: '资金转移权限',
    dataIndex: 'fundTransferPermission',
    key: 'fundTransferPermission',
    width: 130,
    align: 'center',
  },
  {
    title: '账户充值权限',
    dataIndex: 'rechargePermission',
    key: 'rechargePermission',
    width: 130,
    align: 'center',
  },
  {
    title: '推广账号冲突',
    dataIndex: 'accountConflict',
    key: 'accountConflict',
    width: 130,
  },
  {
    title: '可推广门店',
    dataIndex: 'promotableStores',
    key: 'promotableStores',
    width: 100,
    align: 'center',
  },
  {
    title: '门店操作',
    dataIndex: 'storeOperation',
    key: 'storeOperation',
    width: 150,
    fixed: 'right',
    align: 'center',
  },
]

// 表格数据
const tableData = ref([
  {
    id: 1,
    accountName: 'sub_account_001',
    subAccounts: 0,
    balance: 1500.00,
    promotionPlans: 5,
    creativePermission: true,
    fundTransferPermission: true,
    rechargePermission: false,
    accountConflict: '无冲突',
    promotableStores: 10,
  },
  {
    id: 2,
    accountName: 'sub_account_002',
    subAccounts: 2,
    balance: 3200.50,
    promotionPlans: 8,
    creativePermission: true,
    fundTransferPermission: false,
    rechargePermission: true,
    accountConflict: '无冲突',
    promotableStores: 15,
  },
  {
    id: 3,
    accountName: 'sub_account_003',
    subAccounts: 1,
    balance: 2100.00,
    promotionPlans: 3,
    creativePermission: false,
    fundTransferPermission: true,
    rechargePermission: true,
    accountConflict: '有冲突',
    promotableStores: 8,
  },
  {
    id: 4,
    accountName: 'sub_account_004',
    subAccounts: 0,
    balance: 5000.00,
    promotionPlans: 12,
    creativePermission: true,
    fundTransferPermission: true,
    rechargePermission: true,
    accountConflict: '无冲突',
    promotableStores: 20,
  },
  {
    id: 5,
    accountName: 'sub_account_005',
    subAccounts: 3,
    balance: 2800.75,
    promotionPlans: 6,
    creativePermission: false,
    fundTransferPermission: true,
    rechargePermission: false,
    accountConflict: '无冲突',
    promotableStores: 12,
  },
  {
    id: 6,
    accountName: 'sub_account_006',
    subAccounts: 1,
    balance: 1200.00,
    promotionPlans: 2,
    creativePermission: true,
    fundTransferPermission: false,
    rechargePermission: true,
    accountConflict: '有冲突',
    promotableStores: 5,
  },
])

// 状态管理
const filterType = ref('name')
const searchText = ref('')
const loading = ref(false)
const selectedRowKeys = ref<number[]>([])
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 6,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50'],
  showTotal: (total: number) => `共 ${total} 条`,
})

// 计算已开通账号数
const openedAccountCount = computed(() => {
  return tableData.value.filter(item => item.creativePermission || item.fundTransferPermission || item.rechargePermission).length
})

// 事件处理
const onSearch = () => {
  console.log('搜索:', searchText.value)
  message.info(`搜索: ${searchText.value}`)
}

const handleTableChange = (pag: any, filters: any, sorter: any) => {
  pagination.value = pag
}

const handleBatchDistribute = (key: string) => {
  message.success(`执行了: ${key}`)
}

const handlePermissionRule = () => {
  message.info('打开权限规则设置')
}

const handleBatchSetPermission = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要设置权限的账号')
    return
  }
  message.success(`已为 ${selectedRowKeys.value.length} 个账号批量设置权限`)
}

const handleOpenMore = () => {
  message.info('跳转到开通更多账号页面')
}

const handleMoreAction = (key: string, record: any) => {
  console.log(`执行操作: ${key}, 账号: ${record.accountName}`)
  message.info(`执行了: ${key}`)
}

const handleEditConflict = (record: any) => {
  message.info(`编辑账号 ${record.accountName} 的冲突信息`)
}

const handleBindStore = (record: any) => {
  message.info(`为账号 ${record.accountName} 绑定门店`)
}

const handleUnbindStore = (record: any) => {
  message.info(`为账号 ${record.accountName} 解绑门店`)
}

const onSelectChange = (selectedKeys: number[]) => {
  selectedRowKeys.value = selectedKeys
}
</script>

<style scoped lang="scss">
.sub-account-management {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部导航栏 */
.header {
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .header-left {
    display: flex;
    align-items: center;
    gap: 40px;

    .logo {
      font-size: 16px;
      font-weight: 600;
      color: #1890ff;
      white-space: nowrap;
    }

    .nav-menu {
      display: flex;
      gap: 24px;

      .nav-item {
        color: #666;
        text-decoration: none;
        font-size: 14px;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }

        &.active {
          color: #1890ff;
          border-bottom: 2px solid #1890ff;
          padding-bottom: 20px;
        }
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .account-name {
      color: #666;
      font-size: 14px;
    }

    .logout-btn {
      color: #1890ff;
      text-decoration: none;
      font-size: 14px;

      &:hover {
        color: #40a9ff;
      }
    }
  }
}

/* 主体内容 */
.main-content {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 标题区 */
.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #000;
    margin: 0;
  }

  .title-actions {
    display: flex;
    gap: 12px;

    :deep(.ant-btn) {
      min-width: 120px;
    }
  }
}

/* 提示栏 */
.alert-section {
  margin-bottom: 24px;

  :deep(.ant-alert-action) {
    margin-left: auto;
  }

  .open-more-link {
    color: #1890ff;
    text-decoration: none;

    &:hover {
      color: #40a9ff;
    }
  }
}

  /* 说明文字区 */
  .info-section {
    font-size: 14px;
    font-weight: 600;
    color: #000;
    margin-bottom: 16px;
    padding: 12px 0;
    display: flex;
    align-items: center;
    height: 32px;
    margin-left: 0;
  }

   /* 操作区 */
   .operation-section {
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin-bottom: 24px;
     padding: 12px 0;

     .left-actions {
       display: flex;
       align-items: center;

       :deep(.ant-input-group) {
         display: flex;
         gap: 8px;

         .ant-select {
           min-width: 120px;
         }

         .ant-input-search {
           min-width: 200px;
         }
       }
     }

     .right-actions {
       display: flex;
       align-items: center;
     }
   }

/* 表格区 */
.table-section {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);

  :deep(.ant-table) {
    font-size: 14px;

    .ant-table-thead > tr > th {
      background-color: #fafafa;
      font-weight: 600;
      color: #000;
    }

    .ant-table-tbody > tr > td {
      padding: 12px 16px;
    }

    .ant-table-tbody > tr:hover > td {
      background-color: #f5f5f5;
    }
  }
}

/* 账号名称单元格 */
.account-name-cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  .more-icon {
    cursor: pointer;
    color: #999;
    font-size: 16px;
    transition: color 0.3s;

    &:hover {
      color: #1890ff;
    }
  }
}

/* 余额样式 */
.balance {
  color: #ff4d4f;
  font-weight: 600;
}

/* 冲突单元格 */
.conflict-cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  .edit-icon {
    cursor: pointer;
    color: #999;
    font-size: 14px;
    transition: color 0.3s;

    &:hover {
      color: #1890ff;
    }
  }
}

/* 门店操作 */
.store-operation {
  display: flex;
  gap: 8px;

  :deep(.ant-btn-link) {
    padding: 0;
    height: auto;
    font-size: 12px;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header {
    .header-left {
      gap: 20px;

      .nav-menu {
        gap: 12px;
      }
    }
  }

  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .operation-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0 12px;
    height: 56px;

    .header-left {
      gap: 12px;

      .nav-menu {
        display: none;
      }
    }
  }

  .main-content {
    padding: 12px;
  }

  .title-section {
    .page-title {
      font-size: 18px;
    }
  }
}
</style>
