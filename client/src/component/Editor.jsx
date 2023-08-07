

import { useEffect ,useState} from "react";

import { Box } from "@mui/material";
import 'quill/dist/quill.snow.css';

import styled from "@emotion/styled";

import {io} from 'socket.io-client'


import Quill from 'quill';

import { useParams } from "react-router";











const Component = styled.div`
    background:#f5f5f5;    
`


const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];





const Editor =()=>{


    const [socket,setSocket] = useState();
    const [quill,setQuill] = useState();

    const {id} = useParams();




        useEffect(()=>{
            const quillserver = new Quill('#container',{theme:'snow',modules:{toolbar:toolbarOptions}})
            quillserver.disable();
            quillserver.setText('loading the doc')
            setQuill(quillserver)

        },[])

        useEffect(()=>{
            const socketserver = io('http://localhost:9000');

            setSocket(socketserver)

            return ()=> {
                socketserver.disconnect();
            }
        },[])

        useEffect(()=>{

            if(socket=== null|| quill===null)return;


            const handlechange =(delta,oldData,source)=>{

                if(source !=='user')return ;

               socket&& socket.emit('send-changes',delta);
            }



           quill &&  quill.on('text-change',handlechange);

                return ()=> {
                    quill&& quill.off('text-change',handlechange );   
                }

            },[quill,socket])



            useEffect(()=>{

                if(socket=== null|| quill===null)return;
    
    
                const handlechange =(delta)=>{
                   quill.updateContents(delta)
                }
    
    
    
               socket &&  socket.on('receive-changes',handlechange);
    
                    return ()=> {
                        socket&& socket.off('receive-changes',handlechange );   
                    }
    
                },[quill,socket])
    

                useEffect(()=>{
                    if(quill===null||socket===null)return ;

                    socket&& socket.once('load-document',document=>{

                        quill && quill.setContents(document);
                        quill&& quill.enable();
                    })

                    socket&&socket.emit('get-document',id);

                },[quill,socket,id])


    return (

        <Component>

                 <Box className='container' id='container'> </Box>
        </Component>
    )
}

export default Editor;