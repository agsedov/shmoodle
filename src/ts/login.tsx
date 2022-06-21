import * as React from "react";

interface LoginComponentProps{
  onLogin: any;
}


const keyRequest = async (username: string,password: string) => {
  let link = "https://moodle.uniyar.ac.ru/login/token.php?service=moodle_mobile_app";
  const postBody = "password="+ password+"&username="+username;
  let data = {password,username};
  let response = await fetch(link,
    {
      method: "POST",
      body: postBody,
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    });
  return response.json();
}

export function Login(props: LoginComponentProps){
  let [userName,setUserName] = React.useState<string>("");
  let [password,setPassword] = React.useState<string>("");
  return (
    <div>
      <label>User Name</label>
      <input id="name"
        onChange={ (event) => setUserName(event.target.value) }
        type="text"
        value={userName}>
          </input>
      <label>Password</label>
      <input
        onChange= { (event) => setPassword(event.target.value) }
        id="password"
        type="password"
        value={password}>
      </input>
      <button
        onClick={()=> {
          let response = keyRequest(userName,password);
          props.onLogin(response);
        }}>
        Log in
      </button>
  </div>);
}
