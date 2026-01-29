// Register a new user account
const signUp = (userData) => {
  return fetch(`http://localhost:3333/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else if (response.status === 400) {
        return response.json().then((body) => {
          throw body.error_message;
        });
      } else {
        throw "Registration failed";
      }
    })
    .then((resJson) => {
      return resJson;
    })
    .catch((err) => {
      console.log("Register error:", err);
      return Promise.reject(err);
    });
};


// Authenticate user and store session details
const signIn = (email, password) => {
  return fetch(`http://localhost:3333/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ "email":email,"password": password })
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 400) {
        return response.json().then((body) => {    // backend sends { error_message: ".." }
          throw body.error_message;
        });
      } else {
        throw "Something went wrong";
      }
    })
    .then((resJson) => {
      localStorage.setItem("user_id", resJson.user_id)
      localStorage.setItem("session_token", resJson.session_token)
      return resJson;
    })
    .catch((err) => {
      console.log("Login error:", err);
      return Promise.reject(err);
    });
};


// Log out the current user and clear local session data
const signOut = () => {
  return fetch(`http://localhost:3333/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-authorization": localStorage.getItem("session_token")
    }
  })
    .then((response) => {
      if (response.status === 200) {
        localStorage.removeItem("user_id")
        localStorage.removeItem("session_token")
        return response.json();
      } else if (response.status === 401) {
        throw "Not logged in";
      } else {
        throw "Logout failed";
      }
    })
    .then((resJson) => {
      return resJson;
    })
    .catch((err) => {
      console.log("Logout error:", err);
      return Promise.reject(err);
    });
};


// Fetch public or private profile data for a user
const getProfile = (userId) => {
  return fetch(`http://localhost:3333/users/${userId}`)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 400 || response.status === 404) {
        return response.json().then((body) => { 
          throw body.error_message;
        });
      } else {
        throw "Failed to fetch profile";
      }
    })
    .then((resJson) => {
      return resJson;
    })
    .catch((err) => {
      console.log("Profile error:", err);
      return Promise.reject(err);
    });
};

// Export user related API calls
export const userService = {
  signUp,
  signIn,
  signOut,
  getProfile
};
