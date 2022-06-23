import React, {useState,useEffect,useContext} from 'react';
import {MoodleCourseInfo,courseListRequest} from './../moodleapi';
import {LoginContext} from './../app'

interface CoursesProps {
  changeActivity: any;
}

export function Courses(props: CoursesProps){
  const context = useContext(LoginContext);
  const gotCourses = (response: Array<MoodleCourseInfo>)=> {
    setCourseList(response);
  }
  let [courseList,setCourseList] = React.useState<Array<MoodleCourseInfo>>([]);
  const goToCourse = (id: number) => {
    return () => {
      props.changeActivity('grader',{courseid:id});
      console.log(id);
    }
  }

  useEffect(()=>{
    courseListRequest(context.moodleToken,gotCourses);
  },[]);


  return <div>
  <h1>Выбор курса</h1>
    <div>
      {courseList.map((course: MoodleCourseInfo)=>{
        return <li key={'courselink'+course.id}>
          <h6>
            <a onClick={goToCourse(course.id)}>
              {course.shortname}
            </a>
          </h6>
        </li>
      })}
    </div>
  </div>;
}
