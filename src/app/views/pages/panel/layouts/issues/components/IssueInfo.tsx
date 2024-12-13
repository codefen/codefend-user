import type { IssuesStatus, IssueUpdateData } from '@interfaces/issues';
import { formatDate } from '@utils/helper';

interface IssueInfoProps {
  issueData: IssueUpdateData;
  isEditable: boolean;
  isLoaded: boolean;
  isChild: boolean;
  defaultScore: string;
  changeScore: (score: string) => void;
  changeStatus: (score: IssuesStatus) => void;
}

export default function IssueInfo({
  issueData,
  isEditable,
  isLoaded,
  isChild,
  defaultScore,
  changeScore,
  changeStatus,
}: IssueInfoProps) {
  return (
    <div className="info">
      <div>
        Published: <span>{formatDate(issueData.creacion)}</span>
      </div>
      {isChild ? (
        <div className="info-resourcer-id">
          Resource ID: <span>@{issueData.resource_id}</span>
        </div>
      ) : null}

      <div>
        Author: <span>@{issueData.researcher_username}</span>
      </div>
      <div>
        Resource: <span>{issueData.resource_class}</span>
      </div>
      <div>
        Risk:{' '}
        <select
          onChange={(e: any) => changeScore(e.target.value)}
          className="py-3 focus:outline-none log-inputs"
          defaultValue={defaultScore}
          name="score"
          disabled={isEditable || !isLoaded}>
          <option value="5">critical</option>
          <option value="4">elevated</option>
          <option value="3">medium</option>
          <option value="2">low</option>
          <option value="1">intel</option>
          <option value="" hidden>
            Unknown
          </option>
        </select>
      </div>
      <div>
        Status:
        <select
          onChange={(e: any) => changeStatus(e.target.value)}
          className={`log-inputs`}
          defaultValue={issueData.condicion}
          name="status"
          disabled={isEditable || !isLoaded}>
          <option value="open">open</option>
          <option value="fixed">fixed</option>
          <option value="verified">verified</option>
          <option value="" hidden>
            Unknown
          </option>
        </select>
      </div>
    </div>
  );
}
