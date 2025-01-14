async function save(num) {
    let inputs, index;
    let input = {};

    inputs = document.getElementsByTagName('input');
    for (index = 0; index < inputs.length; ++index) {
        if(inputs[index].getAttribute('id') != null){
            input[inputs[index].getAttribute('id')] = inputs[index].value;
        }
    }
    selects = document.getElementsByTagName('select');
    for (index = 0; index < selects.length; ++index) {
        if(selects[index].id != null) {
            input[selects[index].id] = selects[index].value;
        }
    }

    await fetch(window.location.origin + "/save_itr"+num, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input)
    })
        /* .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error)
        })*/;
    /*var xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin + "/save_itr"+num, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(input));*/
}

async function restore(num) {
    let list = await getData(num);
    for (const [key, value] of Object.entries(list)) {
        try {
            document.getElementById(key).value = value;
        } catch (e) {
            console.log(e)
        }
    }
}

async function getData(num) {
    /*// send xlr
    var xhr = new XMLHttpRequest();
    let data;
    xhr.open("GET", window.location.origin + "/get_itr"+num);
    xhr.send();
    xhr.onload = function() {
                if (xhr.status === 200) {
                    console.log(JSON.parse(xhr.responseText));
                    data = JSON.parse(xhr.responseText);
                    return data;
                }
            }
    console.log(data);
    return data;*/
    let data;
    await fetch(window.location.origin + "/get_itr"+num)
        .then((response) => response.json())
        .then((json) => data = json)
        .catch((error) => {
            console.error('Error:', error)
        });
    return data
}

async function next_page(num) {
    await save(num)
    //await new Promise(r => setTimeout(() => r(), 2000));
    window.location.href = window.location.origin + "/itr"+(num+1);
}
async function previous_page(num) {
    await save(num)
    //await new Promise(r => setTimeout(() => r(), 2000));
    window.location.href = window.location.origin + "/itr"+(num-1);
}
async function save_and_exit(num) {
    await save(num)
    //await new Promise(r => setTimeout(() => r(), 2000));
    window.location.href = window.location.origin + "/admin";
}
async function save_and_exit_client(num) {
    await save(num)
    //await new Promise(r => setTimeout(() => r(), 2000));
    window.location.href = window.location.origin + "/client";
}
async function couch_page(num) {
    await save(num)
    //await new Promise(r => setTimeout(() => r(), 2000));
    window.location.href = window.location.origin + "/couch";
}

