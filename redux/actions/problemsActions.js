const setProblems = (problems) => ({
  type: 'SET_PROBLEMS',
  problems,
});

const setLearnedProblemIds = (ids) => ({
  type:'SET_LEARNED_PROBLEM_IDS',
  ids,  
});

const setCurrentProblem = (problem) => ({
  type: 'SET_CURRENT_PROBLEM',
  problem,
});

const setCurrentProblemType = (problemType) => ({
  type: 'SET_CURRENT_PROBLEM_TYPE',
  problemType,
});


export {
  setProblems,
  setLearnedProblemIds,
  setCurrentProblem,  
  setCurrentProblemType,
}