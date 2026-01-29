// Route guard that allows access only if the user is logged in

const ifAuthenticated =(to, from, next)=> {
    const loggedIn = localStorage.getItem('session_token');
    if(loggedIn) {
        next()
        return
    }
    next('/signin')
}

export default {
  ifAuthenticated
};
