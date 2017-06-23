//index.js
//获取应用实例
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({
  data: {
    contentShow: false,
    commentShow: false,
    detail: null,
    comments: null,
    loadMore: false,
    loadMoreLoading: false,
    page: 0,
    comment_list: []
  },
  copyurl: function() {
    wx.setClipboardData({
      data: this.data.detail.url,
      success: function (res) {
        wx.showToast({
          title: 'Copy Success',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: 'A news that may interest you :)',
      path: '/pages/detail/detail?id=' + this.data.itemId,
      success: function (res) {
        console.log('success')
      },
      fail: function (res) {
        console.log('fail')
      }
    }
  },
  loadmore: function () {
    var that = this;
    that.setData({
      loadMore: false,
      loadMoreLoading: true
    })
    var comments = that.data.comments;
    var comment_list = that.data.comment_list;
    var pageRange = comment_list.slice(that.data.page * 5, (that.data.page + 1) * 5);
    wx.request({
      url: app.globalData.APIServer + '/list/[' + pageRange + ']',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data)
        comments = comments.concat(res.data.data)
        for (var i = 0; i < comments.length; i++) {
          if (comments[i].deleted == true) {
            WxParse.wxParse('comment' + i, 'html', 'This comment has been deleted.', that, 0);
          } else {
            WxParse.wxParse('comment' + i, 'html', comments[i].text, that, 0);
          }
          if (i === comments.length - 1) {
            WxParse.wxParseTemArray("commentArray", 'comment', comments.length, that)
          }
        }
        that.setData({
          comments: comments,
          commentShow: true,
          page: that.data.page + 1,
          comment_list: comment_list
        })
        console.log(that.data.page, that.data.comment_list)
        if ((that.data.page + 0) * 5 >= that.data.comment_list.length) {
          that.setData({
            loadMore: false,
            loadMoreLoading: false
          })
        } else {
          that.setData({
            loadMore: true,
            loadMoreLoading: false
          })
        }
      }
    })
  },
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    var id = options.id;
    that.setData({
      itemId: id
    })

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
        if (res.data.data.text) {
          WxParse.wxParse('detailText', 'html', res.data.data.text, that, 0);
        }
        if (res.data.data.kids) {
          var comment_list = res.data.data.kids;
          var pageRange = res.data.data.kids.slice(that.data.page * 5, (that.data.page + 1) * 5);
          var comments = []
          wx.request({
            url: app.globalData.APIServer + '/list/[' + pageRange + ']',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res.data.data)
              comments = comments.concat(res.data.data)
              for (var i = 0; i < comments.length; i++) {
                if (comments[i].deleted == true) {
                  WxParse.wxParse('comment' + i, 'html', 'This comment has been deleted.', that, 0);
                } else {
                  WxParse.wxParse('comment' + i, 'html', comments[i].text, that, 0);
                }
                if (i === comments.length - 1) {
                  WxParse.wxParseTemArray("commentArray", 'comment', comments.length, that)
                }
              }
              that.setData({
                comments: comments,
                commentShow: true,
                page: that.data.page + 1,
                comment_list: comment_list
              })
              console.log(that.data.page, that.data.comment_list)
              if ((that.data.page + 0) * 5 >= that.data.comment_list.length) {
                that.setData({
                  loadMore: false,
                  loadMoreLoading: false
                })
              } else {
                that.setData({
                  loadMore: true,
                  loadMoreLoading: false
                })
              }
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
