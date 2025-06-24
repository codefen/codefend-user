import { PrimaryButton } from '@/app/views/components/buttons/primary/PrimaryButton';
import { useState } from 'react';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import { baseUrl } from '@/app/data/utils/config';

export function CreateCompany() {
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    if (!domain) {
      alert('Please enter a domain.');
      return;
    }
    setIsLoading(true);
    setResult(null);

    try {
      const persistedStateJSON = localStorage.getItem('globalStore');
      if (!persistedStateJSON) {
        throw new Error("User session not found. Please log in again.");
      }
      const persistedState = JSON.parse(persistedStateJSON);
      const session = persistedState.session;
      const companyId = persistedState.user?.company_id;

      if (!session || !companyId) {
        throw new Error("Invalid session data. Please log in again.");
      }

      const body = new URLSearchParams({
        model: 'admin/users_add',
        company_web: domain,
        session: session,
        company_id: companyId,
      });

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      });

      const data = await response.json();

      if (data.error === '0') {
        alert(data.info);
        setResult(data);
      } else {
        alert(data.info);
      }
    } catch (error: any) {
      alert(error.message || 'An unexpected error occurred.');
      console.error('Error creating company:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="https://example.com"
            disabled={isLoading}
          />
        </div>
        <PrimaryButton
          click={handleSubmit}
          text={isLoading ? 'Enviando...' : 'Enviar'}
          buttonStyle="send"
          className="form-button"
          isDisabled={isLoading}
        />
        {isLoading && <PageLoader />}
        {result && (
          <div className="result-output">
            <h3>Resultado:</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
} 