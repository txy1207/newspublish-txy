import { Table,Button,Modal,Tree } from 'antd'
import axios from 'axios';
import React,{useState,useEffect} from 'react'
import { OrderedListOutlined ,DeleteOutlined,ExclamationCircleFilled } from '@ant-design/icons'
const { confirm } = Modal;

export default function RoleList() {
  const [dataSource,setDataSource]=useState([]);
  const [rightList,setRightList]=useState([]);
  const [currentRights,setCurrentRights]=useState([]);
  const [currentId,setCurrentId]=useState([]);
  const [isModalVisible,setIsModalVisible]=useState(false);

  const columns=[
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '权限列表',
     render:(item)=>{  
      return <div>
        <Button danger shape='circle' style={{"marginRight":"2px"}} icon={< DeleteOutlined/>} onClick={()=>showDeleteConfirm(item)}/>
        <Button shape='circle' type="primary" icon={<OrderedListOutlined />} onClick={()=>{
          setIsModalVisible(true)
          setCurrentRights(item.rights)
          setCurrentId(item.id)
        }}/>
      </div>
     } 
    },
  ];
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
  const deleteMethod=(item)=>{
// console.log(item);
setDataSource(dataSource.filter(data=>{
  return data.id!==item.id
}))
axios.delete(`/roles /${item.id}`) 
}
  useEffect(()=>{
axios.get("/roles").then(res=>{
  setDataSource(res.data)
})
  }) 
  useEffect(()=>{
    axios.get("/rights?_embed=children").then(res=>{
      setRightList(res.data)
    })
      })
  const handleCancel=()=>{
    setIsModalVisible(false)
  };
  const handleOk=()=>{
     setIsModalVisible(false);
     setDataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return {
          ...item,
          rights:currentRights
        } 
      }
      return item
     }))
axios.patch(`/roles/${currentId}`,{
  rights:currentRights 
})
  };
  const onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
    setCurrentRights(checkedKeys.checked)
  };
  return (
    <div> 
      <Table rowKey={(item)=>item.id} columns={columns} dataSource={dataSource}>
      </Table>
      <Modal title="权限分配" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Tree
      checkable
      checkedKeys={currentRights}
      onCheck={onCheck}
      checkStrictly={true}
      treeData={rightList}
    />
      </Modal>
      </div>
  ) 
}
 