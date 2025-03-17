// result.js
/* global Page, getApp, wx */
Page({
  data: {
    // 基本结果数据
    valueScore: '',
    dailySalary: '',
    assessment: { text: '', color: '' },
    
    // 工作条件数据
    workEnvironment: '',
    heterogeneity: '',
    teamwork: '',
    leadershipFactor: '',
    education: '',
    companyProspect: '',
    fishLevel: '',
    workingDaysFactor: '',
    annualLeave: '',
    publicHolidays: '',
    
    // 趣味指标数据
    milkTeaCount: 0,
    movieCount: 0,
    restaurantMealCount: 0,
    personalTrainingCount: 0,
    concertTickets: 0,
    travelDaysNeeded: 0,
    travelMonthsNeeded: 0,
    
    // 分享相关
    showShareTips: false,
    
    // 新增: 隐私设置相关
    showPrivacySettingsPopup: false,
    privacySettings: {
      showSalary: true,
      showFunMetrics: true
    }
  },
  
  onLoad: function() {
    // 从全局数据中获取计算结果
    const app = getApp();
    const results = app.globalData.calculationResults;
    
    if (results) {
      this.setData({
        valueScore: results.valueScore,
        dailySalary: results.dailySalary,
        assessment: results.assessment,
        workEnvironment: results.workEnvironment,
        heterogeneity: results.heterogeneity,
        teamwork: results.teamwork,
        leadershipFactor: results.leadershipFactor,
        education: results.education,
        companyProspect: results.companyProspect,
        fishLevel: results.fishLevel,
        workingDaysFactor: results.workingDaysFactor,
        annualLeave: results.annualLeave,
        publicHolidays: results.publicHolidays,
        milkTeaCount: results.milkTeaCount,
        movieCount: results.movieCount,
        restaurantMealCount: results.restaurantMealCount
      });
      
      // 计算新增的快乐指数
      this.calculateAdditionalFunMetrics(results.dailySalary);
    } else {
      // 如果没有结果数据，返回到计算页
      wx.navigateBack();
    }
  },
  
  /**
   * 计算额外的快乐指数项目
   */
  calculateAdditionalFunMetrics: function(dailySalary) {
    // 价格定义
    const PERSONAL_TRAINING_PRICE = 200;
    const CONCERT_TICKET_PRICE = 800;
    const TRAVEL_PRICE = 6000;
    
    // 计算每日收入可以兑换的数量（保留一位小数）
    const personalTrainingCount = (dailySalary / PERSONAL_TRAINING_PRICE).toFixed(1);
    const concertTickets = (dailySalary / CONCERT_TICKET_PRICE).toFixed(1);
    
    // 计算旅行所需天数（保留一位小数）
    const travelDaysNeeded = (TRAVEL_PRICE / dailySalary).toFixed(1);
    let travelMonthsNeeded = 0;
    
    if (parseFloat(travelDaysNeeded) >= 30) {
      // 如果需要超过30天，转换为月份显示（按每月22个工作日计算）
      travelMonthsNeeded = (parseFloat(travelDaysNeeded) / 22).toFixed(1);
    }
    
    this.setData({
      personalTrainingCount,
      concertTickets,
      travelDaysNeeded,
      travelMonthsNeeded
    });
  },
  
  /**
   * 返回到计算器页面
   */
  backToCalculator: function() {
    wx.navigateBack();
  },
  
  /**
   * 显示隐私设置弹窗
   */
  showPrivacySettings: function() {
    this.setData({
      showPrivacySettingsPopup: true
    });
  },
  
  /**
   * 关闭隐私设置弹窗
   */
  closePrivacySettings: function() {
    this.setData({
      showPrivacySettingsPopup: false
    });
  },
  
  /**
   * 切换隐私设置选项
   */
  togglePrivacySetting: function(e) {
    const setting = e.currentTarget.dataset.setting;
    const isReverse = e.currentTarget.dataset.reverse || false;
    const value = isReverse ? !e.detail.value : e.detail.value;
    
    // 更新对应的设置值
    const updatedSettings = { ...this.data.privacySettings };
    updatedSettings[setting] = value;
    
    this.setData({
      privacySettings: updatedSettings
    });
  },
  
  /**
   * 确认分享设置并分享
   */
  confirmAndShare: function() {
    this.closePrivacySettings();
    
    // 调用系统分享 - 微信小程序会在用户点击后自动触发onShareAppMessage
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    });
  },
  
  /**
   * 用户点击右上角或按钮分享
   */
  onShareAppMessage: function() {
    // 根据隐私设置创建分享标题
    let shareTitle = `我的工作性价比是${this.data.valueScore}分，${this.data.assessment.text}`;
    
    // 创建分享卡片
    return {
      title: shareTitle,
      path: '/pages/index/index',
      imageUrl: this.createShareImage()
    }
  },
  
  /**
   * 创建分享图片
   * 修改现有方法以处理隐私设置
   */
  createShareImage: function() {
    const ctx = wx.createCanvasContext('shareCanvas');
    const canvasWidth = 300;
    const canvasHeight = 400;
    const privacySettings = this.data.privacySettings;
    
    // 设置背景
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 绘制标题
    ctx.setFillStyle('#333333');
    ctx.setFontSize(18);
    ctx.setTextAlign('center');
    ctx.fillText('这破班上的值不值?', canvasWidth / 2, 40);
    
    // 绘制评估结果
    ctx.setFillStyle(this.data.assessment.color);
    ctx.fillRect(50, 60, 200, 40);
    ctx.setFillStyle('#ffffff');
    ctx.setFontSize(16);
    ctx.setTextAlign('center');
    ctx.fillText(this.data.assessment.text, canvasWidth / 2, 85);
    
    // 绘制性价比评分
    ctx.setFillStyle('#333333');
    ctx.setFontSize(14);
    ctx.setTextAlign('left');
    ctx.fillText('性价比评分:', 50, 130);
    ctx.setFontSize(24);
    ctx.setFillStyle('#0077e6');
    ctx.fillText(this.data.valueScore, 180, 130);
    
    // 根据隐私设置绘制薪资指标
    ctx.setFillStyle('#333333');
    ctx.setFontSize(14);
    ctx.fillText('日薪:', 50, 170);
    ctx.setFillStyle('#0077e6');
    ctx.setFontSize(20);
    
    if (privacySettings.showSalary) {
      ctx.fillText(`${this.data.dailySalary}元`, 180, 170);
    } else {
      ctx.fillText('已隐藏', 180, 170);
    }
    
    // 绘制趣味指标标题
    ctx.setFillStyle('#333333');
    ctx.setFontSize(16);
    ctx.setTextAlign('center');
    ctx.fillText('每日快乐指数：', canvasWidth / 2, 250);
    
    // 根据隐私设置绘制趣味指标图标和数值
    if (privacySettings.showFunMetrics) {
      ctx.setFontSize(16);
      ctx.setFillStyle('#0077e6');
      ctx.fillText(`${this.data.milkTeaCount}杯奶茶`, canvasWidth / 2, 280);
      ctx.fillText(`${this.data.movieCount}场《哪吒2》`, canvasWidth / 2, 310);
      ctx.fillText(`${this.data.restaurantMealCount}顿大餐`, canvasWidth / 2, 340);
      ctx.fillText(`${this.data.personalTrainingCount}节私教课`, canvasWidth / 2, 370);
      ctx.fillText(`${this.data.concertTickets}张演唱会门票`, canvasWidth / 2, 400);
      
      // 根据情况展示旅行相关信息
      if (parseFloat(this.data.travelDaysNeeded) < 30) {
        ctx.fillText(`工作${this.data.travelDaysNeeded}天可换一次旅行`, canvasWidth / 2, 430);
      } else if (this.data.travelMonthsNeeded > 0) {
        ctx.fillText(`工作${this.data.travelMonthsNeeded}个月可换一次旅行`, canvasWidth / 2, 430);
      }
    } else {
      ctx.setFontSize(16);
      ctx.setFillStyle('#0077e6');
      ctx.fillText(`已隐藏`, canvasWidth / 2, 300);
    }
    
    // 如果隐藏了隐私信息，添加隐私保护标记
    if (!privacySettings.showSalary || !privacySettings.showFunMetrics) {
      ctx.setFillStyle('#f56c6c');
      ctx.setFontSize(12);
      ctx.fillText('隐私保护模式', canvasWidth / 2, 360);
    }
    
    // 绘制小程序名称
    ctx.setFillStyle('#999999');
    ctx.setFontSize(12);
    ctx.fillText('这破班上的值不值', canvasWidth / 2, 380);
    
    // 生成图片
    ctx.draw(false, () => {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'shareCanvas',
          success: (res) => {
            return res.tempFilePath;
          },
          fail: (err) => {
            console.error('生成分享图片失败', err);
            return '';
          }
        });
      }, 100);
    });
    
    // 由于异步问题，这里返回一个默认的分享图片路径
    return '';
  },
  
  /**
   * 显示分享成功提示
   */
  showShareSuccess: function() {
    this.setData({ showShareTips: true });
    setTimeout(() => {
      this.setData({ showShareTips: false });
    }, 2000);
  }
});
