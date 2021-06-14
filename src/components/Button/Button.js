import "./button.css";

const Button = ({ onClick, type, children }) => {
    return (
        <button className="button" type={type} onClick={onClick && onClick}>
            {children}
        </button>
    );
};

export default Button;
