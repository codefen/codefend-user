import { PrimaryButton } from '../../../../../components/buttons/primary/PrimaryButton';
export const UserPassword = () => {
  return (
    <div className="user-password">
      <h3>Cambio de password</h3>
      <p>Cambie la contraseña de su usuario. Su contraseña necesita un mínimo de 12 caracteres.</p>
      <form onSubmit={() => {}} className="form-profile">
        <input className="form-input" type="password" placeholder="Contraseña actual" />
        <input className="form-input" type="password" placeholder="Nueva contraseña" />
        <PrimaryButton className="form-button" text="change password" type="submit" />
      </form>
    </div>
  );
};
