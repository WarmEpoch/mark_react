import { Navigate, Link, RouteObject, createBrowserRouter, createHashRouter } from 'react-router-dom'
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
      color: '#ffffff'
    }
  }, {
    path: '/frame',
    name: '极简单一',
    setting: {
      border: 0,
      shadow: 0,
      color: '#ffffff'
    }
  }, {
    path: '/jamb',
    name: '边框简字',
    setting: {
      border: 3,
      shadow: 0,
      color: '#ffffff'
    }
  }, {
    path: '/flag',
    name: '边框标志',
    setting: {
      border: 4,
      shadow: 0,
      color: '#ffffff'
    }
  }, {
    path: '/gins',
    name: '边框简参',
    setting: {
      border: 3,
      shadow: 0,
      color: '#ffffff'
    }
  }, {
    path: '/centre',
    name: '中心拍摄',
    setting: {
      border: 0,
      shadow: 0,
      color: '#ffffff'
    }
  }, {
    path: '/morn',
    name: '杨晨风格',
    setting: {
      border: 4,
      shadow: 0,
      color: '#ffffff'
    }
  }, {
    path: '/xmage',
    name: '华为影像',
    setting: {
      border: 0,
      shadow: 0,
      color: '#ffffff'
    }
  },{
    path: '/loong',
    name: '龙行龘龘',
    setting: {
      border: 0,
      shadow: 0,
      color: '#ae1a11'
    }
  },
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

const createRouter = import.meta.env.MODE == 'app' ? createHashRouter : createBrowserRouter
const router = createRouter([
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