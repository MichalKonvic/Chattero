let ChannelBox = document.getElementById('chanl');
let UsernameBox = document.getElementById('user');
let AlertBox = document.getElementById('Alert-box');
let AlertBoxText = document.getElementById('Alert-box-text');
let AlertBoxTextDes = document.getElementById('Alert-box-text-des');
let ChatScreen = document.getElementById("chat-screen");
let LoginScreen = document.getElementById("main");
let LeaveBtn = document.getElementById("leave-btn");
let Connected = false;
const IndexLoad = true;
let InChat = false;

function LeaveRoom() {
    PageTransform();
    //Inchat false must be after bcs PageTransform use this variable to idetification
    InChat = false;
}

async function PageTransform() {
    console.log("PageTransform triggered");
    if (InChat == false) {
        console.log("true :",InChat);
        LoginScreen.style.display = "none";
        setTimeout(() => {
            LoginScreen.style.opacity = "0";
        }, 250);
        ChatScreen.style.display = "block";
        setTimeout(() => {
            ChatScreen.style.opacity = "1";
        }, 250);
        InChat = true;
        LeaveBtn.addEventListener('click',LeaveRoom);
    } else {
        console.log("false :",InChat);
        ChatScreen.style.display = "none";
        setTimeout(() => {
            ChatScreen.style.opacity = "0";
        }, 250);
        
        LoginScreen.style.display = "block";
        setTimeout(() => {
            LoginScreen.style.opacity = "1";
        }, 250);
    }
}




async function AlertPop(content="",desc="",poptime = 3000) {
    if (content.length > 40 ) {
        console.log("%c Alert message is too large! %c 👷‍♂️","border-radius: 5px; background: #f75e5e; font-weight: bold; color: white; font-size: 30px;","font-size: 35px");
        console.log("%c Message moved here ➜ ","background:#3689ff; font-weight: bold; color: white; font-size: 15px; border-radius: 2px;", content,);
        console.log("%c Description moved here ➜ ","background:#3689ff; font-weight: bold; color: white; font-size: 15px; border-radius: 2px;",desc);
    }else if(desc.length > 40){
        console.log("%c Alert description is too large! %c 👷‍♂️","border-radius: 5px; background: #f75e5e; font-weight: bold; color: white; font-size: 30px;","font-size: 35px");
        console.log("%c Message moved here ➜ ","background:#3689ff; font-weight: bold; color: white; font-size: 15px; border-radius: 2px;", content,);
        console.log("%c Description moved here ➜ ","background:#3689ff; font-weight: bold; color: white; font-size: 15px; border-radius: 2px;",desc);
    } else {
        AlertBox.style.opacity = '1';
        AlertBox.style.top = '50px';
        AlertBoxText.innerText = content;
        AlertBoxTextDes.innerText = desc;
        setTimeout(() => {
            AlertBox.style.top = '-10%';
        }, poptime);
    }
}

function ActionRun(ClientActionObj){
    //foreach action in ClientAction object
    Object.keys(ClientActionObj).forEach(action => {
        //Executes function with given params (array)
        eval(action).apply(this,ClientActionObj[action]);
    });
}

function ResponseHandler(ServerResponse) {
    if (ServerResponse['Error'] != false) {
        try {
            if (ServerResponse.Error.ClientAction != false) {
                ActionRun(ServerResponse.Error.ClientAction);
            }
        } catch (error) {
            console.log("%c Looks like something bad happend! %c 👷‍♂️","border-radius: 10px; background: #f75e5e; font-weight: bold; color: white; font-size: 50px;","font-size: 50px");
        }
    }else{
        if (ServerResponse.code == 0) {
            if(ServerResponse.ClientAction != false){
                ActionRun(ServerResponse.ClientAction);
            }
        }
    }
}

async function SendFormData() {
    if (InChat == false) {
        event.preventDefault();
        const response = await fetch('/Join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Username: UsernameBox.value,
                ChannelID: ChannelBox.value
            })
        });
        ResponseHandler(await response.json())
    } else {
        AlertPop("You are already in channel!", 4000);
    }
}