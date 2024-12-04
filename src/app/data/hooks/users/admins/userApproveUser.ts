import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { useState } from 'react';

export const userApproveUser = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [fetcher] = useFetcher();
  const { getAccessToken } = useUserData();

  const fetchApprove = (body: any) => {
    return fetcher('post', {
      path: '/v1/approval/userapproval',
      body: body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const getPanelApprove = () => {
    fetcher('post', {
      path: '/v1/approval/getusers',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }).then((res: any) => {
      if (res === false) {
        console.error('Error fetching panel users approval.');
      } else {
        setPendingUsers(res.data);
      }
    });
  };

  const handleApprove = (id: any, condition: any) => {
    const requestBody = {
      user_id: id,
      approval: condition,
    };

    fetchApprove(requestBody).then(() => {
      setPendingUsers(pendingUsers.filter((user: any) => user.id !== id));
    });
  };

  return { pendingUsers, handleApprove, getPanelApprove };
};
