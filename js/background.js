let button = document.getElementById("download");

const executeDownload = function(){
    chrome.tabs.executeScript({file: "./js/jspdf.js"}, function(){
        chrome.tabs.executeScript({file: "./js/gbooksdldr.js"}, function(){
        });
    });
};

button.onclick = executeDownload;
