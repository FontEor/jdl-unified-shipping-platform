// 跳转到登录页
export function toLogin () {
  console.log('tologin')
  window.location.href = `${process.env.VUE_APP_LOGIN_URL}?ReturnUrl=${encodeURIComponent(window.location.href)}`
}
export function logout () {
  toLogin()
}

const SOURCE = 'jdl_xietong'
function genBackUrl () {
  const url = `${window.location.origin}/${location.search}`
  return encodeURIComponent(url)
}

export function loginPageUrl () {
  return `${
    process.env.VUE_APP_PASSPORT_URL
  }/common/loginPage?from=${SOURCE}&regTag=2&btnTag=de7eb78e8689c38a&ReturnUrl=${
    genBackUrl()
  }`
}

export function registerPageUrl () {
  return `//${
    process.env.VUE_APP_REG_URL
  }/e/common/regPage?source=${SOURCE}&ReturnUrl=${
    genBackUrl()
  }`
}
