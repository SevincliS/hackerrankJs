const INITIAL_STATE = {
  current: {},
  problems: [],
  learnedProblemIds: [],
  currentProblem: {},
  currentProblemType: '',
};

const problemsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_PROBLEMS':
      return { ...state, problems: action.problems }
    case 'SET_LEARNED_PROBLEM_IDS':
      return { ...state, learnedProblemIds: action.ids}
    case 'SET_CURRENT_PROBLEM':
      return { ...state, currentProblem: action.problem }
    case 'SET_CURRENT_PROBLEM_TYPE':
      return { ...state, currentProblemType: action.problemType }
    default:
      return state
  }
};


export default problemsReducer;