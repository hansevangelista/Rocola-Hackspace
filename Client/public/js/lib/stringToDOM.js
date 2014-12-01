function stringToDOM (str) {

    var div = document.createElement('div');

    div.innerHTML = str;

    return div.children[0];
}
