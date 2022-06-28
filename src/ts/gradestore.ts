import {GradeItem, gradeItemsRequest, UserGrade} from './moodleapi';

export interface GradingStatus {name: string,
    id: number,
    value:number,
    diff:number
};

export class GradeStore {
  courseid: number;
  token: string;
  usergrades: Array<UserGrade>;
  gradeTypes: Array<GradeItem>;
  constructor(token: string, courseid: number) {
    this.courseid = courseid;
    this.token = token;
  }
  getGradeTypes() {
    return this.gradeTypes;
  }
  getGradeStatus(gradeId: number) {
    return this.usergrades.map(usergrade => {
      let result = {name: usergrade.userfullname,
        id: usergrade.userid,
        value:0,
        diff:0};
      usergrade.gradeitems.forEach((item)=> {
        if(item.id == gradeId) {
          result.value = item.graderaw;
        }
      });
      return result;
    });
  }
  update(afterUpdate: ()=>any) {
    gradeItemsRequest(this.token, this.courseid, (response)=> {
      this.usergrades = response.usergrades as Array<UserGrade>;
      this.gradeTypes = this.usergrades[0].gradeitems.map((gradeitem: GradeItem) => {
        return {
          id: gradeitem.id,
          grademin: gradeitem.grademin,
          grademax: gradeitem.grademax,
          name: gradeitem.itemname,
          itemtype: gradeitem.itemtype,
          itemname: gradeitem.itemname,
          graderaw: 0,
          gradeformatted: ""
        };

      });
      afterUpdate();
    });
  }
}

export let gradeStore: GradeStore|null = null;

export const createGradeStore = (token: string, courseid: number) => {
  gradeStore = new GradeStore(token, courseid);
  return gradeStore;
}

