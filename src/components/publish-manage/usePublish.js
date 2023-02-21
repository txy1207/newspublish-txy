
import { useEffect, useState } from 'react'
import {notification} from 'antd'
import axios from 'axios'
function usePublish(type) {
  const [dataSource, setdataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
      setdataSource(res.data)
    })
  }, [username, type])
  const handlePublish = (id) => {
    setdataSource(dataSource.filter(item => item.id !== id))
    axios.patch(`/news/${id}`, {
      "publishState": 2,
      "publishTime":Date.now()
  }).then(() => {
      notification.info({
          message: `通知`,
          description:
              `您可以到发布管理/已经发布中查看您的新闻`,
          placement: "bottomRight",
      })
  })
  }
  const handleSunset = (id) => {
    setdataSource(dataSource.filter(item => item.id !== id))
    axios.patch(`/news/${id}`, {
      "publishState": 3,
      "publishTime":Date.now()
  }).then(() => {
      notification.info({
          message: `通知`,
          description:
              `您可以到【发布管理/已下线】中查看您的新闻`,
          placement: "bottomRight",
      })
  })
  }
  const handleDelete = (id) => {
    setdataSource(dataSource.filter(item => item.id !== id))
    axios.delete(`/news/${id}`)
 .then(() => {
      notification.info({
          message: `通知`,
          description:
              `您已经删除了已下线的新闻`,
          placement: "bottomRight",
      })
  }) 
  }
  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete
  }
}
export default usePublish;