var UTIL = require('../../utils/util.js')
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
  loadmore: function () {
    var that = this;
    that.setData({
      loadMoreLoading: true,
      loadMore: false
    })
    var stories = that.data.stories;
    UTIL.loadDataList(
      '/v0.showstories',
      that.data.story_list,
      that.data.stories,
      that.data.page
    ).then(function (rtn) {
      stories = stories.concat(rtn[1]);
      // console.log(stories)
      that.setData({
        stories: stories,
        result: true,
        page: that.data.page + 1,
        story_list: rtn[0]
      })
      UTIL.setListLoad(that.data.page, that.data.story_list, that)
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      page: 0,
      story_list: [],
      stories: [],
      result: false
    })
    var stories = that.data.stories;
    UTIL.loadDataList(
      '/v0.showstories',
      that.data.story_list,
      that.data.stories,
      that.data.page
    ).then(function (rtn) {
      stories = stories.concat(rtn[1]);
      // console.log(stories)
      that.setData({
        stories: stories,
        result: true,
        page: that.data.page + 1,
        story_list: rtn[0]
      })
      UTIL.setListLoad(that.data.page, that.data.story_list, that)
    })
    wx.stopPullDownRefresh()
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: app.globalData.APIServer + '/cache/show',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          stories: res.data.data.scontent,
          result: true,
          page: that.data.page + 1,
          story_list: res.data.data.slist
        })
        UTIL.setListLoad(that.data.page, that.data.story_list, that)
      }
    })
  }
})
