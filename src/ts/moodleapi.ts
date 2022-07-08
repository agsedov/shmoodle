import * as qs from 'qs';

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
export async function wsRequest(token: string, wsfunction: string, params: Object){
  let link=(window as any).siteurl + "/webservice/rest/server.php";
  let postBody = {wstoken:token,wsfunction:wsfunction,moodlewsrestformat:"json"};
  postBody = Object.assign(postBody, params);
  let encoded = qs.stringify(postBody);//JSON.stringify(postBody);//new URLSearchParams(postBody);
  let response = await fetch(link,
    {
      method: "POST",
      body: encoded.toString() ,
      headers: {
        'content-Type' : 'application/x-www-form-urlencoded'
      }
    });
  let json = await response.json();
  if(json && json.exception) {
    if(json.errorcode == "invalidtoken"){
      throw "logout";
    }else{
      console.warn("requestParams:", postBody);
      console.warn("error code:", json.errorcode);
      console.warn("error message:", json.message);
    }
  }
  return json;
}


export const getSiteInfo = async(token:string,
                                 callback: any,
                                 reject: any) => {
  wsRequest(token, "core_webservice_get_site_info",{}).then(callback,reject);
}
 /**
     * Update a grade item and, optionally, student grades
     *
     *  string $source       The source of the grade update
     *  int $courseid        The course id
     *  string $component    Component name
     * @ param  int $activityid      The activity id
     * int $itemnumber      The item number
     * array  $grades      Array of grades
     * array  $itemdetails Array of item details
     * int                  A status flag
     * @since Moodle 2.7
  */
export const updateGrades = async(courseid:number,
                      // itemnumber:number,
                       activityid:number,
                            token:string,
                           grades:Array<any>,
                         callback:any) => {
  let data = {courseid,itemnumber:0,/*activityid,*/ grades};
  let response = await wsRequest(token,"core_grade_update_grades",data);
  callback(response as Array<MoodleCourseInfo>);
}


export const courseListRequest = async (token: string, userid: Number,
  callback: (response:Array<MoodleCourseInfo>)=>any,
  reject: any) => {
    wsRequest(token,"core_enrol_get_users_courses",{userid}).then(callback,reject);
    //callback(response as Array<MoodleCourseInfo>);
}

export const gradeItemsRequest = async (token: string,
                                        courseid: number,
                                        callback: (response:any)=>any) => {
  let response = await wsRequest(token,"gradereport_user_get_grade_items", {courseid});
  callback(response);
}
export const groupsRequest = async (token: string,
                                    courseid: number,
                                    callback: (response:any)=>any) => {
  let response = await wsRequest(token,"core_group_get_course_groups", {courseid});
  callback(response);
}

export const assignmentsRequest = async (token: string,
                                         courseid: number,
                                         callback: (response:any)=>any) => {
  let response = await wsRequest(token,"mod_assign_get_assignments", {courseids:[courseid]});
  callback(response);
}

export const usersRequest = async (token: string,
  courseid: number,
  groupid:number,
  callback: (response:any)=>any) => {
    let params = {courseid: courseid} as any;
    if(groupid!=0){
      params.groupid = groupid;
    }
  let response = await wsRequest(token,"core_enrol_get_enrolled_users", params);
  callback(response);
}

export const assignmentGradesRequest = async (token: string,
                                              assignmentid: number,
                                              callback: (response:any)=>any) => {
  let response = await wsRequest(token,"mod_assign_get_grades", {assignmentids:[assignmentid]});
  callback(response);
}

interface SaveGrade {
  userid : number,
    grade: string,
    attemptnumber: number,
    addattempt: number,
    workflowstate: string
}

export const assignmentSaveGradesRequest = async (token: string,
  assignmentid: number,
  gradeArray: Array<SaveGrade>,
  callback: (response:any)=>any) => {
    let requestParams = {assignmentid, applytoall: 0, grades: gradeArray };
  let response = await wsRequest(token,"mod_assign_save_grades", requestParams);
  callback(response);
}
