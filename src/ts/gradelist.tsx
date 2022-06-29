import * as React from 'react';
import {LoginContext} from './app';
import {createGradeStore, gradeStore, GradingStatus} from './gradestore';
import {GradeItem} from './moodleapi';
import styles from "./../css/main.module.css"
interface GradeListProps {
  groupId: number;
  courseid: number;
}

interface GradeUserProps {
  onChange: (newDiff: number) => any,
  name: string,
  value: number,
  diff: number
}
function GradeUser(props: GradeUserProps){
//  let [touchActive,setTouchActive] = React.useState<boolean>(false);
  let [touchInitialX,setTouchInitialX] = React.useState<number>(0);
  let [touchOffsetX,setTouchOffsetX] = React.useState<number>(0);
  let [touchInitialY,setTouchInitialY] =  React.useState<number>(0);
  let [touchOffsetY,setTouchOffsetY] = React.useState<number>(0);

  let ontouchstart = (event: React.TouchEvent<HTMLDivElement>) => {
    if(event.touches.length == 1){
//      setTouchActive(true);
      setTouchInitialY(event.touches[0].clientY);
      setTouchInitialX(event.touches[0].clientX);
    } else {
//      setTouchActive(false);
      setTouchInitialX(0);
      setTouchInitialY(0);
    }
  }

  let ontouchmove = (event: React.TouchEvent) => {
    if(event.touches.length == 1) {
      setTouchOffsetX(event.touches[0].clientX - touchInitialX);
      setTouchOffsetY(event.touches[0].clientY - touchInitialY);
    }
  }

  let touchResult = ()=> {
    if((touchOffsetX>20) && (Math.abs(touchOffsetY) < Math.abs(touchOffsetX)/2)) {
      return 1;
    }
    if((touchOffsetX<-20) && (Math.abs(touchOffsetY) < Math.abs(touchOffsetX)/2)) {
      return -1;
    }
    return 0;
  }
  let ontouchend = (event: React.TouchEvent) => {
    setTouchOffsetX(0);
    setTouchOffsetY(0);
//    setTouchActive(false);
    if(touchResult() > 0){
      props.onChange(props.diff+1);
    } else {
      if(touchResult()<0) {
        props.onChange(props.diff-1);
      }
    }

    setTouchInitialX(0);
    setTouchInitialY(0);
  }

  let color = (touchResult()==0) ? "gray" : (touchResult() > 0? "green" : "red");
  let diffcolor = (props.diff>0) ? "lime" : (props.diff<0 ? "pink" : "gray" );

  return <div onTouchStart = {ontouchstart}
               onTouchMove = {ontouchmove}
                onTouchEnd = {ontouchend}
    style = {{backgroundColor:color, translate: Math.ceil(touchOffsetX/2)+"px 0px"}}>
    <div className={styles.grade_user_name}>{props.name}</div>
    <div className={styles.grade_user_grades}>
      <div className={styles.grade_user_grade} style = {{color: diffcolor}}>{props.diff}</div>
      <div className={styles.grade_user_grade} >{props.value}</div>
    </div>
  </div>
}
export function GradeList(props: GradeListProps) {
  let context = React.useContext(LoginContext);
  let [gradeTypes,setGradeTypes] = React.useState<Array<GradeItem>>([]);
  let [selectedGrade, setSelectedGrade] = React.useState<number>(0);
  let [gradingStatus, setGradingStatus] = React.useState<Array<GradingStatus>>([]);
  React.useEffect(()=>{
    let gradeStore = createGradeStore(context.moodleToken, props.courseid);
    gradeStore.update(()=>{
      setGradeTypes(gradeStore.getGradeTypes());
    });
  },[]);
  let changeGrade = (gradeId: number) => {
    setSelectedGrade(gradeId);
    setGradingStatus(gradeStore.getGradeStatus(gradeId));
  }
  let changeDiff = (id:number, newDiff: number) => {
    setGradingStatus(gradingStatus.map(item=> {
      if(item.id==id) {
        item.diff = newDiff;
      }
      return item;
    }));
  }
  return <div>
    {gradeTypes.length>0?
      <select value={selectedGrade}
        onChange={(e)=>changeGrade(parseInt(e.target.value))}>
        {gradeTypes.map(gradetype=>
        <option key={gradetype.id} value={gradetype.id}>
          {gradetype.itemname}
        </option>)}
      </select>:""}
    <div className={styles.grade_user_container}>
    {(selectedGrade!==0)?
        gradingStatus.map((item) => <GradeUser name={item.name}
                                     value={item.value}
                                      diff={item.diff}
                                      onChange={(newDiff)=>{changeDiff(item.id,newDiff)}}/>):""}
    </div>
    </div>
}
