import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { ModalTitleWrapper } from '@modals/index';
import { useEffect, useState } from 'react';

interface LeakedInfoTypes {
  title: string;
  ac: string;
  class?: string;
  value: string;
}

export const LEAKED_TYPES: Record<string, LeakedInfoTypes> = {
  crack: {
    title: 'Crack information',
    ac: 'hash',
    class: 'hash',
    value: 'hash',
  },
  geo: {
    title: 'Geo information',
    ac: 'whois',
    value: 'regip',
  },
};

export const SnsLeakedDataModal = ({
  isActive,
  close,
  leaked,
  type = 'crack',
  searchClass,
  limitReached,
  updateCompany,
}: {
  isActive: boolean;
  close: () => void;
  leaked: any;
  type: keyof typeof LEAKED_TYPES;
  searchClass: string;
  limitReached: () => void;
  updateCompany: (company: any) => void;
}) => {
  const [fetcher] = useFetcher();
  const [data, setData] = useState<any>(null);
  const { getCompany } = useUserData();
  useEffect(() => {
    if (!isActive || !leaked) return;
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    const fetchCrackData = async () =>
      await fetcher('post', {
        body: {
          class: LEAKED_TYPES[type]?.class || searchClass,
          keyword: leaked[LEAKED_TYPES[type].value],
          company_id: companyID,
        },
        path: `sns/${LEAKED_TYPES[type].ac}`,
        requireSession: true,
      }).then(({ data }: any) => {
        if (apiErrorValidation(data)) {
          closeModal();
          if (data?.error_info === 'paid_user_leaksearch_maximum_reached') {
            limitReached();
          }
          return null;
        }
        updateCompany(data?.company);
        const leak = {
          keyword: data.keyword,
          took: data.response?.took,
          size: type !== 'crack' ? data.response?.size : undefined,
          results: data.response?.results,
        };
        return leak;
      });

    fetchCrackData().then(res => setData(res));
  }, [isActive]);

  const closeModal = () => {
    setData(null);
    close();
  };

  return (
    <ModalTitleWrapper
      close={closeModal}
      isActive={isActive && !!leaked}
      headerTitle={LEAKED_TYPES[type].title}
      type="crack-modal">
      <div className="crack-modal-content">
        <h3>{leaked?.db}</h3>
        {data && (
          <div className="custom-table">
            <div className="columns">
              <span className="bolder item-cell">Keyword:</span>
              <div className="item">{data?.keyword}</div>
            </div>
            {data?.size && (
              <div className="columns">
                <span className="bolder item-cell">Size:</span>
                <div className="item">{data?.size}</div>
              </div>
            )}
            <div className="columns">
              <span className="bolder item-cell">Took:</span>
              <div className="item">{data?.took}</div>
            </div>
            <div
              className={`columns ${Object.keys(data?.results)?.length > 0 ? 'result-column' : ''}`}>
              <span className="bolder item-cell">Results</span>
              <div className="item">
                {Object.keys(data?.results)?.length > 0
                  ? Object.entries(data.results).map(([key, value]: any) => (
                      <div className="item-subgrid" key={key}>
                        <h5>{key}</h5>
                        <SnsDisplayLeakedData type={type} value={value} />
                      </div>
                    ))
                  : 'No results'}
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalTitleWrapper>
  );
};

export const SnsDisplayLeakedData = ({ type, value }: { type: string; value: any }) => {
  if (type === 'crack') {
    return value.map((item: any) => (
      <div key={item?.hash} className="item-subgrid-table">
        <div className="columns">
          <div className="bolder item-cell">hash</div>
          <div className="item">{item?.hash}</div>
        </div>
        <div className="columns">
          <div className="bolder item-cell">password</div>
          <div className="item">{item.password}</div>
        </div>
        <div className="columns">
          <div className="bolder item-cell">salt</div>
          <div className="item">{item.salt}</div>
        </div>
      </div>
    ));
  }
  return (
    <div className="item-subgrid-table">
      <div className="columns">
        <div className="bolder item-cell">Company</div>
        <div className="item">{value?.asname}</div>
      </div>
      <div className="columns">
        <div className="bolder item-cell">ORG</div>
        <div className="item">{value.org}</div>
      </div>
      <div className="columns">
        <div className="bolder item-cell">Country</div>
        <div className="item">{value.country}</div>
      </div>
      <div className="columns">
        <div className="bolder item-cell">City</div>
        <div className="item">{value.city}</div>
      </div>
      <div className="columns">
        <div className="bolder item-cell">Region</div>
        <div className="item">{value.region}</div>
      </div>
      <div className="columns">
        <div className="bolder item-cell">Zip</div>
        <div className="item">{value.zip}</div>
      </div>
      <div className="columns">
        <div className="bolder item-cell">Latitude</div>
        <div className="item">{value.lat}</div>
      </div>
      <div className="columns">
        <div className="bolder item-cell">Longitude</div>
        <div className="item">{value.lon}</div>
      </div>
      <div className="columns">
        <div className="bolder item-cell">Mobile</div>
        <div className="item">{value.mobile ? 'Yes' : 'No'}</div>
      </div>
      <div className="columns">
        <div className="bolder item-cell">Proxy</div>
        <div className="item">{value.proxy ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
};
