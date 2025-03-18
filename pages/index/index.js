// index.js
import Toast from '@vant/weapp/toast/toast';

/* global Page, getApp, wx */
Page({
  data: {
    // 基本信息
    annualSalary: '', // 年薪
    workingDays: '5', // 每周工作天数
    dailyHours: '8', // 日工作时长
    commuteTime: '1', // 通勤时长
    annualLeave: '10', // 年假天数
    publicHolidays: 11, // 法定节假日
    
    // 环境系数
    workEnvironment: 1.0, // 工作环境系数
    heterogeneity: 1.0, // 异性环境系数
    teamwork: 1.0, // 同事环境系数
    leadershipFactor: 1.0, // 领导系数
    education: 1.0, // 学历系数
    companyProspect: 1.0, // 公司前景系数
    fishLevel: 1.0, // 摸鱼程度
    insuranceFactor: 1.0, // 五险一金系数
    
    // 提示弹窗
    showTip: false,
    tipContent: ''
  },
  
  onLoad(options) {
    // 检查是否是从分享链接打开的
    if (options && options.fromShare) {
      // 处理分享参数
      const valueScore = options.valueScore || '';
      const assessment = decodeURIComponent(options.assessment || '');
      const showSalary = options.showSalary === '1';
      const showFunMetrics = options.showFunMetrics === '1';
      
      // 如果是分享来的，直接跳转到结果页
      if (valueScore && assessment) {
        // 创建临时结果对象
        const app = getApp();
        
        // 解析共享出来的数据
        const dailySalary = decodeURIComponent(options.dailySalary || '');
        const milkTeaCount = decodeURIComponent(options.milkTeaCount || '0');
        const movieCount = decodeURIComponent(options.movieCount || '0');
        const restaurantMealCount = decodeURIComponent(options.restaurantMealCount || '0');
        const personalTrainingCount = decodeURIComponent(options.personalTrainingCount || '0');
        const concertTickets = decodeURIComponent(options.concertTickets || '0');
        const travelDaysNeeded = decodeURIComponent(options.travelDaysNeeded || '0');
        const travelMonthsNeeded = decodeURIComponent(options.travelMonthsNeeded || '0');
        
        // 使用全局数据存储结果和隐私设置
        app.globalData.calculationResults = {
          valueScore: valueScore,
          assessment: {
            text: assessment,
            color: this.getAssessmentColor(assessment)
          },
          dailySalary: dailySalary,
          milkTeaCount: milkTeaCount,
          movieCount: movieCount,
          restaurantMealCount: restaurantMealCount,
          personalTrainingCount: personalTrainingCount,
          concertTickets: concertTickets,
          travelDaysNeeded: travelDaysNeeded,
          travelMonthsNeeded: travelMonthsNeeded
        };
        
        // 设置隐私设置
        app.globalData.privacySettings = {
          showSalary: showSalary,
          showFunMetrics: showFunMetrics
        };
        
        // 跳转到结果页
        wx.navigateTo({
          url: '/pages/result/result?fromShare=true'
        });
      }
    }
  },
  
  // 根据评估文本获取对应的颜色
  getAssessmentColor(assessmentText) {
    switch(assessmentText) {
      case '不值！别上了！':
        return '#7f1d1d';
      case '一般，随便干干':
        return '#ef4444';
      case '凑合，可以考虑':
        return '#f59e0b';
      case '不错，还挺合适你':
        return '#3b82f6';
      case '值！这班值啊！':
        return '#10b981';
      // 保留原有的匹配（兼容性）
      case '值，贼值！':
        return '#07c160';
      case '还可以':
        return '#1989fa';
      case '不值当':
        return '#ff976a';
      case '血亏':
        return '#ee0a24';
      default:
        return '#1989fa';
    }
  },
  
  // 输入框变更处理函数
  onAnnualSalaryChange(e) {
    this.setData({
      annualSalary: e.detail
    });
  },
  
  onWorkingDaysChange(e) {
    this.setData({
      workingDays: e.detail
    });
  },
  
  onDailyHoursChange(e) {
    this.setData({
      dailyHours: e.detail
    });
  },
  
  onCommuteTimeChange(e) {
    this.setData({
      commuteTime: e.detail
    });
  },
  
  onAnnualLeaveChange(e) {
    this.setData({
      annualLeave: e.detail
    });
  },
  
  // 系数选择处理函数
  selectWorkEnvironment(e) {
    this.setData({
      workEnvironment: parseFloat(e.currentTarget.dataset.value)
    });
  },
  
  selectHeterogeneity(e) {
    this.setData({
      heterogeneity: parseFloat(e.currentTarget.dataset.value)
    });
  },
  
  selectTeamwork(e) {
    this.setData({
      teamwork: parseFloat(e.currentTarget.dataset.value)
    });
  },
  
  selectLeadershipFactor(e) {
    this.setData({
      leadershipFactor: parseFloat(e.currentTarget.dataset.value)
    });
  },
  
  selectEducation(e) {
    this.setData({
      education: parseFloat(e.currentTarget.dataset.value)
    });
  },
  
  selectCompanyProspect(e) {
    this.setData({
      companyProspect: parseFloat(e.currentTarget.dataset.value)
    });
  },
  
  selectFishLevel(e) {
    this.setData({
      fishLevel: parseFloat(e.currentTarget.dataset.value)
    });
  },
  
  selectInsuranceFactor(e) {
    this.setData({
      insuranceFactor: parseFloat(e.currentTarget.dataset.value)
    });
  },
  
  // 提示信息处理
  showTooltip(e) {
    this.setData({
      showTip: true,
      tipContent: e.currentTarget.dataset.tooltip || '包括上班路上的往返通勤总时间'
    });
  },
  
  closeTip() {
    this.setData({
      showTip: false
    });
  },
  
  // 验证输入数据
  validateInput() {
    if (!this.data.annualSalary) {
      Toast('请输入年薪');
      return false;
    }
    
    if (!this.data.workingDays || parseFloat(this.data.workingDays) <= 0 || parseFloat(this.data.workingDays) > 7) {
      Toast('请输入有效的工作天数(1-7)');
      return false;
    }
    
    if (!this.data.dailyHours || parseFloat(this.data.dailyHours) <= 0 || parseFloat(this.data.dailyHours) > 24) {
      Toast('请输入有效的工作时长(1-24)');
      return false;
    }
    
    if (this.data.commuteTime === '' || parseFloat(this.data.commuteTime) < 0) {
      Toast('请输入有效的通勤时长');
      return false;
    }
    
    if (this.data.annualLeave === '' || parseFloat(this.data.annualLeave) < 0) {
      Toast('请输入有效的年假天数');
      return false;
    }
    
    return true;
  },
  
  // 计算性价比
  calculate() {
    if (!this.validateInput()) {
      return;
    }
    
    // 解析输入值
    const annualSalary = parseFloat(this.data.annualSalary) * 10000; // 转换万元为元
    const workingDays = parseFloat(this.data.workingDays);
    const dailyHours = parseFloat(this.data.dailyHours);
    const commuteTime = parseFloat(this.data.commuteTime);
    const annualLeave = parseFloat(this.data.annualLeave);
    const publicHolidays = this.data.publicHolidays; // 固定值11
    
    // 计算工作天数 (减去年假和法定节假日)
    const annualWorkingDays = Math.round((workingDays / 7) * 365) - annualLeave - publicHolidays;
    
    // 计算日薪
    const dailySalary = annualSalary / annualWorkingDays;
    
    // 计算工作天数系数
    let workingDaysFactor = 1.0;
    if (workingDays < 5) {
      workingDaysFactor = 1.4;
    } else if (workingDays === 5) {
      workingDaysFactor = 1.0;
    } else if (workingDays === 6) {
      workingDaysFactor = 0.8;
    } else if (workingDays === 7) {
      workingDaysFactor = 0.6;
    }
    
    // 环境系数（不包含教育和公司前景）
    const baseEnvironmentFactor = this.data.workEnvironment * 
                                this.data.heterogeneity * 
                                this.data.teamwork * 
                                this.data.leadershipFactor *
                                this.data.fishLevel *
                                this.data.companyProspect *
                                this.data.insuranceFactor *
                                workingDaysFactor;
                        
    // 计算性价比
    const valueScore = (dailySalary * baseEnvironmentFactor) / 
                      (35 * (dailyHours + commuteTime) * this.data.education);
    
    // 计算趣味指标（更新价格）
    const milkTeaCount = (dailySalary / 18).toFixed(1); // 奶茶价格18元，保留一位小数
    const movieCount = (dailySalary / 60).toFixed(1);   // 电影价格60元（哪吒2），保留一位小数
    const restaurantMealCount = (dailySalary / 250).toFixed(1); // 大餐价格250元，保留一位小数
    
    // 获取评估结果
    const assessment = this.getValueAssessment(valueScore);
    
    // 将结果存入全局数据
    const app = getApp();
    app.globalData.calculationResults = {
      annualSalary: parseFloat(this.data.annualSalary), // 存储万元单位的年薪
      workingDays: workingDays,
      dailyHours: dailyHours,
      commuteTime: commuteTime,
      annualLeave: annualLeave,
      publicHolidays: publicHolidays,
      dailySalary: dailySalary.toFixed(0),
      valueScore: valueScore.toFixed(1),
      milkTeaCount: milkTeaCount,
      movieCount: movieCount,
      restaurantMealCount: restaurantMealCount,
      assessment: assessment,
      workEnvironment: this.data.workEnvironment,
      heterogeneity: this.data.heterogeneity,
      teamwork: this.data.teamwork,
      leadershipFactor: this.data.leadershipFactor,
      education: this.data.education,
      companyProspect: this.data.companyProspect,
      fishLevel: this.data.fishLevel,
      insuranceFactor: this.data.insuranceFactor,
      workingDaysFactor: workingDaysFactor.toFixed(1)
    };
    
    // 跳转到结果页
    wx.navigateTo({
      url: '/pages/result/result'
    });
  },
  
  // 获取评估结果
  getValueAssessment(value) {
    if (value < 0.7) return { text: "不值！别上了！", color: "#7f1d1d" };
    if (value < 1.0) return { text: "一般，随便干干", color: "#ef4444" };
    if (value < 2.0) return { text: "凑合，可以考虑", color: "#f59e0b" };
    if (value < 3.5) return { text: "不错，还挺合适你", color: "#3b82f6" };
    return { text: "值！这班值啊！", color: "#10b981" };
  }
});
