import React from 'react'
import { Layout, Dropdown,Avatar } from 'antd';
import { withRouter} from 'react-router-dom'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';

import { connect } from 'react-redux';
const { Header } = Layout;
function TopHeader(props) {
    console.log(props);
    // const [collapsed, setCollapsed] = useState(false);
    const changeCollapsed = () => {
      props.changeCollapsed()
    }
   
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))
    // const history = useHistory();
    // const location = useLocation();
    const items=[
                {
                    key: '1',
                    label:roleName
                },

                {
                    key: '2',
                    danger: true,
                    label: '退出',
                    onClick:()=>{
                    localStorage.removeItem("token")
                    props.history.replace("/login")
                    }
                },
        ]
    return (
       
        <Header
            className="site-layout-background"
            style={{
                padding: '0 16px',
            }}
        >
            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> :
                    <MenuFoldOutlined onClick={changeCollapsed} />
            }
            <div style={{ float: "right" }}>
                <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span>
                <Dropdown menu={{items}}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div> 

        </Header> 
      
    )
}
// connect(
// mapStateToProps this.XXX
// mapDispatchToProps 

// )(被包装的组件)
const mapStateToProps=({CollapsedReducer:{isCollapsed}})=>{
    return {
isCollapsed,
    }
}
const mapDispatchToProps={
  changeCollapsed(){
return {
    type:"change_collapsed",

}
  }  
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))