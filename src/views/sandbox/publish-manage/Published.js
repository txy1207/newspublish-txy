import usePublish from '../../../components/publish-manage/usePublish'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import { Button } from 'antd'

export default function Published() {
  const {dataSource,handleSunset}=usePublish(2)
  return (
    <div>
      <NewsPublish dataSource={dataSource}  button={(id)=><Button  onClick={()=>handleSunset(id)} danger>下线</Button>}></NewsPublish>
    </div>
  )
}
