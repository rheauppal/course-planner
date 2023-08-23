import React, { useRef, FormEvent } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { auth } from './firebase';  // import auth from firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';
import { firestore } from './firebase';  // Import your firestore instance



export default function Signup() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();


    async function handleSignup(e: FormEvent) {  // define signup handler
        e.preventDefault();

        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        const passwordConfirm = passwordConfirmRef.current?.value;
        if (email && password) {
            if (!email || !password || !passwordConfirm) {
                // Handle missing values and return to stop the function execution.
                // You might want to update this to provide more detailed error information.
                console.error('Missing input');
                return;
            }
            if (password.length < 6) {
                console.error('Password should be at least 6 characters');
                return;
            }
            if (password !== passwordConfirm) {
                // Handle mismatching passwords and return to stop the function execution.
                console.error('Passwords do not match');
                return;
            }

            try {

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const userDocRef = doc(firestore, 'users', userCredential.user.uid);
                await setDoc(userDocRef, {
                    // ... any default values you want to set for the user document. For example:
                    email: email,
                    created: new Date(),
                    // Add other fields as needed.
                });
                navigate('/dashboard');
                // redirect to dashboard or show success message
            } catch {
                console.error('Error creating user', Error);
                // handle error
            }
        }
    }
    return (
        <>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Card style={{ width: "400px" }}>
                    <Card.Body>
                        <h2 className='text-center mb-4'>Sign Up</h2>
                        <Form onSubmit={handleSignup}>
                            <Form.Group id='email'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type='email' ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id='password'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' ref={passwordRef} required />
                            </Form.Group>
                            <Form.Group id='password-conf'>
                                <Form.Label>Password Confirmation</Form.Label>
                                <Form.Control type='password' ref={passwordConfirmRef} required />
                            </Form.Group>
                            <Button className="w-100 mt-3 " type='submit'>Sign Up</Button>
                        </Form>
                        <div className='w-100 text-center mt-2'>
                            Already have an account? <Link to="/login">Login</Link>
                        </div>
                    </Card.Body>

                </Card>
            </div>

        </>
    )
}
