//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World1',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userName: '',
    password: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //绑定在login按钮上
  login: function(e) {
    //调用wx.login 方法 它会生成一个code
    //将这个code传递给你的后端代码接口中
    //用来发送到微信服务器，以便获取openid
    wx.login({
      success: function(res) {
        console.log(res.code)
        var code = res.code
        wx.request({
          url: 'http://200.200.3.35:8999/sendToWx/' + code,
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          data: JSON.stringify(code),
          success: function(res) {

            console.log(res) // 服务器回包信息

          }
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //微信账号登录
  wechatlogin: function(e) {
    //输出你的微信账号信息
    // console.log(e.detail.userInfo)
    wx.login({
      success: function(res) {
        //res的code只存在5分钟
        console.log(res.code)
        //临时凭证
        var code = res.code
        
        wx.request({
          url: 'http://200.200.3.35:8999/wxLogin?code=' + code,
          method: 'POST',
          success: function(result) {

            console.log(result) // 服务器回包信息
            //请求成功之后，把openid放到储存里面
            wx.setStorageSync(
              'openid',
              result.data.data.openid
            ),
            wx.setStorageSync(
              'token',
               result.data.data.token
            )
          }
        })
      }
    })
  },
  userNameInput: function(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  addUser: function(e) {
    var token = wx.getStorageSync('token')
    
    var openid = wx.getStorageSync('openid')
    

    console.log("token:" + token)
    console.log("openid:" + openid)
    wx.request({
      url: 'http://200.200.3.35:8999/addUser',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': token,
        'openid': openid
      },
      data: {
        "username": this.data.userName,
        'password': this.data.password
      },
      success: function(result) {

        console.log(result) // 服务器回包信息

      }
    })
  }
})