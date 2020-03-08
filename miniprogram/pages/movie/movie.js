// miniprogram/pages/movie/movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [],
    floorstatus: false
  },
  getMovies: function() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'movielist',
      data: {
        page: this.data.movies.length
      }
    }).then(res => {
      this.setData({
        movies: this.data.movies.concat(JSON.parse(res.result).data)
      });
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
      console.error(err)
    })
  },
  gotoComment(event) {
    wx.navigateTo({
      url: `../comment/comment?movieid=${event.target.dataset.movieid}&movietitle=${event.target.dataset.movietitle}&moviecover=${event.target.dataset.moviecover}`,
    })
  },
  //回到顶部 
  // 一键回到顶部
  goTop: function(e) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMovies();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getMovies();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 获取滚动条当前位置
  onPageScroll: function(e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  }
})