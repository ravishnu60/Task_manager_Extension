getwords();
const words = []
const date =new Date().toLocaleDateString();
document.getElementById('date').innerHTML = new Date().toLocaleDateString();
//listening for changes
document.getElementById('name')?.addEventListener('change', () => {
    let newword = document.getElementById('name').value;

    //Create notification
    var notifOptions = {
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'Seems there',
        message: "The task " + newword + " already in the list"
    }
    if (words.some(word => newword === word)) {
        chrome.notifications.create('errormsg', notifOptions)
    } else {
        //set new value
        words.push(newword);
        chrome.storage.sync.get('words', function (text) {
            chrome.storage.sync.set({ 'words': {...text.words,[date]:words} });
        })
        addElement(newword, words.length)
        count(words.length)

    }
    //make input field empty
    document.getElementById('name').value = '';


})

function assignNew(key,data){
    let chromeData;
    chrome.storage.sync.get('words', function (text) {
        text.words[key]=data;
        chromeData = text.words
    })
}

//get data from chrome storage
function getwords() {
    chrome.storage.sync.get('words', function (text) {
        if (text.words[date] && text.words[date]?.length !== 0) {
            count(text.words[date].length)
            text.words[date].forEach((word, index) => {
                words.push(word)
                addElement(word, index + 1)
            })
        }
        else {
            count(0);
        }
    })
}

//Create button
function createBtn(parent, name, eclass, etitle, index) {
    const btn = document.createElement("button");
    btn.innerHTML = name;
    btn.className = eclass;
    btn.title = etitle;
    btn.id = name;
    parent.appendChild(btn)
}

//Add elements with value
function addElement(value, index) {
    const parent = document.getElementById('display');
    //Add name in h4 element
    const para = document.createElement("h4");
    const text = document.createTextNode(`${index}. ${value} `);
    para.appendChild(text);
    // createBtn(para, '?', 'edit', 'Edit', index);
    // createBtn(para, 'X', 'delete', 'Remove', index);
    parent.appendChild(para);
}

//display count
function count(counts) {
    if (counts == 0) {
        document.getElementById('show').classList.add('hide');
    } else {
        document.getElementById('show').classList.remove('hide');
    }
    chrome.action.setBadgeText({ "text": String(counts) });
    document.getElementById('count').innerHTML = "Total Task : " + counts;
}

//Reset current day task
document.getElementById('resetcurr').addEventListener('click', () => {
    const pop = confirm("Are you sure to clear today's task ?");

    if (pop.valueOf()) {
        chrome.storage.sync.get('words', function (text) {
            if (text.words[date] && text.words[date]?.length !== 0) {
                delete text.words[date];
                chrome.storage.sync.set({ 'words': {...text.words}});
                window.location.reload();
            }
        })
       
    }

})