import React, {useState,useEffect,useContext} from 'react';
import {LoginContext} from './../app'
interface CoursesProps {
  changeActivity: any;
}

async function wsRequest(token: string, wsfunction: string, body: string){
  let link = "https://moodle.uniyar.ac.ru/webservice/rest/server.php";
  const postBody = "wstoken="+token+"&wsfunction="+wsfunction+
    "&moodlewsrestformat=json&"+body;
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


const courseListRequest = async (token: string, callback: (response:any)=>any) => {
  let response = await wsRequest(token,"core_enrol_get_users_courses","userid=5090");
  console.log(response);
  callback(response);
}
export function Courses(props: CoursesProps){
  const context = useContext(LoginContext);
  useEffect(()=>{
    //console.log(context);
    courseListRequest(context.moodleToken,()=>{console.log('got em')});
  },[]);


  return <div>
  <h1>Выбор курса</h1>

  </div>;
}
