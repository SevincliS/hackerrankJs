const INITIAL_STATE = {
  status: false,
};

const consentReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_CONSENT':
      return action.consent;
    default:
      return state;
  }
};

export default consentReducer;
