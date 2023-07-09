import styles from './Login.module.scss';
import classNames from 'classnames/bind';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';


const cx = classNames.bind(styles);

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate= useNavigate()

    const onSubmit = (user) => {
        axios.post(`${process.env.REACT_APP_SERVER_API}/auth/login`,user,{
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            timeout: 5000
        })
        .then(response => {
            console.log(response.data)
            navigate('/')
        })
        .catch(error=>{
            console.log(error)
        })
    };

    const hanldeSignUp=()=>{
        navigate('/register')
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
                        Wellcome back!
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
                        <div>
                            <button className={cx('submit')} type="submit">
                                ĐĂNG NHẬP
                            </button>
                        </div>
                        <div>
                            <button className={cx('signup')} onClick={hanldeSignUp}>
                                Bạn chưa có tài khoản?
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
