// import LoginBG from "./LoginBg.jpeg";
// //PROD AND TEST
// // import LoginBG from "./LoginBg_ahl.jpg";
// import Logo from "./P3S-logo.jpg";

// import Logo150 from "./P3S-logo-150px.png";
// //PROD AND TEST
// // import Logo150 from "./AHL_Logo.jpeg";

// import Logo200 from "./P3S-logo-200px.png";

// export { LoginBG, Logo, Logo150, Logo200 };

import LoginBG_dev from "./LoginBg.jpeg";
import LoginBG_prod from "./LoginBg_ahl.jpg";
import Logo_dev from "./P3S-logo.jpg";
import Logo_prod from "./AHL_Logo.jpeg";
import Logo150_dev from "./P3S-logo-150px.png";
import Logo150_prod from "./AHL_Logo.jpeg";
import Logo200_dev from "./P3S-logo-200px.png";
import Logo200_prod from "./AHL_Logo.jpeg";

export const LoginBG = process.env.REACT_APP_ENV === 'dev' ? LoginBG_dev : LoginBG_prod;
export const Logo = process.env.REACT_APP_ENV === 'dev' ? Logo_dev : Logo_prod;
export const Logo150 = process.env.REACT_APP_ENV === 'dev' ? Logo150_dev : Logo150_prod;
export const Logo200 = process.env.REACT_APP_ENV === 'dev' ? Logo200_dev : Logo200_prod;

