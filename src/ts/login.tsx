import * as React from "react";


function keyRequest(userName: string,password: string){
  let link = "https://moodle.uniyar.ac.ru/login/token.php?username="+userName+
    "&password="+ password + "&service=moodle_mobile_app";
  fetch(link).then(response => {
    console.log(response);
  });

}

export function Login(props: any){
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
    <button onClick={()=>keyRequest(userName,password)}>Log in</button>
  </div>);
}
