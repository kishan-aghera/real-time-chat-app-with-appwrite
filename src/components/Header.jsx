import { LogOut } from "react-feather";
import useAuth from "../utils/useAuth";

const Header = () => {
  const { user, handleUserLogout } = useAuth();
  return (
    <header id="header--wrapper">
      {user ? (
        <>
          Welcome {user.name}
          <LogOut className="header--link" onClick={handleUserLogout} />
        </>
      ) : (
        <button>Login</button>
      )}
    </header>
  )
};

export default Header;
