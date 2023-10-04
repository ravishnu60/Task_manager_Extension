const date= new Date().toLocaleDateString()
var item = {
    "id": "selnewword123",
    "title": "Add this word",
    "contexts": ["selection"]
};
chrome.contextMenus.create(item)
//Add selected text
chrome.contextMenus.onClicked.addListener(function (clickedData) {
    let newone = clickedData.selectionText
    let words = []
    if (clickedData.menuItemId == 'selnewword123' && newone.trimEnd()) {
        chrome.storage.sync.get('words', function (data) {
            if (data.words[date]?.length !== 0 && data.words[date]) {
                if (!data.words[date]?.some((word) => newone == word)) {
                    words = data.words[date];
                    words.push(newone);
                    chrome.storage.sync.set({ 'words': {...data.words,[date]:words} });

                } else {
                    //Create notification
                    var notifOptions = {
                        type: 'basic',
                        iconUrl: 'icon48.png',
                        title: 'Seems there',
                        message: "The Word " + newone + " already in the list"
                    }
                    chrome.notifications.create('errormsg1', notifOptions)
                }
            } else {
                words.push(newone);
                chrome.storage.sync.set({ 'words': {...data.words,[date]:words} });

            }
        })
    }
});

//Add badge
chrome.storage.onChanged.addListener(function(changes,name){
    chrome.action.setBadgeText({"text":String(changes.words.newValue[date]?.length)});
})