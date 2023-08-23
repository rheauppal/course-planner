import React from 'react';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className={styles.homeContainer}>
            <div className={styles.title}>College Course Planner</div>
            <div className={styles.features}>
                <p>Plan your academic journey.</p>
                <p>Ensure you meet all graduation requirements.</p>
                <p>Intuitive course addition and management.</p>
                <p>Comprehensive mapping of degree requirements.</p>
            </div>
           

            <div className={styles.buttonContainer}>
                <Link to="/login">
                    <button className={styles.button}>
                        Sign Up
                    </button>
                </Link>

                <Link to="/dashboard" onClick={() => alert('To store your schedule you should sign up first')}>
                    <button className={styles.button}>
                        Demo
                    </button>
                </Link>
            </div>

        </div>
    )
}

export default Home;
