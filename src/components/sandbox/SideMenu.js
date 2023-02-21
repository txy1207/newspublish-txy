import React,{useEffect, useState} from 'react'
import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
import {Layout,Menu} from 'antd'
import './index.css'
import { withRouter } from 'react-router-dom';
import SubMenu from 'antd/lib/menu/SubMenu';
import axios from 'axios';
import { connect } from 'react-redux';
const { Sider } = Layout;
//模拟数组结构
// const menuList=[
//     {
//       key: '/home',
//       icon: <UserOutlined />,
//       label: '首页',
//     },  
//     {
//       key: '/user-manage',
//       icon: <VideoCameraOutlined />,
//       label: '用户管理',
//       children: [{ label: '用户列表',key: 'user-manage/list' }],
//     },
//     {
//       key: '/right-manage',
//       icon: <UploadOutlined />,
//       label: '权限管理',
//       children: [{ label: '角色列表',key: '/right-manage/role/list' },
//         { label: '权限列表', key: '/right-manage/right/list' }],
//     },
//   ];
const iconList={
  "/home":<UserOutlined />,
  "/user-manage/list":<UserOutlined />,
  "/user-manage":<UserOutlined />,
  "/right-manage/right/list": <VideoCameraOutlined />,
  "/right-manage/role/list":<UploadOutlined />,
}
function SideMenu(props) {
  //获取侧边栏动态数据
  const [menu,setMenu]=useState([]);
  useEffect(()=>{
axios.get("/rights?_embed=children").then((res)=>{
  setMenu(res.data)
})
  },[])
  // 判断列表项是否有权限出现在侧边栏
  const {role:{rights}}=JSON.parse(localStorage.getItem("token"))
const checkPagePermission=(item)=>{
return item.pagepermisson && rights.includes(item.key) 
  };
    // 自己封装函数遍历列表项，Menu中的items属性有此功能 
const renderMenu=(menuList)=>{
    return menuList.map(item=>{
        if(item.children?.length>0 && checkPagePermission(item)){
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
            {renderMenu(item.children)}
        </SubMenu>
    }
    return checkPagePermission(item)&&<Menu.Item key={item.key} icon={iconList[item.key]} onClick={()=>{
        props.history.push(item.key)
    }}>{item.title}</Menu.Item>
})
}
//被选中项刷新后也会高亮
const selectKeys=[props.location.pathname];
const openkeys = ["/"+props.location.pathname.split("/")[1]]
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
    <div style={{display:"flex",height:"100%",flexDirection:"column"}}>
    <div className="logo" >全球新闻发布管理系统</div>
   <div style={{flex:1,overflow:"auto"}}>
   <Menu
      theme="dark"
      mode="inline"
      selectedKeys={selectKeys}
      defaultOpenKeys={openkeys}
    //   items={menuList}
   >
    {renderMenu(menu)}
   
   </Menu>
   </div>
    </div>
   
  </Sider>
  )
}

const mapStateToProps=({CollapsedReducer:{isCollapsed}})=>{
  return {
isCollapsed,
  }
}

export default connect(mapStateToProps)(withRouter(SideMenu))
