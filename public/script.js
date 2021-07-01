//const { text } = require("express");

const socket=io('/');
const VideoPanel=document.getElementById('video-panel');
const MyVideo= document.createElement('video');
MyVideo.muted=true;

var peer = new Peer( undefined,{
    path:'/peerjs',
    host:'/',   //localhost or heroku where is it gonna be
    port:'3030'
}); 

let myOwnVideo
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true

}).then(stream =>{
    myOwnVideo=stream;//my stream coming from here i.e the promise
    addVideo(MyVideo,stream);

    peer.on('call',call =>{
        //when user calls us we answer it and add it to the video stream
        call.answer(stream) //enter his(user) call
        const video=document.createElement('video')
        call.on('stream',userVideo =>{
            addVideo(video,userVideo) // add a video stream from him
        })
    })

    socket.on('user-connected',(userId)=>{
        connectToUser(userId,stream);     //user got connected... go to connectuser function 
    })
    let text = $('input')


$('html').keydown((e)=>{
    //13 is key for enter key
    if(e.which==13 && text.val().length!==0){
        socket.emit('message',text.val());
        text.val('')
    }
});

//got the message back - receiving end
socket.on('MsgCreation',message=>{
    console.log(message)
$('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`);
BottomScroll();
})

} )

peer.on('open',id=>{
    socket.emit('join-room', TheRoom_id,id);
})


const connectToUser =(userId,stream)=>{
const call=peer.call(userId,stream) // call user , send him my stream
const video=document.createElement('video');//creating new video element for him
call.on('stream',userVideo =>{ //sending my own stream from here
    addVideo(video,userVideo) //add that video stream
})

}



const addVideo =( video,stream) =>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',() => {
        video.play();

    })
    VideoPanel.append(video);

}

const BottomScroll= () =>{
    let d=$('.master-chat');
    d.scrollTop(d.prop("scrollHeight"));

}

//switch on and off audio
const AudioOnandOff =()=>{
    const enabled=myOwnVideo.getAudioTracks()[0].enabled;
    if(enabled){
        myOwnVideo.getAudioTracks()[0].enabled=false;
        setAudioOn();
    }
    else{
        setAudioOff();
        myOwnVideo.getAudioTracks()[0].enabled=true;
    }
}

const setAudioOff=()=>{
    const html=` 
    <i class="fas fa-microphone"></i>
    <span>MUTE</span>`
    document.querySelector('.mute').innerHTML=html;

}

const setAudioOn=()=>{
    const html=`
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.mute').innerHTML=html;
}

//switch video on and off
const VideoOnandOff=()=>{
    let enabled=myOwnVideo.getVideoTracks()[0].enabled;
    if(enabled){
        myOwnVideo.getVideoTracks()[0].enabled=false;
        setVideoOn();
    }
    else{
        setVideoOff();
        myOwnVideo.getVideoTracks()[0].enabled=true;
    }

}

const setVideoOff=()=>{
    const html=`
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector('.videobutton').innerHTML=html;
}
const setVideoOn=()=>{
    const html=`
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.querySelector('.videobutton').innerHTML=html;
}

//.