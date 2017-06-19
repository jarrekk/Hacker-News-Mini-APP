var app = getApp()

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function loadDataList(appendURL, story_list, stories, page) {
  var stories = stories;
  var loadMoreLoading = false;
  var loadMore = false;
  return new Promise(function (resolve, reject) {
  wx.request({
    url: app.globalData.APIServer + appendURL,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      var story_list = res.data.data;
      var pageRange = story_list.slice(page * 10, (page + 1) * 10);
      wx.request({
        url: app.globalData.APIServer + '/list/[' + pageRange + ']',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          resolve([story_list, res.data.data]);
        }
      })
    },
    fail: function (res) {
      reject([story_list, res.data.data]);
    }
  })
  })
}

function setListLoad(page, story_list, that) {
  if (page * 10 >= story_list.length) {
    that.setData({
      loadMoreLoading: false,
      loadMore: false
    })
  } else {
    that.setData({
      loadMoreLoading: false,
      loadMore: true
    })
  }
}

module.exports = {
  formatTime: formatTime,
  loadDataList: loadDataList,
  setListLoad: setListLoad
}