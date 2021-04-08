let ChannelBox = document.getElementById('chanl');
let UsernameBox = document.getElementById('user');
let MessageBox = document.getElementById('message-box-input');
let SendBtn = document.getElementById("SendButton");
let AlertBox = document.getElementById('Alert-box');
let AlertBoxText = document.getElementById('Alert-box-text');
let AlertBoxTextDes = document.getElementById('Alert-box-text-des');
let ChatScreen = document.getElementById("chat-screen");
let LoginScreen = document.getElementById("main");
let LeaveBtn = document.getElementById("leave-btn");
let Connected = false;
const IndexLoad = true;
let InChat = false;

function ActionRun(ClientActionObj){
    //foreach action in ClientAction object
    Object.keys(ClientActionObj).forEach(action => {
        //JavaScript action has different execution
        if (action == 'JavaScript') {
            eval(ClientActionObj[action]);
        }
        else{
            //Executes function with given params (array)
            eval(action).apply(this,ClientActionObj[action]);
        }
    });
}

function ClearInputs() {
    ChannelBox.value = "";
    UsernameBox.value = "";
    MessageBox.value = "";
}

async function PageTransform() {
    if (InChat == false) {
        LoginScreen.style.display = "none";
        setTimeout(() => {
            LoginScreen.style.opacity = "0";
        }, 250);
        ChatScreen.style.display = "block";
        setTimeout(() => {
            ChatScreen.style.opacity = "1";
        }, 250);
        InChat = true;
        LeaveBtn.addEventListener('click',() => SendData('Leave'));
    } else {
        ChatScreen.style.display = "none";
        setTimeout(() => {
            ChatScreen.style.opacity = "0";
        }, 250);
        
        LoginScreen.style.display = "block";
        setTimeout(() => {
            LoginScreen.style.opacity = "1";
        }, 250);
        InChat = false;
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

async function WSConnect(wspath) {
    const socket = new WebSocket(wspath);
    socket.onerror = () =>{
        console.log("%c Cannot connect to chating server! %c 👷‍♂️","border-radius: 5px; background: #f75e5e; font-weight: bold; color: white; font-size: 30px;","font-size: 35px");
        AlertPop("Error!","Cannot connect to chating server!",4500);
        if (Connected) {
            Connected = false;
        }
    }
    socket.onopen = () =>{
        Connected = true;
        console.log("%c Connection established! %c 🤝","border-radius: 5px; background: #55D9B1; font-weight: bold; color: white; font-size: 30px;","font-size: 30px");
    };
    SendBtn.onclick = () => {
        socket.send(JSON.stringify({
            message:MessageBox.value,
            ChannelID: ChannelID,
            stage:2
        }));
    }
    socket.onmessage = msg => {
        const msgObj = JSON.parse(msg.data); 
        switch (msgObj.stage) {
            case 0:
                socket.send(JSON.stringify({
                    Username: Username,
                    ChannelID: ChannelID,
                    stage: 0
                }));
                break;
            case 1:
                AlertPop("Connecting!",`Connected to ${ChannelID} as ${Username}`,4500);
                PageTransform();
                ClearInputs();
                break;
            case 2:
                //Display message on site
                console.log("Message:",msgObj.message);
                break;
            case 3:
                console.log("%c Server responded with error! %c 🤦‍♂️","border-radius: 5px; background: #f75e5e; font-weight: bold; color: white; font-size: 30px;","font-size: 35px");
                console.log("%c Error ➜ ","background:#3689ff; font-weight: bold; color: white; font-size: 15px; border-radius: 2px;",msgObj.message);
                AlertPop("Cannot connect!","Server responded with error.");
                socket.close();
                break;
            default:
                console.log("%c Invalid server response! %c 🤷‍♂️","border-radius: 5px; background: #f75e5e; font-weight: bold; color: white; font-size: 30px;","font-size: 35px")
                break;
        }
    }
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
            const ServerUsername = ServerResponse.Username;
            globalThis.ServerUsername;
            const ServerChannelID = ServerResponse.ChannelID;
            globalThis.ServerChannelID;
            if(ServerResponse.ClientAction != false){
                ActionRun(ServerResponse.ClientAction);
            }
        }
    }
}

async function SendData(action) {
    globalThis.Username = UsernameBox.value;
    globalThis.ChannelID = ChannelBox.value;
    if (action == 'Join') {
        event.preventDefault();
        const response = await fetch('/Join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Username: Username,
                ChannelID: ChannelID
            })
        });
        ResponseHandler(await response.json())
    }else if(action == 'Leave'){
        event.preventDefault();
        const response = await fetch('/Leave', {
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
    }
}