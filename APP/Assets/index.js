//Variables
let ChannelBox = document.getElementById('chanl');
let UsernameBox = document.getElementById('user');
let AlertBox = document.getElementById('Alert-box');
let AlertBoxText = document.getElementById('Alert-box-text');
let Main = document.getElementById('main');
let MainForm = document.getElementById('main-form');
let ContinueBtn = document.getElementById('continue-btn');
let SendBtn = document.getElementById("SendButton");
let LeaveBtn = document.getElementById("leave-btn");
let IndexLoad = true;
let Connected = false;
let InChat = false;

async function PageTransform() {
    if (InChat == false) {
        ChannelBox.id = "MsgEdit";
        ChannelBox = document.getElementById("MsgEdit");
        ContinueBtn.style.transition = "0.3s";
        ContinueBtn.style.display = "none";
        ContinueBtn.style.opacity = "0";
        ContinueBtn.disabled = 'true';
    
        UsernameBox.style.transition = "0.3s";
        UsernameBox.style.opacity = "0";
        UsernameBox.style.display = "none";
        UsernameBox.style.margin = "0px";
    
        ChannelBox.style.transition = "0.3s";
        ChannelBox.placeholder = "";
        ChannelBox.style.textAlign = "left";
        ChannelBox.style.border = "none";
        ChannelBox.style.margin = "0px";
        ChannelBox.style.height = "40px";
        setTimeout(() => {
            Main.style.transition = "0.3s";
            MainForm.style.margin = "4px 10px 5px 10px";
            Main.style.height = "60px";
        }, 400);
        setTimeout(() => {
            MainForm.style.flexDirection = 'row';
            MainForm.style.maxWidth = "none";
            Main.style.top = "93%";
            SendBtn.style.display = "block";
            SendBtn.style.marginLeft = "-40px";
            
        }, 800);
        setTimeout(() => {
            Main.style.transition = "0.5s";
            MainForm.style.transition = "0.4s";
            Main.style.maxWidth = "99%";
        }, 1250);
        setTimeout(() => {
            LeaveBtn.style.display = 'block';
            LeaveBtn.disabled = 'false';
            LeaveBtn.style.opacity = '1';
        }, 1500);
        InChat = true;
    } else {
        
    }
}




async function AlertPop(content,poptime = 3000) {
    AlertBox.style.opacity = '1';
    AlertBox.style.top = '50px';
    AlertBoxText.innerText = content;
    setTimeout(() => {
        AlertBox.style.top = '-10%';
    }, poptime);
}

function ResponseHandler(ServerResponse) {
    if (ServerResponse['Error'] != false) {
        try {
            if (ServerResponse.Error.ClientAction != false) {
                //foreach action given by serever
                Object.keys(ServerResponse.Error.ClientAction).forEach(action => {
                    //Runs action with given arguments
                    eval(action).apply(this,ServerResponse.Error.ClientAction[action]);
                });
            }
        } catch (error) {
            console.log("%c Looks like something bad happend! %c 👷‍♂️","border-radius: 10px; background: #f75e5e; font-weight: bold; color: white; font-size: 50px;","font-size: 50px");
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
    PageTransform();
}