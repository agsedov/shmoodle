import * as React from 'react';
import {gradeItemsRequest, groupsRequest,
        UserGrade, GradeItem} from './../moodleapi';
import {LoginContext} from './../app'

export interface GradeSelectorProps {
  changeActivity: any;
  courseid?: number;
}

function getGrades(token: string, courseid: number) {
    gradeItemsRequest(token, courseid, (response)=> {
      let usergrades = response.usergrades as Array<UserGrade>;
    });
}

interface GroupInfo{
  id: number,
  name: string
}

export function GradeSelector(props:GradeSelectorProps){
  let context = React.useContext(LoginContext);
  let [groupList,setGroupList] = React.useState<Array<GroupInfo>>([]);
  let [selectedGroup,setSelectedGroup] = React.useState<number>(0);
  if(!props.courseid) {
    return <p>No course id</p>;
  }
  React.useEffect(()=>{
    groupsRequest(context.moodleToken, props.courseid, (response) => {
      let grouplist = response.map((item: GroupInfo)=>{return {id: item.id,
                                                            name: item.name};});
      grouplist.unshift({id:0,name:"All students"});
      setGroupList(grouplist);
    });
  },[]);
  return <div>
    {(groupList.length==0)?"":
    <select value={selectedGroup}
            onChange={(e)=>setSelectedGroup(parseInt(e.target.value))}>
      {groupList.map(info=><option value={info.id}>{info.name}</option>)}
    </select>}

  </div>;
}