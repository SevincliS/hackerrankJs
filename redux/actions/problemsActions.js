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

const addToLearnedProblemIds = problemId => ({
  type: 'ADD_TO_LEARNED_PROBLEM_IDS',
  problemId,
})
const removeFromLearnedProblemIds = problemId => ({
  type: 'REMOVE_FROM_LEARNED_PROBLEM_IDS',
  problemId,
})

export {
  setProblems,
  setLearnedProblemIds,
  setCurrentProblem,  
  setCurrentProblemType,
  addToLearnedProblemIds,
  removeFromLearnedProblemIds
}