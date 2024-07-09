var isSyncingLeftScroll = false;
var isSyncingRightScroll = false;
var isSyncingRightToLeftScroll = false;
var isSyncingHeaderScroll = false;
var leftDiv = document.getElementById('leftContainer');
var rightDiv = document.getElementById('rightContainer');
var headerDiv = document.getElementById('headerContainer');

leftDiv.onscroll = function() {
  if (!isSyncingLeftScroll) {
    isSyncingRightScroll = true;
    rightDiv.scrollTop = this.scrollTop;
  }
  isSyncingLeftScroll = false;
}

rightDiv.onscroll = function() {
  if (!isSyncingRightScroll) {
    isSyncingLeftScroll = true;
    leftDiv.scrollTop = this.scrollTop;
    isSyncingRightToLeftScroll = true;
    headerDiv.scrollLeft = this.scrollLeft;
  }
  isSyncingRightScroll = false;
}

headerDiv.onscroll = function() {
    if (!isSyncingHeaderScroll) {
        isSyncingRightScroll = true;
        rightDiv.scrollLeft = this.scrollLeft;
    }
    isSyncingHeaderScroll = false;
  }
