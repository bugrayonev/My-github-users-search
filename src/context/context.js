import React, { useState, useEffect, createContext, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [error, setError] = useState({ show: false, msg: "" });

  //request loading
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  /*     const searchGithubUser = async (user)=> {
       toggleError(false)
      // setLoading

      setIsLoading(true)
      const response = await axios(`${rootUrl}/users/${user}`).catch((err)=> console.log(err))
      if(response){
        setGithubUser(response.data)
        const {login,followers_url} = response.data
        // repos
        axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response)=> setRepos(response.data))
        // followers
        axios(`${followers_url}?per_page=100`).then((response)=> setFollowers(response.data))
        // https://api.github.com/users/john-smilga/repos?per_page=100
        // https://api.github.com/users/john-smilga/followers
      }
     
      else{
        toggleError(true,"there is no user with that username")
      }
      checkRequests()
      setIsLoading(false)
    } */

  //  allSettled()  // butun bilgiler aynı anda gelsin istiyoruz
  const searchGithubUser = async (user) => {
    toggleError(false);
    // setLoading

    setIsLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          /* setRepos(results[0].value.data);
        setFollowers(results[1].value.data); */

          const [repos, followers] = results;
          const status = "fulfilled";

          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        }).catch((err)=> {
          console.log(err);
        /*   setIsLoading(false)
          toggleError(true,err) */
        })
       
        
    } else {
      toggleError(true, "there is no user with that username");
    }
    checkRequests();
    setIsLoading(false);
  };

  //check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        // remaining = 0 bu deegere eşit olunca toggle errordaki yazıı geliyor
        setRequests(remaining);
        if (remaining === 0) {
          // throw an error
          toggleError(true, "sorry, you have exceeded your hourly rate limit!");
        }
      })
      .catch((err) => console.log(err));
  };
  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }

  // error

  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export const useGlobalGithub = () => {
  return useContext(GithubContext);
};

export default GithubProvider;
