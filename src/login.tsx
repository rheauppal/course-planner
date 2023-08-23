import React, { useRef, FormEvent } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { auth } from './firebase';  // import auth from firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    async function handleLogin(e: FormEvent) {  // define login handler
        e.preventDefault();

        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        if (!email || !password) {
            console.error('Missing input');
            return;
        }
        if (password.length < 6) {
            console.error('Password should be at least 6 characters');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
            // redirect to dashboard or show success message
        } catch (error) {
            console.error('Error logging in', error);
            // handle error
        }
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Card style={{ width: "400px" }}>
                    <Card.Body>
                        <h2 className='text-center mb-4'>Log In</h2>
                        <Form onSubmit={handleLogin}>
                            <Form.Group id='email'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type='email' ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id='password'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' ref={passwordRef} required />
                            </Form.Group>
                            <Button className="w-100 mt-3" type='submit'>Log In</Button>
                        </Form>
                        <div className='w-100 text-center mt-2'>
                            Don't have an account? <Link to="/signup">Sign Up</Link>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}
