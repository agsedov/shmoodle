export interface MoodleCourseInfo {
  id: number,
  shortname: string,
  fullname: string,
  enrolledusercount: number
}
export interface UserGrade {
  userid: number,
  userfullname: string,
  gradeitems: Array<GradeItem>
}
export interface GradeItem {
  id: number,
  itemtype:"mod"|"manual"|"category",
  itemname:string,
  grademax: number,
  grademin: number,
  graderaw: number,
  gradeformatted: string
}
export async function wsRequest(token: string, wsfunction: string, body: string){
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

export const courseListRequest = async (token: string,
                                        callback: (response:Array<MoodleCourseInfo>)=>any) => {
  let response = await wsRequest(token,"core_enrol_get_users_courses","userid=5090");
  callback(response as Array<MoodleCourseInfo>);
}

export const gradeItemsRequest = async (token: string,
                                        courseid: number,
                                        callback: (response:any)=>any) => {
  let response = await wsRequest(token,"gradereport_user_get_grade_items", "courseid="+courseid);
  callback(response);
}
export const groupsRequest = async (token: string,
                                    courseid: number,
                                    callback: (response:any)=>any) => {
  let response = await wsRequest(token,"core_group_get_course_groups", "courseid="+courseid);
  callback(response);
}




