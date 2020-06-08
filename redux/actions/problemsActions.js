const setProblems = (problems) => ({
  type: 'SET_PROBLEMS',
  problems,
});
const setCurrentProblem = (problem) => ({
  type: 'SET_CURRENT_PROBLEM',
  problem,
});


export {
  setProblems,
  setCurrentProblem
}