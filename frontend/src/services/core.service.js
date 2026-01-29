
// Search items with optional filters and pagination
const searchItems = (queryParams = "") => {
  let headers = {} 
  //status filtering is restricted to authenticated users
  if (queryParams.includes("status=")) {
    const token = localStorage.getItem("session_token")
    if (!token) {
      return Promise.reject("Please sign in to use the status filter.")
    }
    headers["x-authorization"] = token
  }
  return fetch(`http://localhost:3333/search${queryParams}`, { headers })
    .then((response) => {
      if (response.status === 200) {
        return response.json()
      } 
      else if (response.status === 400) {
        return response.json().then((body) => {
          throw body.error_message
        })
      } 
      else if (response.status === 401) {
        throw "Not logged in"
      }
      else {
        throw "Search failed"
      }
    })
    .then((resJson) => {
      return resJson
    })
    .catch((err) => {
      console.log("Search error:", err)
      return Promise.reject(err)
    })
}



// Fetch full details for a single item
const getSingleItem =( itemId) =>{
    return fetch (`http://localhost:3333/item/${itemId}`)
    .then((response) => {
       if(response.status ===200){
        return response.json();
       }
       else if(response.status === 400 || response.status ===404 ){
         return response.json().then((body) => {
          throw body.error_message;
        });
       }
       else{
        throw "Failed to fetch item";
       }
    })
    .then((resJson) =>{
        return resJson;
    })
    .catch((err)=> {
        console.log("Get item error:", err);
        return Promise.reject(err);
    })
};


// Create a new auction item (requires authentication)
const createItem =(itemData, token) => {
    return fetch (`http://localhost:3333/item`, {
       method: "POST",
       headers: {
        "Content-Type": "application/json",
        "x-authorization": token
       },
       body: JSON.stringify(itemData)
    })

    .then((response)=> {
        if(response.status ===201){
            return response.json();
        }
        else if (response.status === 400) {
               return response.json()
              .then((body) => {
                throw body.error_message;
              });
            } 
        else if (response.status === 401) {
                throw "Not authenticated";
            } 
        else {
                throw "Failed to create item";
            }
    })
    .then((resJson)=>{
        return resJson;
    })
    .catch((err) => {
        console.log("Create item error:", err);
        return Promise.reject(err);
    })
}


// Place a bid on an item (requires authentication)
const placeBid =(itemId, amount, token)=> {
  return fetch (`http://localhost:3333/item/${itemId}/bid`, {
       method: "POST",
       headers: {
        "Content-Type": "application/json",
        "x-authorization": token
       },
       body: JSON.stringify({amount})
    })

    .then((response) =>{
         if (response.status === 201) {
                return;
            } 
            else if (response.status === 400 || response.status === 403 || response.status === 404) {
                return response.json() //backend sends { error_message: "..." }
                  .then((body) => {
                    throw body.error_message;
                  });
         } 
         else if(response.status ===401){
               throw "Not logged in";
            } else {
                throw "Failed to place bid";
            }
    })

    .catch((err) => {
    console.log("Place bid error:", err);
    return Promise.reject(err);
  });
}


// Fetch bid history for an item
const getBidHistory =(itemId)=> {
 return fetch (`http://localhost:3333/item/${itemId}/bid`)
 .then((response)=> {
    if(response.status ===200){
        return response.json();
    }
    else if (response.status === 400 || response.status === 404) {
        return response.json()
        .then((body) => {
            throw body.error_message;
        });
    } 
    else {
        throw "Failed to fetch bid history";
    }
 })
 .then((resJson)=>{
    return resJson;
 })
 .catch((err)=> {
    console.log("Bid history error:", err);
    return Promise.reject(err);
 })
}


// Export core auction related API calls
export const coreService = {
    searchItems,
    getSingleItem,
    createItem,
    getBidHistory,
    placeBid
}
