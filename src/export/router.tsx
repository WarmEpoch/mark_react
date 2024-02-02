import { Navigate, Link, createHashRouter, RouteObject } from 'react-router-dom'
import { ComponentType, lazy } from 'react'
import App from '../App'

const pageTsx = import.meta.glob('../views/**')

const routesConfig = [
  {
    path: '/mi',
    name: '小米徕卡',
    setting: {
      border: 0,
      shadow: 0,
    }
  }, {
    path: '/frame',
    name: '极简单一',
    setting: {
      border: 0,
      shadow: 0,
    }
  }, {
    path: '/jamb',
    name: '边框简字',
    setting: {
      border: 3,
      shadow: 0,
    }
  }, {
    path: '/flag',
    name: '边框标志',
    setting: {
      border: 4,
      shadow: 0,
    }
  }, {
    path: '/gins',
    name: '边框简参',
    setting: {
      border: 3,
      shadow: 0,
    }
  }, {
    path: '/centre',
    name: '中心拍摄',
    setting: {
      border: 0,
      shadow: 0,
    }
  }, {
    path: '/morn',
    name: '杨晨风格',
    setting: {
      border: 4,
      shadow: 0,
    }
  }, {
    path: '/xmage',
    name: '华为影像',
    setting: {
      border: 0,
      shadow: 0,
    }
  }
]

const routesItems = Object.entries(pageTsx).map(([path]) => {
  const key = path.replace('../views', '').replace('.tsx', '').toLowerCase()
  const name = routesConfig.find(i => i.path === key)?.name || '敬请期待'
  return {
    key,
    name,
    label: <Link to={key} replace>{name}</Link>,
  }
})

const subRoutes: RouteObject[] = Object.entries(pageTsx).map(([path, tsx]) => {
  const url = path.replace('../views/', '').replace('.tsx', '').toLowerCase()
  const El = lazy(tsx as () => Promise<{
    default: ComponentType;
  }>)
  return {
    path: url,
    element: <El />,
  }
})

// const router = createBrowserRouter([
const router = createHashRouter([
  {
    path: "/",
    element: <Navigate to="mi" replace />,
  },
  {
    path: "/",
    element: <App />,
    children: subRoutes,
  },
]);

export { router, routesItems, routesConfig }