// libraries
import React from 'react'
import axios from 'axios'

// config file
import config from '../config'

// comonents
import Course from '../Components/Course'

const getCourses = async () => await axios.get(`${config.apiUrl}/courses`)

const Courses = () => {
  const testCourse = {
    code: 'COMP 346',
    name: 'Operating Systems',
    credits: 3,
    description:
      'Fundamentals of operating system functionalities, design and implementation. Multiprogramming: processes and threads, context switching, queuing models and scheduling. Interprocess communication and synchronization. Principles of concurrency. Synchronization primitives. Deadlock detection and recovery, prevention and avoidance schemes. Memory management. Device management. File systems. Protection models and schemes. Lectures: three hours per week. Tutorial: one hour per week. Laboratory: two hours per week.Prerequisite: COMP 228 or SOEN 228; COMP 352.NOTE: Students who have received credit for COEN 346 may not take this course for credit.',
    prerequisites: ['COMP 202, COMP 204'],
    equivalencies: ['SOEN 201'],
    components: ['LAB', 'LEC', 'TUT']
  }

  const courses = getCourses()

  return (
    <div className="courseList">
      {getCourses().then(courses => courses.map(course => <div key={course._id}>{course.name}</div>))}
      <Course {...testCourse} />
      <Course {...testCourse} />
      <Course {...testCourse} />
      <Course {...testCourse} />
      <Course {...testCourse} />
      <Course {...testCourse} />
      <Course {...testCourse} />
    </div>
  )
}

export default Courses
