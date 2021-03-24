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



function InputCheck() {
    if (/ /g.test(ChannelBox.value) == true) {
        AlertPop("Spacing is not allowed in channel name!", 3000);
        let replacement = ChannelBox.value.replace(/ /g, '');
        ChannelBox.value = replacement;
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
      console.log(JSON.stringify(await response.json()));
}