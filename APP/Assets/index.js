//Variables
let ChannelBox = document.getElementById('chanl');
let UsernameBox = document.getElementById('user');
let AlertBox = document.getElementById('Alert-box');
let AlertBoxText = document.getElementById('Alert-box-text');
let IndexLoad = true;

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

async function SendData() {
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
}