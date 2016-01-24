// chrome.browserAction.onClicked.addListener(function(tab) {
//   // Send a message to the active tab
//   alert('clicked at first')
//   chrome.tabs.query({
//     active: true,
//     currentWindow: true
//   }, function(tabs) {
//     alert('clicked it yoyououoyuououo', eval(tabs));
//     var activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, {
//       "message": "clicked_browser_action"
//     });
//   });
// });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
      chrome.tabs.create({"url": request.url});
    }
  }
);

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('HEARD CLICK EVENT ON BACKGROUND');
    var tab;

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        console.log('tabs are ', tabs)
        tab = tabs[0];
        var url = tab.url;
        getTreeData(url, successHandler, errorHandler);

    });

    function getTreeData (url, successCB, errorCB) {
        var urlWithoutSpecialChars = url.replace(/[^a-zA-Z0-9 ]/g, "");
        var cache;

        chrome.storage.local.get('urlWithoutSpecialChars', function(cachedNeighbors) {
            cache = cachedNeighbors || {};

            if(Object.keys(cache).length > 0) {
                successCB(cache);
                return;
            }

            var x = new XMLHttpRequest();
            x.open('POST', 'http://localhost:1337/api/get-web');
            x.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            x.responseType = 'json';
            x.onload = function() {
                var response = x.response;

                if(!response) {
                    errorCB('No response from api-get-web');
                    return;
                }
                cache[urlWithoutSpecialChars] = response;
                chrome.storage.local.set(cache, function() {
                });
                successCB(response);
                return;
            };
            x.onerror = function() {
                errorCB('Network error.');
            };
            x.send(JSON.stringify({url: url}));

        });

    };

    function successHandler(response) {
        console.log("SUCCESS HANDLER: ", response);
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            var activeTab = tabs[0];
            console.log('the tab is : ', tab);
            chrome.tabs.sendMessage(tab.id, {
            "message": "tree_data_available",
            "root" : response
            });
        });
    }

    function errorHandler(message) {
        console.error('Something went wrong: ', message);
    }

});
