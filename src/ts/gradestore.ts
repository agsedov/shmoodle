import {GradeItem, assignmentsRequest, gradeItemsRequest, UserGrade, assignmentGradesRequest, usersRequest} from './moodleapi';

export interface GradingStatus {name: string,
    id: number,
    value:number,
    diff:number,
    image:string
};

export interface Assignment {
  id: number,
  grade: number,
  name: string
}

export interface Grade {
  grade: string,
  userid: number
}
export interface Group {
  id: number,
  name: string
}

export interface User {
  id: number,
  fullname: string,
  profileimageurl: string,
  groups: Array<Group>
}

export class GradeStore {
  courseid: number;
  token: string;
  usergrades: Array<UserGrade>;
  gradeTypes: Array<GradeItem>;
  assignments: Array<Assignment>;
  grades: Array<Grade>;
  users: Array<User>;
  constructor(token: string, courseid: number) {
    this.courseid = courseid;
    this.token = token;
  }

  fetchAssignments(callback:()=>any){
    assignmentsRequest(this.token,this.courseid, (response)=> {
      let course = response.courses[0];
      this.assignments = course.assignments as Array<Assignment>;
      callback();
    });
  }

  fetchGrades(assignmentid:number,  callback:()=>any){
    assignmentGradesRequest(this.token, assignmentid, (response) => {
      console.log(response);
      if(response.assignments.length>0){
        this.grades = response.assignments[0].grades;
      }else {
        this.grades = [];
      }
      callback();
    });
  }

  fetchUsers(groupid: number) {
    usersRequest(this.token,this.courseid,groupid, (response) => {
      this.users = response;
    });
  }

  userIsInGroup(user: User, groupId: number){
    for(let group of user.groups) {
      if(group.id==groupId){
        return true;
      }
    }
    return false;
  }

  getUsersByGroup(groupId: number) {
    return this.users.filter(user=>this.userIsInGroup(user,groupId));
  }

  getAssignments() {
    return this.assignments;
  }

  getUserGrade(userId: number) : number {
    for(let grade of this.grades){
      if(grade.userid == userId) {
        return Number.parseFloat(grade.grade);
      }
    };
    return 0;
  }

  getUsers(){
    return this.users;
  }
  getGradeStatus(gradeId: number, groupid: number) {
    let users : Array<User> = [];
    if(groupid !== 0) {
      users = this.getUsersByGroup(groupid);
    } else {
      users = this.getUsers();
    }
    if(!users){
      return [];
    }
    return users.map(user=> {
      let result = {name: user.fullname,
        id: user.id,
        image: user.profileimageurl,
        value:this.getUserGrade(user.id),
        diff:0};
      return result;
    });
    /*return this.usergrades.map(usergrade => {
      usergrade.gradeitems.forEach((item)=> {
        if(item.id == gradeId) {
          result.value = item.graderaw;
        }
      });
      return result;
    });*/
  }

  update(groupId:number, afterUpdate: ()=>any) {
    this.fetchUsers(groupId);
    this.fetchAssignments(afterUpdate);
  }
}

export let gradeStore: GradeStore|null = null;

export const createGradeStore = (token: string, courseid: number) => {
  gradeStore = new GradeStore(token, courseid);
  return gradeStore;
}

