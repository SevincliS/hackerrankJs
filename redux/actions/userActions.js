const setUser = (user) => ({
  type: 'SET_USER',
  user,
});


const resetUser = () => ({
  type: 'RESET_USER',
});


export {
  setUser,
  resetUser,
}