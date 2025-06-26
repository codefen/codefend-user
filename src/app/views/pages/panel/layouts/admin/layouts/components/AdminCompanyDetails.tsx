import Show from '@/app/views/components/Show/Show';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

const AdminCompanyDetails = () => {
  const company = useGlobalFastField('company');

  return (
    <Show
      when={Boolean(company.get)}
      fallback={
        <div className="encabezado internal-tables company-selected-fallback">
          <div className="company-selected-detail internal-tables-active">
            <p className="text-small title-format">Company details</p>
          </div>
          <div className="company-no-selected text-format">
            <p>No company selected</p>
          </div>
        </div>
      }>
      <div>
        <div className="encabezado internal-tables company-selected">
          <div className="company-selected-header internal-tables-active">
            <p className="title text-small title-format">Company details</p>
          </div>
          <div className="company-selected-item text-format">
            <p>{`name: ${company.get?.name}`}</p>
          </div>
          <div className="company-selected-item text-format">
            <p>{`website: ${company.get?.web}`}</p>
          </div>
          <div className="company-selected-item text-format">
            <p>{`country: ${company.get?.pais_code}`}</p>
          </div>
          <div className="company-selected-item text-format">
            <p>{`city: ${company.get?.pais_provincia}`}</p>
          </div>
          <div className="company-selected-item text-format">
            <p>{`address: ${company.get?.pais_ciudad}`}</p>
          </div>
          <div className="company-selected-item text-format">
            <p>{`size: ${company.get?.size}`}</p>
          </div>
        </div>
        <div className="encabezado internal-tables company-members"></div>
      </div>
    </Show>
  );
};

export default AdminCompanyDetails;
