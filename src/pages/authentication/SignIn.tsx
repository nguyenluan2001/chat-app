/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { ReactElement, ReactNode } from 'react';
import { app } from '../../utils/firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import {
  Stack,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const auth = getAuth(app);
const SIGN_UP_SCHEMA = Yup.object().shape({
  email: Yup.string().required('Email is required'),
  password: Yup.string().required('Password is required'),
});
interface IForm {
  email: string;
  password: string;
}
const SignIn = (): ReactElement => {
  const navigate = useNavigate();
  const onSubmit = async (values: IForm) => {
    const { email, password } = values;
    console.log('values', values);
    const response = await signInWithEmailAndPassword(auth, email, password);
    console.log('response', response);
    navigate('/');
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(SIGN_UP_SCHEMA),
  });

  return (
    <Stack>
      <Card sx={{ width: '40vw' }}>
        <CardHeader title="Sign In"></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
              direction="column"
              spacing={2}
            >
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <TextField
                    placeholder="Email"
                    label="Email"
                    type="email"
                    fullWidth={true}
                    error={Boolean(errors?.email)}
                    helperText={
                      Boolean(errors?.email) && errors?.email?.message
                    }
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <TextField
                    placeholder="Password"
                    label="Password"
                    type="password"
                    fullWidth={true}
                    error={Boolean(errors?.password)}
                    helperText={
                      Boolean(errors?.password) && errors?.password?.message
                    }
                    {...field}
                  />
                )}
              />
              <LoadingButton
                variant="contained"
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                Sign In
              </LoadingButton>
              <Link to="/auth/sign-up">Don't have account? Sign up</Link>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default SignIn;
