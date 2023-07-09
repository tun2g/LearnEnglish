import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import axiosInstance from "../../Util/axiosInstance";
import { useCallback, useEffect, useState } from "react";

const cx = classNames.bind(styles);


function Home() {

    const [list,setList] = useState([])
    useEffect(()=>{
        axiosInstance.get(`${process.env.REACT_APP_SERVER_API}/volcab/get-all`,{
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            timeout: 5000
        })
        .then(response=>{
            setList(response.data.list)
        })
        .catch((error)=>{
            console.log(error.response.status)
        })
    },[])

    return <>
        {
        list.map((e,index)=>{
            return (
                <div key={index}>
                    {e.eng}
                </div>
            )
        })
        }
    </>;
}

export default Home;
