import * as React from 'react';
import {LoginContext} from './app';
import {createGradeStore, gradeStore, GradingStatus} from './gradestore';
import {GradeItem} from './moodleapi';

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
  let [touchActive,setTouchActive] = React.useState<boolean>(false);
  let [touchInitialX,setTouchInitialX] = React.useState<number>(0);
  let [touchOffsetX,setTouchOffsetX] = React.useState<number>(0);

  let ontouchstart = (event: React.TouchEvent<HTMLDivElement>) => {
    if(event.touches.length == 1){
      setTouchActive(true);
      setTouchInitialX(event.touches[0].clientX);
    } else {
      setTouchActive(false);
      setTouchInitialX(0);
    }
  }

  let ontouchmove = (event: React.TouchEvent) => {
    if(event.touches.length == 1) {
      setTouchOffsetX(event.touches[0].clientX - touchInitialX);
    }
  }

  let ontouchend = (event: React.TouchEvent) => {
    setTouchOffsetX(0);
    setTouchActive(false);
    if(touchOffsetX > 10){
      props.onChange(props.diff+1);
    } else {
      if(touchOffsetX<10) {
        props.onChange(props.diff-1);
      }
    }

    setTouchInitialX(0);
  }

  let color = (touchOffsetX == 0) ? "gray" : (touchOffsetX > 0? "green" : "red");
  return <div onTouchStart = {ontouchstart}
               onTouchMove = {ontouchmove}
                onTouchEnd = {ontouchend}
    style = {{backgroundColor:color, translate: Math.ceil(touchOffsetX/2)+"px 0px"}}>
    <div>{props.name}</div>
    <div>{props.diff}</div>
    <div>{props.value}</div>
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
  return <div>
    {gradeTypes.length>0?
      <select value={selectedGrade}
        onChange={(e)=>changeGrade(parseInt(e.target.value))}>
        {gradeTypes.map(gradetype=>
        <option key={gradetype.id} value={gradetype.id}>
          {gradetype.itemname}
        </option>)}
      </select>:""}
    {(selectedGrade!==0)?
        gradingStatus.map((item) => <GradeUser name={item.name}
                                     value={item.value}
                                      diff={item.diff}
                                      onChange={()=>{}}/>):""}
  </div>
}
