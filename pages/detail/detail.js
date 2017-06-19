//index.js
//获取应用实例
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({
  data: {
    contentShow: false,
    commentShow: false,
    detail: null,
    comments: null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    var id = options.id;

    wx.request({
      url: app.globalData.APIServer + '/v0.item.' + id,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data)
        // console.log(stories)
        that.setData({
          detail: res.data.data,
          contentShow: true
        })
        var first_page = [];
        if (res.data.data.kids) {
        first_page = res.data.data.kids.slice(0, 5);
        var comments = []
        wx.request({
          url: app.globalData.APIServer + '/list/[' + first_page + ']',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data.data)
            comments = comments.concat(res.data.data)
            for (var i = 0; i < comments.length; i++) {
              WxParse.wxParse('comment' + i, 'html', comments[i].text, that, 0);
              if (i === comments.length - 1) {
                WxParse.wxParseTemArray("commentArray", 'comment', comments.length, that)
              }
            }
            that.setData({
              comments: comments,
              commentShow: true
            })

          }
        })
        } else {
          that.setData({
            commentShow: true
          })
        }
      }
    })
  }
})
