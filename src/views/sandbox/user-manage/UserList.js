
import React, { useEffect, useState, useRef } from 'react'
import { Button, Table, Modal, Switch } from 'antd'
import UserForm from '../../../components/user-manage/UserForm';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import axios from 'axios';
const { confirm } = Modal;
export default function UserList() {
  const [dataSource, setDataSource] = useState([]);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [isUpdateVisible, setisUpdateVisible] = useState(false);
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [current, setcurrent] = useState(null)
  const addForm = useRef(null);
  const updateForm = useRef(null);


  const {roleId,region,username}=JSON.parse(localStorage.getItem("token"));
  
  useEffect(() => {
    const roleObj={
      "1":"superadmin",
      "2":"admin",
      "3":"editor"
    }
    axios.get("/users?_expand=role").then(res => {
      const list=res.data
    setDataSource(roleObj[roleId]==="superadmin"?list:[
      ...list.filter(item=>item.username===username),
      ...list.filter(item=>item.region===region&&roleObj[item.roleId]==="editor")

    ])
    })
  }, [roleId,region,username,]);
  useEffect(() => {
    axios.get("/roles").then(res => {
      setRoleList(res.data)
    })
  }, []);
  useEffect(() => {
    axios.get("/regions").then(res => {
      setRegionList(res.data)
    })
  }, []);
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters:[...regionList.map(item=>{
        return {
          text:item.title,
          value:item.value
        } 
      }),
      {
        text:"全球",
        value:"全球"
      }
    ],
    onFilter:(value,item)=>{
      if(value==="全球"){
        return item.region===""
      }else{
        return item.region===value
      }
       
    },
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}> </Switch>

      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape='circle' style={{ "marginRight": "2px" }} icon={< DeleteOutlined />} disabled={item.default} onClick={() => showDeleteConfirm(item)} />
          <Button shape='circle' type="primary" icon={< EditOutlined />} disabled={item.default} onClick={()=>handleUpdate(item)}/>
        </div>
      }
    },
  ];



const handleUpdate=(item)=>{
setTimeout(() => {
if(item.roleId===1){
setisUpdateDisabled(true)
}else{
setisUpdateDisabled(false)
}
updateForm.current.setFieldsValue(item) 
}, 0 )
setcurrent(item)
setisUpdateVisible(true);

}


  const handleChange = (item) => {
    console.log(item);
item.roleState=!item.roleState;
setDataSource([...dataSource]);
axios.patch(`/users/${item.id}`,{
  roleState:item.roleState
})
  }



  const showDeleteConfirm = (item) => {
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        // console.log('确定');
        deleteMethod(item);
      },
      onCancel() {
        // console.log('取消');
      },
    });
  };



  const deleteMethod = (item) => {
    // console.log(item);
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }



  const addFormOk = () => {
    // console.log(addForm);
    addForm.current.validateFields().then(value => {
      // console.log(res);
      setIsAddVisible(false);
      addForm.current.resetFields()
      // post到后端，生成Id,在设置datasource,方便后面的删除和更新
      axios.post(`/users`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        console.log(res.data);
        setDataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        }])
      })
    }).catch(err => {
      console.log(err);
    })
  }

  const updateFormOk=()=>{
    updateForm.current.validateFields().then(value => {
      console.log(value);
      setisUpdateVisible(false)
setDataSource(dataSource.map(item=>{
  if(item.id===current.id){
    return {
      ...item,
      ...value,
      role: roleList.filter(data => data.id === value.roleId)[0]
    }
  }
  return item
}))
setisUpdateDisabled(!isUpdateDisabled)
 axios.patch(`/users/${current.id}`,value)
    }).catch(err => {
      console.log(err);
    })
  }
  return (
    <div>
      <Button type='primary' onClick={() => {
        setIsAddVisible(true)
      }}>添加用户</Button>
      <Table columns={columns} dataSource={dataSource} rowKey={item => item.id} pagination={{
        pageSize: 5
      }} />
      <Modal
        open={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={
          () => {
            setIsAddVisible(false)
            addForm.current.resetFields()
          }
        }
        onOk={() => addFormOk()}
      >
        <UserForm ref={addForm} regionList={regionList} roleList={roleList} />
      </Modal>
      <Modal
        open={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={
          () => {
            setisUpdateVisible(false)
          }
        }
        onOk={() => updateFormOk()}
      >
        <UserForm ref={updateForm} regionList={regionList} roleList={roleList} isUpdateDisabled={isUpdateDisabled} isUpdate={true}/>
      </Modal>
    </div>
  )
}
