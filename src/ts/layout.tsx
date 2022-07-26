import * as React from 'react';
import {Courses} from './activities/courses';
import {GradeSelector} from  './activities/gradeselector';

export type Activity = "courses" | "grader";
export let LayoutContext = React.createContext(undefined);

export function Layout(props: any) {
  let [activity, setActivity] = React.useState<Activity>("courses");
  let [activityProps, setActivityProps] = React.useState<Object>({});

  const changeActivity = (name: Activity, props:Object) => {
    setActivity(name);
    setActivityProps(props);
  }
  const Content = () => {
    if(activity == "courses"){
      return <Courses {...activityProps} changeActivity={changeActivity}/>;
    };
    if(activity == "grader"){
      return <GradeSelector  {...activityProps} changeActivity={changeActivity}/>;
    }
    return <h4>Something is wrong</h4>;
  }
  return <LayoutContext.Provider value = {{changeActivity}}>
      <Content/>
  </LayoutContext.Provider>
}
