const INITIAL_STATE = {
  name: "",
  id: "",
};

const userReducer = (state = INITIAL_STATE, action) => {
  console.log({ state })
  console.log({ action })
  switch (action.type) {
    case "SET_USER":
      return { ...state, ...action.user };
    default:
      return state
  }
};


export default userReducer;