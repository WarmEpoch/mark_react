import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { router } from "./export/router"
import { Provider } from "react-redux";
import { store } from "./export/store";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
// import VConsole from 'vconsole';
// new VConsole();

const theme = {
  token: {
    colorPrimary: '#395260',
  },
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider locale={ zhCN } theme={ theme }>
    <Provider store={store}>
      <RouterProvider router={ router } />
    </Provider>
  </ConfigProvider>
)
