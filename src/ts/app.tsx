import * as React from "react";
import {Login} from "./login";
import {Layout} from "./layout";
import {getSiteInfo} from "./moodleapi";
async function afterLogin(result: Promise<any>, successCallback: any) {
  let resultValue = await result;
  if(resultValue.errorcode) {
    return;
  }
  successCallback(resultValue);
}

export let LoginContext = React.createContext(undefined);
export function App(props:any) {
  let [loggedIn,setLoggedIn] = React.useState<boolean>(false);
  let [userId,setUserId] = React.useState<null|Number>(null);
  let [moodleToken,setMoodleToken]= React.useState<string>("");
  let [moodlePrivateToken,setMoodlePrivateToken] = React.useState<string>("");
  let successCallback = (tokenResponse: any) => {
    setMoodleToken(tokenResponse.token);
    localStorage.setItem("moodleToken", tokenResponse.token);
    setMoodlePrivateToken(tokenResponse.moodlePrivateToken);
    setLoggedIn(true);
  };
  React.useEffect(()=>{
    let token = localStorage.getItem("moodleToken");
    if(token){
      setMoodleToken(token);
      setLoggedIn(true);
    }
  },[]);

  if(!loggedIn){
    return <Login onLogin = {(result: any)=>{afterLogin(result,successCallback)}} />
  }
  if(userId == null) {
    getSiteInfo(moodleToken,(result: any)=>{setUserId(result.userid)},()=>{setLoggedIn(false);});
    return <div>loading...</div>;
  }
  return <LoginContext.Provider value={{moodleToken,moodlePrivateToken,setLoggedIn,setMoodleToken,userId}}>
  <Layout/>
  </LoginContext.Provider>;
}
