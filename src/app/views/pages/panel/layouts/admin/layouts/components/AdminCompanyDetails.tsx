import useAdminCompanyStore from '@stores/adminCompany.store';
import Show from '@/app/views/components/Show/Show';

const AdminCompanyDetails = () => {
  const { companySelected } = useAdminCompanyStore(state => state);

  return (
    <Show
      when={Boolean(companySelected)}
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
            <p>{`name: ${companySelected?.name}`}</p>
          </div>
          <div className="company-selected-item text-format">
            <p>{`website: ${companySelected?.web}`}</p>
          </div>
          <div className="company-selected-item text-format">
            <p>{`country: ${companySelected?.pais_code}`}</p>
          </div>
          <div className="company-selected-item text-format">
            <p>{`city: ${companySelected?.pais_provincia}`}</p>
          </div>
          <div className="company-selected-item text-format">
            <p>{`address: ${companySelected?.pais_ciudad}`}</p>
          </div>
          <div className="company-selected-item text-format">
            <p>{`size: ${companySelected?.size}`}</p>
          </div>
        </div>
        <div className="encabezado internal-tables company-members"></div>
      </div>
    </Show>
  );
};

export default AdminCompanyDetails;
