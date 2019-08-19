// pages/main/main.js
// 引入 bamp-wx.js
/* var bmap = require('../libs/wxapp-jsapi-master/bmap-wx.js');
//new 一个百度地图对象
var BMap = new bmap.BMapWX({
  ak: 'YWncGxogHGYsF6Fm70g52O7BkoA2e034'
}); */
Page({
  //页面的初始数据
  data: {
    // 存储得到的当前city
    date: '',
    wendu: '',
    high: '',
    low: '',
    type: '',
    fengxiang: '',
    fengli: '',
    hint: '',
    cityDistrict: '',
    hum: '',
  },

  // 生命周期函数--监听页面加载
  // 页面初始化， options 为页面跳转所带来的参数
  onLoad: function (options) {
    this.loadInfo()
  },

  //生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

  //生命周期函数--监听页面显示
  onShow: function () {

  },

  //生命周期函数--监听页面隐藏
  onHide: function () {

  },

  //生命周期函数--监听页面卸载
  onUnload: function () {

  },

  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    this.loadInfo()
  },

  //页面上拉触底事件的处理函数
  onReachBottom: function () {

  },

  //用户点击右上角分享
  onShareAppMessage: function () {

  },
  // 第一步，获得当前经纬度
  loadInfo: function () {
    var page = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        // console.log(latitude, longitude);
        page.loadCity(latitude, longitude);
      }
    })
  },
  // 第二步 : 根据经纬度获得城市
  loadCity: function (latitude, longitude) {
    var page = this;
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=D6WOzHaymzVVKvgiy8UbhQEznkgeK6BD&location=' + latitude + ',' + longitude + '&output=json',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // console.log(res);
        var cityDistrict = res.data.result.addressComponent.district;
        cityDistrict = cityDistrict.replace("区", "");
        page.setData({
          cityDistrict: cityDistrict
        });
        page.loadWeather(cityDistrict);
        page.newWeather(cityDistrict);
      }
    });
  },
  // 第三步: 根据当前城市获得当前城市的天气
  loadWeather: function (city) {
    var page = this;
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather/forecast?location=' + city + '&key=47ec4494a026432ca9bb875f8d5c33a6',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // console.log(res)
        var future = res.data.HeWeather6[0].daily_forecast;
        var todayInfo = future[0];
        var today = todayInfo;
        page.setData({
          date: today.date,
          high: today.tmp_max,
          low: today.tmp_min,
          fengxiang: today.wind_dir,
          fengli: today.wind_sc,
          hum: today.hum,
          city: res.data.HeWeather6[0].basic.location,
        })
      }
    });
  },
  newWeather(cityDistrict) {
    var page = this;
    wx.request({
      url: 'https://wthrcdn.etouch.cn/weather_mini?city=' + cityDistrict,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // console.log(res)
        var future = res.data.data.forecast;
        var todayInfo = future.shift();
        var today = res.data.data;
        today.todayInfo = todayInfo;
        page.setData({
          wendu: today.wendu,
          type: todayInfo.type,
          hint: res.data.data.ganmao,
        })
      }
    });
  }


})