//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    story_list: [],
    stories: [],
    result: false,
    loadMore: true,
    loadMoreLoading: false,
    page: 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  loadmore: function() {
    var that = this;
    that.setData({
      loadMoreLoading: true,
      loadMore: false
    })
    var pageRange =that.data.story_list.slice(that.data.page * 10, (that.data.page + 1) * 10);
    var stories = that.data.stories;
    wx.request({
      url: app.globalData.APIServer + '/list/[' + pageRange + ']',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data.data)
        stories = stories.concat(res.data.data)
        // console.log(stories)
        that.setData({
          stories: stories,
          result: true,
          page: that.data.page + 1,
          loadMoreLoading: false,
          loadMore: true
        })
      }
    })
    if (that.data.page * 10 > that.data.story_list.length) {
      that.setData({
        loadMoreLoading: false,
        loadMore: false
      })
    }
    console.log(that.data.result)
  },
  onPullDownRefresh: function () {
    console.log('onLoad')
    var that = this;
    that.setData({
      page: 0,
      story_list: [],
      stories: [],
      result: false
    })
    wx.request({
      url: app.globalData.APIServer + '/v0.topstories',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          story_list: res.data.data,
        })
        var pageRange = that.data.story_list.slice(that.data.page * 10, (that.data.page + 1) * 10);
        var stories = that.data.stories;
        wx.request({
          url: app.globalData.APIServer + '/list/[' + pageRange + ']',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            // console.log(res.data.data)
            stories = stories.concat(res.data.data)
            // console.log(stories)
            that.setData({
              stories: stories,
              result: true,
              page: that.data.page + 1
            })
          }
        })
        if (that.data.page * 10 >= that.data.story_list.length) {
          that.setData({
            loadMoreLoading: false,
            loadMore: false
          })
        }
      },
      fail: function (res) {
        console.log('error')
      }
    })
    wx.stopPullDownRefresh()
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
          // story_list: res.data.data.slice(0, 8),
          // result: true
        })
        var pageRange = that.data.story_list.slice(that.data.page * 10, (that.data.page + 1) * 10) ;
        var stories = that.data.stories;
        wx.request({
          url: app.globalData.APIServer + '/list/[' + pageRange + ']',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            // console.log(res.data.data)
            stories = stories.concat(res.data.data)
            // console.log(stories)
            that.setData({
              stories: stories,
              result: true,
              page: that.data.page + 1
            })
          }
        })
        if (that.data.page * 10 >= that.data.story_list.length) {
          that.setData({
            loadMoreLoading: false,
            loadMore: false
          })
        }
      },
      fail: function (res) {
        console.log('error')
      }
    })
  }
})
