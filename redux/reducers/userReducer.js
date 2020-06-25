const INITIAL_STATE = {
  name: '',
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.user;
    case 'RESET_USER':
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default userReducer;
