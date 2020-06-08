const INITIAL_STATE = {
  current: {},
  problems: [],
  currentProblem: {},
};

const problemsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_PROBLEMS':
      return {...state, problems: action.problems}
    case 'SET_CURRENT_PROBLEM':
      return {...state, currentProblem: action.problem}  
    default:
      return state
  }
};


export default problemsReducer;