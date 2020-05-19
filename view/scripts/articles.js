function loadMore() {
    var articlesArr = document.getElementsByClassName('article');
    var slicedArr = [];
    var i = 0;
    for (i = 0; i < 8; i++) {
        slicedArr.push(articlesArr[i]);
        slicedArr[i].style.display = "block"
    }
    document.getElementById("loadMore").addEventListener('click', function (event) {
        event.preventDefault();
        var nextElements = [];
        for (var j = i; j < i + 8; j++) {
            if(j<articlesArr.length && window.getComputedStyle(articlesArr[j]).display === "none"){
                nextElements.push(articlesArr[j]);
                articlesArr[j].style.display = "block";
            }
        }
        i = j;
        if(nextElements.length < 8 || articlesArr.length == j){
            document.getElementById('loadMore').innerText = "No more content";
            document.getElementById('loadMore').classList.add("noContent");
        }
    })
}