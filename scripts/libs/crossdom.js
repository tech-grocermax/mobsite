window.addEventListener('message', function(event) {
    // Domain restriction (to not leak variables to any page..)
    if (event.origin == 'http://m.qa.grocermax.com' ||
        event.origin == 'https://m.qa.grocermax.com') {
        var data = JSON.parse(event.data);
        if ('setItem' in data) {  console.log('setItem');console.log(data);
            localStorage.setItem(data.setItem, data.value);
        } else if ('getItem' in data) { console.log('getItem');console.log(data);
            var gotItem = localStorage.getItem(data.getItem);
            // See below
            event.source.postMessage(
                '#localStorage#' + data.identifier + 
                (gotItem === null ? 'null#' : '#' + gotItem),
                event.origin
            );
        } else if ('removeItem' in data) {
            localStorage.removeItem(data.removeItem);
        }
    }
}, false);

