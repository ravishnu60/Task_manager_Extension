//Clear all data
document.getElementById('resetall').addEventListener('click', () => {
    const pop = confirm('Are you sure you want to reset ?');

    if (pop.valueOf()) {
        chrome.storage.sync.set({ 'words': {} });
        window.location.reload();
    }

})

getwords();
const words = []
const date = new Date().toLocaleDateString();
var overAll = { days: 0, task: 0 }
//get data from chrome storage
function getwords() {
    chrome.storage.sync.get('words', function (text) {
        if (Object.keys(text.words)?.length !== 0) {
            overAll.days = Object.keys(text.words)?.length;
            Object.keys(text.words).forEach((data, index) => {
                addElement(data, null, "h3")
                text.words[data].forEach((word, index) => {
                    words.push(word);
                    addElement(word, index + 1, "h4");
                    overAll.task += 1;
                    count(text.words[data].length);

                })
            });
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
function addElement(value, index, tag) {
    const parent = document.getElementById('display');
    //Add name in h4 element
    const para = document.createElement(tag);
    const text = document.createTextNode(`${index == null ? '' : index + ' .'} ${value} `);
    para.appendChild(text);
    // if (index == null) {
    //     createBtn(para, 'X', 'delete', 'Remove', index);
    // } else {
    //     createBtn(para, '?', 'edit', 'Edit', index);
    //     createBtn(para, 'X', 'delete', 'Remove', index);
    // }
    parent.appendChild(para);
}

//display count
function count(count) {
    if (overAll.days == 0) {
        document.getElementById('show').classList.add('hide');
    } else {
        document.getElementById('show').classList.remove('hide');
    }
    document.getElementById('count').innerHTML = "Total days : " + overAll.days +", Total Task : " + overAll.task;
}