import * as React from 'react';
import {Courses} from './activities/courses';
import {Grader} from  './activities/grader';

export type Activity = "courses" | "grader";


export function Layout(props: any) {
  let [activity, setActivity] = React.useState<Activity>("courses");
  let [activityProps, setActivityProps] = React.useState<Object>({});

  const changeActivity = (name: Activity, props:Object) => {
    setActivity(name);
    setActivityProps(props);
  }
  if(activity == "courses"){
    return <Courses {...activityProps} changeActivity={changeActivity}/>;
  };
  if(activity == "grader"){
    return <Grader  {...activityProps} changeActivity={changeActivity}/>;
  }
  return <h4>Something is wrong</h4>;
}
