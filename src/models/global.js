

let theme1 = {
  primaryColor: "#00a8ff",
  bgclass: "bg",
  type: "theme1",
  textclass:"bgtext"
}, theme2 = {
  primaryColor: "#52ab36",
  bgclass: "lv",
  type: "theme2",
  textclass:"lvtext"

}

const GlobalModel = {
  namespace: 'global',
  state: {
    theme: theme2
  },
  effects: {
    *changetheme({ payload }, { call, put, select }) {//datalist
      let theme = yield select(state => state.global.theme);
      yield put({
        type: 'updateState',
        payload: {
          theme: theme.type == "theme1" ? theme2 : theme1
        },
      });
      return true
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default GlobalModel;
