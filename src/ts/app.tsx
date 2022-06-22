import * as React from "react";
import {Login} from "./login";
import {Layout} from "./layout";
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
  let [moodleToken,setMoodleToken]= React.useState<string>("");
  let [moodlePrivateToken,setMoodlePrivateToken] = React.useState<string>("");
  let successCallback = (tokenResponse: any) => {
    setMoodleToken(tokenResponse.token);
    setMoodlePrivateToken(tokenResponse.moodlePrivateToken);
    setLoggedIn(true);
  };
  if(!loggedIn){
    return <Login onLogin = {(result: any)=>{afterLogin(result,successCallback)}} />
  }
  return <LoginContext.Provider value={{moodleToken,moodlePrivateToken}}>
  <Layout/>
  </LoginContext.Provider>;
}
