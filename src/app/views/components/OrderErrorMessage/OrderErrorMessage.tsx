export const OrderErrorMessage = ({
  tryClick,
  acceptConditions,
}: {
  tryClick: boolean;
  acceptConditions: boolean;
}) => {
  if (tryClick) {
    return (
      <span className={`block error-message ${!acceptConditions && 'vibrate'}`}>
        {`⚠️`} You must accept the terms to continue
      </span>
    );
  } else {
    return null;
  }
};
