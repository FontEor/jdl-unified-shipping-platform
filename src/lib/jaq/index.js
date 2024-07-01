/* eslint-disable no-undef */
export default function init (erpPin, type) {
  window.jaq = window.jaq || [] // 注意 jaq需要是window下的全局变量，否则sdk读取不到配置，会出现配置不生效，比如m参数为空等情况
  jaq.push(['account', process.env.VUE_APP_MD_ACCOUNT]) // 站点编号
  jaq.push(['domain', process.env.VUE_APP_MD_DOMAIN]) // 站点域名

  // 1.'erp_pin'：默认值；优先用户传入erp_account，其次cookie中pin，如都获取不到则为空。（兼容历史，会导致字段值混乱，建议使用2，3方案。）
  // 2.'erp'：需要用户手动传入erp_account，不传入取值为空；erp登录站点设置为该值
  // 3.'pin'：只取cookie中pin，如都获取不到则为空；
  // console.log(erp_pin, 'erppin')
  let accountType = 'erp_pin'
  if (type === 2) {
    accountType = 'erp'
  }
  if (type === 3) {
    accountType = 'pin'
  } else {
    // 设置登录帐号
    jaq.push(['erp_account', erpPin])
  }
  jaq.push(['account_type', accountType])
  // 开启自动化曝光开关
  jaq.push(['auto_exposure', 'true'])
  // 单页应用必填
  jaq.push(['anchorpvflag', 'true'])
  // 锚点做路由的应用，如想要把 # 之后的锚点部分替换成 requestURI 进行上报
  jaq.push(['anchorToUri', '1']);

  (function () {
    const ja = document.createElement('script')
    ja.type = 'text/javascript'
    ja.async = true
    ja.src = '//wl.jd.com/joya.js'
    const s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(ja, s)
  })()
}
