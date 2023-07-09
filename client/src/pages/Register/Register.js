import { useRef } from 'react';
import styles from './Register.module.scss';
import classNames from 'classnames/bind';

import { useForm } from 'react-hook-form';
import axios from "axios"
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const cx = classNames.bind(styles);

function Register() {
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate() 

    const passwordRef = useRef()
    passwordRef.current = watch('password', '');

    const onSubmit = (user) => {
        axios.post(`${process.env.REACT_APP_SERVER_API}/auth/register`,user,{
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            timeout: 5000
        })
        .then(response =>{
            console.log(response.data)
            navigate('/login')
        })
        .catch(error=>{
            console.log(error)
        })
    };

    const hanldeBackToSignIn=()=>{
        navigate('/login')
    }

    return (
        <div className={cx('login')}>
            <div className={cx('wrapper')}>
                <div className={cx('title')}>
                    <div className={cx('app-name')}>
                    <h2>
                        LEARN{``}
                    </h2>
                    <h3>
                        ENGLISH 
                    </h3>
                    </div>
                    
                    <p>
                    Let join us to improve your English!
                    </p>
                </div>
                <div className={cx('content')}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={cx('input-error')}>
                            <input placeholder="Tên đăng nhập" {...register('username', { required: true, minLength: 6 })} />
                            <p>
                                {errors.username?.type === 'required'
                                    ? '*Không được bỏ trống'
                                    : errors.username?.type === 'minLength'
                                    ? '*Tên người dùng phải có từ 6 kí tự'
                                    : ''}
                            </p>
                        </div>
                        <div className={cx('input-error')}>
                            <input placeholder="Email" {...register('email', { required: true, minLength: 6 ,
                                pattern: {
                                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                }
                            })} />
                            <p>
                                {errors.email?.type === 'required'
                                    ? '*Không được bỏ trống'
                                    : errors.email?.type === 'minLength'
                                    ? '*Email phải có từ 6 kí tự'
                                    : errors.email?.type === 'pattern'
                                    ? "Email không hợp lệ":""}
                            </p>
                        </div>
                        <div className={cx('input-error')}>
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                {...register('password', { required: true, minLength: 6 })}
                            />
                            <p>
                                {errors.password?.type === 'required'
                                    ? '*Không được bỏ trống'
                                    : errors.password?.type === 'minLength'
                                    ? '*Mật khẩu phải có từ 6 kí tự'
                                    : ''}
                            </p>
                        </div>
                        <div className={cx('input-error')}>
                            <input
                                ref= {passwordRef}
                                type="password"
                                placeholder="Nhập lại mật khẩu"
                                {...register('cofirm', { required: true, minLength: 6 ,
                                    validate: (value) => value === passwordRef.current,
                                })}
                            />
                            <p>
                                {errors.cofirm?.type === 'required'
                                    ? '*Không được bỏ trống'
                                    : errors.cofirm?.type === 'minLength'
                                    ? '*Mật khẩu phải có từ 6 kí tự'
                                    : errors.cofirm?.type === 'validate'
                                    ?"Mật khẩu không khớp":""}
                            </p>
                        </div>
                        <div>
                            <button className={cx('submit')} type="submit">
                                ĐĂNG KÝ
                            </button>
                        </div>
                        <div>
                            <button className={cx('signup')} onClick={hanldeBackToSignIn}>
                                Quay lại
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
