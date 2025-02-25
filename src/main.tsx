import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { router } from "./export/router"
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

const theme = {
  token: {
    colorPrimary: '#395260',
  },
}


createRoot(document.getElementById('root') as HTMLElement).render(
    <ConfigProvider locale={zhCN} theme={theme}>
        <RouterProvider router={router} />
    </ConfigProvider>
)
