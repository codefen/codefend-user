import { PrimaryButton } from '@/app/views/components/buttons/primary/PrimaryButton';

export function DeleteNeuroscans() {
  return (
    <div className="card">
      <div className="over">
        <div className="header">
          <h2 className="table-title">Eliminar todos los neuroscans</h2>
        </div>
        <p>
          Elimina (de verdad) todos los neuroscans, incluyendo, el neuroscan en
          sí, los recursos web, recursos sociales, recursos de red e issues
          relacionados, elimina los archivos del fs.
        </p>
        <PrimaryButton
          click={() => console.log('clicked')}
          text="Eliminar"
          buttonStyle="red"
          className="form-button"
        />
      </div>
    </div>
  );
} 