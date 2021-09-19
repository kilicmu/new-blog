import React, { Fragment, useEffect, useState } from "react";



const useAuth = () => {
    const [visitable, setVisitable] = useState(false);
    const validateToken = (token: string) => {
        return true
    }
    const toLogin = () => setVisitable(true)
    const setToken = (token: string) => localStorage.setItem('login', token)
    const login = (userInfo: {username: string, password: string}) => {
        return fetch('/', { method: 'POST', body: JSON.stringify(userInfo) })
          .then((i) => i.json())
          .then((res) => {
            if (res.status === 200) {
              return res.data;
            }
          })
          .then((data) => {
            setToken(data.token);
          });
    }
    useEffect(() => {
        const token = localStorage.getItem('login')
        if(!token) {
            toLogin();
            return;
        }
        const validateSuccess = validateToken(token)
        if(!validateSuccess) {
            toLogin();
        }
    })

    return { visitable, setVisitable, setToken, validateToken, login };
}
interface UserInfo {
    username: string;
    password: string;
}
const LoginForm = ({
  visitable,
  validateForm,
}: React.PropsWithoutRef<{
  visitable: boolean;
  validateForm: (val: UserInfo) => boolean;
}>) => {
  const [loginForm, setLoginForm] = useState<UserInfo>({
    username: '',
    password: '',
  });
  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 1)',
        zIndex: 10001,
        display: visitable ? 'block' : 'none',
      }}
    >
      <label>用户名：</label>
      <input
        onInput={(event) => {
          const val = (event.target as any).value;
          setLoginForm((prev) => ({ ...prev, username: val }));
        }}
      ></input>
      <br></br>
      <label>密码：</label>
      <input
        onInput={(event) => {
          const val = (event.target as any).value;
          setLoginForm((prev) => ({ ...prev, password: val }));
        }}
      ></input>
      <button onClick={() => validateForm(loginForm)}>登入</button>
    </div>
  );
};
export const Auth = () => {
    const { visitable, setVisitable, login } = useAuth();
    return (
      <Fragment>
        <LoginForm visitable={visitable} onLogin={ login } />
        <button onClick={() => setVisitable(true)}>登入</button>
      </Fragment>
    );
}
