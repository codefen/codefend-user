import { PrimaryButton } from '../../../../../components/buttons/primary/PrimaryButton';
export const UserQr = () => {
  return (
    <div className="user-qr">
      <h3>Autenticación de 2 factores</h3>
      <p>
        Active la verificación de dos factores para añadir una capa extra de protección a su cuenta.
        Primero use su teléfono para escanear el QR usando{' '}
        <a className="highlight" href="#">
          Authenticator
        </a>
        .
      </p>
      <div className="qr-contain">
        <img src="/images/qr-demo.png" alt="QR Code for 2FA" />
        <form onSubmit={() => {}}>
          <p>Complete con el número indicado:</p>
          <input className="input-primary" type="text" />
          <PrimaryButton className="form-button" text="validate and confirm doble fase" />
        </form>
      </div>
    </div>
  );
};
