import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import Header from "../../components/Header/Header";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <>
        <Header></Header>
        <>
            {children}
        </>
        </>
    );
}

export default DefaultLayout;
