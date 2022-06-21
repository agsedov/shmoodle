import * as React from "react";
import {Login} from "./login";

async function saveTokens(tokenResponse: any) {
  localStorage.setItem("moodlePrivateToken", tokenResponse.privatetoken);
  localStorage.setItem("moodleToken", tokenResponse.token);

}
async function afterLogin(result: Promise<any>, successCallback: any) {
  let resultValue = await result;
  if(resultValue.errorcode) {
    return;
  }
  successCallback(resultValue);
}

export function App(props:any) {
  let [loggedIn,setLoggedIn] = React.useState<boolean>(false);
  let [userToken,setUserToken] = React.useState<string>("");
  let successCallback = (tokenResponse: any) => {setLoggedIn(true); saveTokens(tokenResponse)};
  if(!loggedIn){
    return <Login onLogin = {(result: any)=>{afterLogin(result,successCallback)}} />
  }
}
