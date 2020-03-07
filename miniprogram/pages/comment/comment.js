// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieid: -1,
    movietitle: '',
    moviecover: '',
    comment: '',
    rate: 5,
    fileList: []
  },
  submit() {
    console.log('submit')
    wx.showLoading({
      title: '提交中',
    })
    const db = wx.cloud.database()
    db.collection('comment').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        movieid: this.data.movieid,
        comment: this.data.comment,
        rate: this.data.rate,
        fileList: this.data.fileList
      }
    }).then(res => {
      console.log(res)
      wx.hideLoading();
      wx.showToast({
        title: '提交评价成功',
      })
    }).catch(error => {
      console.error(error)
      wx.hideLoading();
    })
  },
  onCommentChange(event) {
    this.setData({
      comment: event.detail
    })
  },
  onRateChange(event) {
    this.setData({
      rate: event.detail
    })
  },
  onFileDelete(event) {
    console.log(event)
    wx.showLoading({
      title: '删除中',
    })
    const {
      index
    } = event.detail;
    const fileID = this.data.fileList[index].url;
    wx.cloud.deleteFile({
      fileList: [fileID]
    }).then(res => {
      this.data.fileList.splice(index, 1);
      this.setData({
        fileList: this.data.fileList
      })
      wx.hideLoading();
    }).catch(error => {
      console.error(error)
      wx.hideLoading();
    })
  },
  afterFileRead(event) {
    wx.showLoading({
      title: '上传中',
    })
    console.log(event);
    const files = event.detail.file;
    const promiseArr = [];
    for (let i = 0; i < files.length; i++) {
      const path = files[i].path;
      const promise = new Promise((resolve, reject) => {
        const suffix = /\.\w+$/.exec(path);
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: path, // 文件路径
        }).then(res => {
          console.log(res);
          resolve(res.fileID);
        }).catch(error => {
          console.error(error)
          reject(error)
        })
      });
      promiseArr.push(promise)
    }

    Promise.all(promiseArr).then((res) => {
      console.log(res);
      const images = res.map(img => {
        return {
          url: img,
          isImage: true
        }
      })
      this.setData({
        fileList: this.data.fileList.concat(images)
      })
      wx.hideLoading();
    }).catch(error => {
      console.error(error)
      wx.hideLoading();
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      movieid: options.movieid,
      movietitle: options.movietitle,
      moviecover: options.moviecover
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})