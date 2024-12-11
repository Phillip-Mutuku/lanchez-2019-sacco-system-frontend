import './App.css';
import { Route, Routes} from 'react-router-dom';
/* Pages */
import TreasurerLogin from './treasurer/TreasurerLogin';
import TreasurerRegister from './treasurer/TreasurerRegister';
import MemberPortal from './members/components/MemberPortal';
import TreasurerDashboard from './treasurer/TreasurerDashboard';





const App = () => {

    return (
  
        <Routes>
          <Route path="/" element={<MemberPortal/>} />
          <Route path="/treasurer/dashboard" element={<TreasurerDashboard/>} />
          <Route path="/treasurer/login" element={<TreasurerLogin/>} />
          <Route path="/treasurer/register" element={<TreasurerRegister/>} />
        </Routes>
  );
};

export default App;