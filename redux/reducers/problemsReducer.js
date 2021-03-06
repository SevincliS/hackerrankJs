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
      return {...state, problems: action.problems};
    case 'SET_LEARNED_PROBLEM_IDS':
      return {...state, learnedProblemIds: action.ids};
    case 'SET_CURRENT_PROBLEM':
      return {...state, currentProblem: action.problem};
    case 'SET_CURRENT_PROBLEM_TYPE':
      return {...state, currentProblemType: action.problemType};
    case 'ADD_TO_LEARNED_PROBLEM_IDS':
      return {
        ...state,
        learnedProblemIds: [...state.learnedProblemIds, action.problemId],
      };
    case 'REMOVE_FROM_LEARNED_PROBLEM_IDS':
      return {
        ...state,
        learnedProblemIds: state.learnedProblemIds.filter(
          id => id !== action.problemId,
        ),
      };
    default:
      return state;
  }
};

export default problemsReducer;
