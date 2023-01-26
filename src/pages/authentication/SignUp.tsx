/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { ReactElement, ReactNode, useEffect } from 'react';
import { app, db, firestore } from '../../utils/firebase';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().required('Email is required'),
  password: Yup.string().required('Password is required'),
});
interface IForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
const SignUp = (): ReactElement => {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const navigate = useNavigate();
  useEffect(() => {
    const handleStoreUser = async () => {
      if (user != null) {
        await setDoc(doc(firestore, 'users', user?.user?.uid), {
          email: user?.user?.email,
          authentication_uid: user?.user?.uid,
          rooms: [],
        });
        navigate('/');
        console.log('====user====', user);
      }
    };
    handleStoreUser();
  }, [user]);
  const onSubmit = async (values: IForm) => {
    const { email, password } = values;
    await createUserWithEmailAndPassword(email, password);
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
    resolver: yupResolver(SIGN_UP_SCHEMA),
  });

  return (
    <Stack>
      <Card sx={{ width: '40vw' }}>
        <CardHeader title="Sign Up" />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
              direction="column"
              spacing={2}
            >
              <Stack
                direction="row"
                spacing={2}
              >
                <Controller
                  control={control}
                  name="first_name"
                  render={({ field }) => (
                    <TextField
                      placeholder="First Name"
                      label="First Name"
                      error={Boolean(errors?.first_name)}
                      helperText={
                        Boolean(errors?.first_name) &&
                        errors?.first_name?.message
                      }
                      {...field}
                      sx={{ flex: 1 }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="last_name"
                  render={({ field }) => (
                    <TextField
                      placeholder="Last Name"
                      label="Last Name"
                      error={Boolean(errors?.last_name)}
                      helperText={
                        Boolean(errors?.last_name) && errors?.last_name?.message
                      }
                      {...field}
                      sx={{ flex: 1 }}
                    />
                  )}
                />
              </Stack>
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
                loading={loading}
                variant="contained"
                type="submit"
              >
                Register
              </LoadingButton>
              <Link to="/auth/sign-in">Already have an account? Sign in</Link>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default SignUp;
