//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    stories: "",
    result: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    wx.request({
      url: app.globalData.APIServer + '/v0.topstories',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data)
        // console.log(res.data.data.slice(0, 10))
        that.setData({
          story_list: res.data.data,
          // result: true
        })
        var first_page = res.data.data.slice(0, 10);
        var stories = []
        wx.request({
          url: app.globalData.APIServer + '/list/[' + first_page + ']',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            // console.log(res.data.data)
            stories = stories.concat(res.data.data)
            // console.log(stories)
            that.setData({
              stories: stories,
              result: true
            })
          }
        })
      },
      fail: function (res) {
        console.log('error')
      }
    })
  }
})
