const KEY = 'heimamm_token';
// 保存token
const settoken = (Token) => {
  localStorage.setItem(KEY, Token);
};
// 获取token
const gettoken = () => {
  localStorage.getItem(KEY);
};
// 删除token
const removetoken = () => {
  localStorage.removeItem(KEY);
};
// 导出
export { settoken, gettoken, removetoken };
