import {fireEvent, render, screen, waitFor} from "@testing-library/react"
import { describe, it } from "vitest"
import React from "react"
import SignIn from "../pages/authentication/SignIn"
import { BrowserRouter } from "react-router-dom"
describe('Test sign in form', () => {
    it('should button in sign in form', () => {
        render(<BrowserRouter>
        <SignIn />
        </BrowserRouter>);
        let title = screen.getByRole('button', {
            name:'Sign In'
        })
        expect(title).toBeInTheDocument()
    })
    it('should email input in form', () => {
        render(<BrowserRouter>
        <SignIn />
        </BrowserRouter>);
        let input = screen.getByPlaceholderText('Email')
        expect(input).toBeInTheDocument()
    })
    it('should password input in form', () => {
        render(<BrowserRouter>
        <SignIn />
        </BrowserRouter>);
        let input = screen.getByPlaceholderText('Password')
        expect(input).toBeInTheDocument()
    })
    it('should validate when email is empty', () => {
        const {container}=render(<BrowserRouter>
        <SignIn />
        </BrowserRouter>);
        let form = screen.getByTestId('sign-in-form')
        fireEvent.submit(form)
        let emailError = screen.getByTestId('email-validate')
        expect(emailError).toBeInTheDocument()
    })
    it('should validate when password is empty', () => {
        const {container}=render(<BrowserRouter>
        <SignIn />
        </BrowserRouter>);
        let form = screen.getByTestId('sign-in-form')
        fireEvent.submit(form)
        let passwordError = screen.getByTestId('password-validate')
        expect(passwordError).toBeInTheDocument()
    })
    it('should show wrong password message', async () => {
        const {container}=render(<BrowserRouter>
        <SignIn />
        </BrowserRouter>);
        let form = screen.getByTestId('sign-in-form')
        let emailInput = screen.getByPlaceholderText('Email')
        let passwordInput = screen.getByPlaceholderText('Password')
        fireEvent.change(emailInput, {
            target: {value: 'abc@gmail.com'}
        })
        fireEvent.change(passwordInput, {
            target: {value: 'abc123'}
        })
        fireEvent.submit(form)
        console.log("🚀 ===== it ===== emailInput", emailInput?.value);
        console.log("🚀 ===== it ===== passwordInput", passwordInput?.value);
        // let passwordError = screen.getByTestId('unauthentication')
        // expect(passwordError).toBe('Wrong password')
        await waitFor(() => {
        let passwordError = screen.getByTestId('unauthentication')
        expect(passwordError.textContent).toBe('Wrong password')
        })
    })
    it('should show user not found message', async () => {
        const {container}=render(<BrowserRouter>
        <SignIn />
        </BrowserRouter>);
        let form = screen.getByTestId('sign-in-form')
        let emailInput = screen.getByPlaceholderText('Email')
        let passwordInput = screen.getByPlaceholderText('Password')
        fireEvent.change(emailInput, {
            target: {value: 'klsjdfuu@gmail.com'}
        })
        fireEvent.change(passwordInput, {
            target: {value: 'abc123'}
        })
        fireEvent.submit(form)
        console.log("🚀 ===== it ===== emailInput", emailInput?.value);
        console.log("🚀 ===== it ===== passwordInput", passwordInput?.value);
        // let passwordError = screen.getByTestId('unauthentication')
        // expect(passwordError).toBe('Wrong password')
        await waitFor(() => {
        let passwordError = screen.getByTestId('unauthentication')
        expect(passwordError.textContent).toBe('User not found')
        })
    })
})