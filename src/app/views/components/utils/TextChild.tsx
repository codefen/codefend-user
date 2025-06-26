import type { FC } from 'react';

interface TextChildProps {
  subNetwork: any;
  isLast: boolean;
}

const TextChild: FC<TextChildProps> = ({ isLast, subNetwork }) => (
  <>
    <span className={`sub-domain-icon-v ${isLast && 'sub-is-last'}`}></span>
    <span className="sub-domain-icon-h"></span>
    <span className="sub-resource-domain">{subNetwork}</span>
  </>
);

export default TextChild;
