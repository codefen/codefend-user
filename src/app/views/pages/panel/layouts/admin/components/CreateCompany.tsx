import { PrimaryButton } from '@/app/views/components/buttons/primary/PrimaryButton';

export function CreateCompany() {
  return (
    <div className="card">
      <div className="over">
        <div className="header">
          <h2 className="table-title">Crear nueva compañía</h2>
        </div>
        <p>
          Crear una nueva empresa con valores predeterminados y correr
          automaticamente el neuroscan inicial.
        </p>
        <div className="form-input">
          <input type="text" placeholder="https://example.com" />
        </div>
        <PrimaryButton
          click={() => console.log('clicked')}
          text="Enviar"
          buttonStyle="send"
          className="form-button"
        />
      </div>
    </div>
  );
} 