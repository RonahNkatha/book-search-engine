import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import Auth from '../utils/auth';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';


const SignupForm = ({}: { handleModalClose: () => void }) => {
  
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: ''}); 
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [addUser] = useMutation(ADD_USER);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  try {
    console.log('Attempting to add user with data:', userFormData);
    const { data } = await addUser({
      variables: {...userFormData}
    });
    console.log('Response from addUser mutation:', data);

    
    if (data && data.addUser && data.addUser.token) {
      Auth.login(data.addUser.token);
      console.log('Sign up successful');
    } else {
      console.error('Unexpected response structure:', data);
      setShowAlert(true);
    }

    
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error details:', err.message);
      if ('graphQLErrors' in err) {
        console.error('GraphQL Errors:', err.graphQLErrors);
      }
      if ('networkError' in err && err.networkError) {
        console.error('Network error details:', err.networkError);
      }
    }
    setShowAlert(true);
  }
  
  
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
