import { useNavigate } from 'react-router';
import './helpCenter.scss';

export const HelpNotfound = () => {
  const navigate = useNavigate();
  return (
    <div className="help-container">
      <div className="help-wrapper not-found">
        <div className="logo" onClick={() => navigate('/')}>
          <img src="/codefend/fav.png" alt="" />
          <span>Codefend</span>
        </div>
        <h2>Not found</h2>
        <h3>We're sorry, but we couldn't find the page you're looking for.</h3>
        <div className="loader-radar">
          <span></span>
        </div>
      </div>
    </div>
  );
};
