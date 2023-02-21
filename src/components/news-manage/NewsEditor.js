import React, { useState,useEffect } from 'react'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import draftToHtml from 'draftjs-to-html';//需要安装
import htmlToDraft from 'html-to-draftjs';//反转
import { convertToRaw, EditorState, ContentState} from 'draft-js';
export default function NewsEditor(props) {
useEffect(() => {
//  console.log(props.content);
const html=props.content
if(html===undefined) return
const contentBlock=htmlToDraft(html)
if(contentBlock){
  const contentState=ContentState.createFromBlockArray(contentBlock.contentBlocks);
  const editorState=EditorState.createWithContent(contentState)
setEditorState(editorState)
}
}, [props.content])


   const [editorState,setEditorState]=useState("")
  return (
    <div> 
    <Editor
    editorState={editorState}
    toolbarClassName="toolbarClassName"//2
    wrapperClassName="wrapperClassName"//3
    editorClassName="editorClassName"//4 
    onEditorStateChange={(editorState)=>
    setEditorState(editorState)
    }
    onBlur={()=>{
        props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    }}
  />
  </div>
  )
}
