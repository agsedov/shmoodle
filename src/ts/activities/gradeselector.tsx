import * as React from 'react';
import {groupsRequest} from './../moodleapi';
import {LoginContext} from './../app';
import {GradeList} from '../gradelist';
import styles from './../../css/main.module.css';

export interface GradeSelectorProps {
  changeActivity: any;
  courseid?: number;
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
    <select className={styles.select}
            value={selectedGroup}
            onChange={(e)=>setSelectedGroup(parseInt(e.target.value))}>
      {groupList.map(info=><option key={info.id} value={info.id}>{info.name}</option>)}
    </select>}
    <GradeList groupId={selectedGroup}
              courseid={props.courseid}
    /></div>;
}
