/*
 * Course selector
 */

import React, {useState,useEffect,useContext} from 'react';
import {MoodleCourseInfo,courseListRequest} from './../moodleapi';
import {LoginContext} from './../app';
import styles from './../../css/main.module.css';

interface CoursesProps {
  changeActivity: any;
}

export function Courses(props: CoursesProps){
  const context = useContext(LoginContext);
  const gotCourses = (response: Array<MoodleCourseInfo>)=> {
    setCourseList(response);
  }
  let [courseList,setCourseList] = useState<Array<MoodleCourseInfo>>([]);
  const goToCourse = (id: number) => {
    return () => {
      props.changeActivity('grader',{courseid:id});
    }
  }

  useEffect(()=>{
    courseListRequest(context.moodleToken,context.userId, gotCourses,()=>{
      context.setLoggedIn(false);
      context.setMoodleToken(null);
    });
  },[]);


  return <div>
  <h1>Выбор курса</h1>
    <div>
      {courseList.map((course: MoodleCourseInfo)=>{
        return <div onClick={goToCourse(course.id)} className={styles.list_element} key={'courselink'+course.id}>
              {course.shortname}
        </div>
      })}
    </div>
  </div>;
}
