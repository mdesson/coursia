import React from 'react'
import Course from '../Components/Course'

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

  return (
    <div className="courseList">
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
