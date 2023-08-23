import React from 'react';
import styles from './about.module.css';

function About() {
    return (
        <div className={styles.container}>
            <h1>About College Course Planner</h1>
            <p>The College Course Planner is specifically designed to assist students at the University of Michigan in orchestrating their academic journeys. This tool simplifies the intricate process of creating graduation plans based on credits acquired each semester and fulfilling degree requirements.</p>
            
            <h2>Features:</h2>
            <ul>
                <li>Add and delete classes with ease.</li>
                <li>Integrate spring semesters and courses taken prior to college enrollment.</li>
                <li>Comprehensively map out degree requirements.</li>
                <li>Store and retrieve your schedules securely by signing in.</li>
                <li>Instantly calculate the total credits accumulated.</li>
            </ul>

            <p>Built on a robust foundation of React, this project employs Bootstrap CSS for a seamless user interface and Firebase as its backend database.</p>
            
            <p>As of now, the planner is tailor-made for Computer Science majors at the University of Michigan. However, there's a vision to expand its horizons and encompass various other majors in the near future.</p>

            <p><strong>Developed by Rhea Uppal</strong></p>
        </div>
    )
}

export default About;
